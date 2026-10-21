// Builder 3 — B3, the deal: two columns (plan/storyboard.md). From Handoff2 the site settles into the left column
// while "Tilfreds?" rises in as the right column's heading; Creoble's price card settles and builds its answer row by
// row (499 kr · 1 betaling ✓ · Abonnement switched off); the site gets a sage ring and a Glass "Din" chip; on "Ikke
// tilfreds?" the card flips over its horizontal axis (critically damped spring) to the other answer (Du betaler 0 kr ·
// Glass "Nul risiko"); then the site carries back over everything to exactly Handoff3.
import React from "react";
import {
  C, EXIT, Glass, HOME, Handoff2, Handoff3, INOUT, OUT, SANS, SERIF, SHADOW, Scrim, SiteHome, WIPE,
  aspring, clamp01, f, k, kf, mix,
} from "../shared";

const S = 0.51;                          // the site's scale in the left column
const COL = { x: 170, y: 376 };          // its top-left there
const CARD = { x: 1000, y: 376, w: 740 };
const HEAD = { x: 1000, y: 220, size: 100 };
const OUTAT = "w:risiko-0.15";           // everything clears; the site carries home
const H0 = 272, R1 = 88, R2 = 76, HB = 312;   // card heights: price only, + row 1, + row 2; the back face

// A line revealed through its own mask: rises in on pin 0 → 1, wipes up and out on pout 0 → 1.
const Mask: React.FC<{ pin: number; pout?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ pin, pout = 0, children, style }) => (
  <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.16em", marginBottom: "-0.16em", ...style }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - clamp01(pin)) * 108 - clamp01(pout) * 108}%)` }}>{children}</span>
  </span>
);

// Creoble's switch, driven straight by a spring (the kit's Toggle eases again); the knob stretches a little in transit,
// as an iOS switch does.
const Switch: React.FC<{ on: number; size?: number }> = ({ on, size = 40 }) => {
  const q = clamp01(on), tr = 4 * q * (1 - q), kw = size * 0.82 * (1 + 0.24 * tr), W = size * 1.7;
  return (
    <div style={{ width: W, height: size, borderRadius: size, background: `color-mix(in srgb, ${C.sage} ${q * 100}%, #DCD8D1)`, position: "relative", flex: "none" }}>
      <div style={{ position: "absolute", top: size * 0.09, left: size * 0.09 + q * (W - size * 0.18 - kw), width: kw, height: size * 0.82, borderRadius: size, background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }} />
    </div>
  );
};

// The shield with its check drawn on (d 0..1).
const Shield: React.FC<{ s: number; d: number }> = ({ s, d }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={C.sageDeep} strokeWidth={(2.2 * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
    <path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" />
    <path d="M17 24 L22 29 L31 19" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(d)} />
  </svg>
);

// One answer row of the price card: a hairline that draws, the label through its mask, a control on the right.
const Row: React.FC<{ y: number; p: number; label: string; color?: string; children?: React.ReactNode }> = ({ y, p, label, color = C.ink, children }) => (
  <div style={{ position: "absolute", left: 48, right: 48, top: y, height: 76 }}>
    <div style={{ position: "absolute", left: 0, top: 0, height: 1, width: `${100 * WIPE(clamp01(p * 1.3))}%`, background: C.line }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1, bottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: SANS, fontSize: 30, color }}><Mask pin={OUT(clamp01(p))}>{label}</Mask></div>
      <div style={{ opacity: clamp01(p * 2) }}>{children}</div>
    </div>
  </div>
);

export const Scene3: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h2") || g >= f("h3")) return null;
  if (g === f("h2")) return <Handoff2 />;
  if (g === f("h3") - 1) return <Handoff3 />;

  // ---- the site: home → left column (on the hand-off), and back home at the end ----
  const inP = aspring(g, "h2", 0.65);
  const outP = kf(g, f(OUTAT), f("h3") - 1 - f(OUTAT), INOUT);
  const p = inP * (1 - outP);
  const sc = mix(1, S, p), tx = mix(0, COL.x - HOME.x, p), ty = mix(0, COL.y - HOME.y, p);
  const R = { x: HOME.x + tx, y: HOME.y + ty, w: HOME.w * sc, h: HOME.h * sc };
  // the page browses slowly down under its frame while it waits in the column, and back up to the top before it goes home
  const su = clamp01((g - f("w:tilfreds+0.4")) / (f(OUTAT) - f("w:tilfreds+0.4")));
  const scroll = 400 * (1 - Math.cos(2 * Math.PI * su)) / 2;

  // ---- "Siden er din": ring + Glass chip; they leave when the question turns ----
  const ring = k(g, "w:siden2", 0.7, WIPE);
  const turn = aspring(g, "w:ikke-0.15", 0.35);              // the ring and the chip go as the card turns
  const din = aspring(g, "w:din3", 0.4) * (1 - turn);
  const dim = 0.55 * k(g, "w:ikke", 0.5) * (1 - outP);       // dim to focus on the other answer

  // ---- the price card ----
  const arrive = aspring(g, "w:499", 0.45);
  const n = Math.round(499 * k(g, "w:499", 0.6, OUT));
  const kr = k(g, "w:kroner", 0.5);
  const r1 = aspring(g, "w:n", 0.45), r2 = aspring(g, "w:intet", 0.45);
  const off = aspring(g, "w:abonnement", 0.35);
  const flip = aspring(g, "w:tilfreds2", 0.75);  // rotateX 0 → 180, critically damped (no spin, no overshoot)
  const ang = 180 * flip, front = ang < 90, rot = front ? ang : ang - 180;
  const lift = Math.sin(Math.PI * clamp01(flip));
  const H = mix(H0 + R1 * r1 + R2 * r2, HB, flip);
  const zero = k(g, "w:ingenting", 0.55);
  const nul = aspring(g, "w:nul", 0.4);
  const leave = k(g, "w:risiko-0.05", 0.3, INOUT);         // the right column gives way as the site comes home

  const title: React.CSSProperties = { position: "absolute", left: 48, top: 42, fontFamily: SERIF, fontSize: 42, letterSpacing: "-0.025em", lineHeight: 1.15, whiteSpace: "nowrap" };
  const price: React.CSSProperties = { position: "absolute", left: 46, top: 104, display: "flex", alignItems: "baseline", gap: 28, fontFamily: SERIF, fontSize: 124, letterSpacing: "-0.03em", lineHeight: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" };

  return (
    <>
      {/* right column: heading, card, "Nul risiko" (under the site, which covers it on the way home) */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, transform: `translateX(${56 * leave}px)` }}>
        <div style={{ position: "absolute", left: HEAD.x, top: HEAD.y, fontFamily: SERIF, fontSize: HEAD.size, letterSpacing: "-0.025em", lineHeight: 1.06, color: C.ink, whiteSpace: "nowrap" }}>
          <Mask pin={k(g, "w:tilfreds", 0.55)} pout={k(g, "w:ikke-0.32", 0.36, EXIT)}>Tilfreds?</Mask>
        </div>
        <div style={{ position: "absolute", left: HEAD.x, top: HEAD.y, fontFamily: SERIF, fontSize: HEAD.size, letterSpacing: "-0.025em", lineHeight: 1.06, color: C.ink, whiteSpace: "nowrap", display: "flex", columnGap: HEAD.size * 0.17 }}>
          <Mask pin={k(g, "w:ikke", 0.55)} pout={k(g, "w:nul+0.15", 0.35, WIPE)} style={{ paddingRight: "0.06em" }}><span style={{ fontStyle: "italic", color: C.sageDeep }}>Ikke</span></Mask>
          <Mask pin={k(g, "w:tilfreds2", 0.55)} pout={k(g, "w:nul+0.2", 0.35, WIPE)}>tilfreds?</Mask>
        </div>

        {arrive > 0 && (
          <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: H, perspective: 2200, perspectiveOrigin: "50% 50%" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, overflow: "hidden", color: C.ink,
              boxShadow: lift > 0.01 ? `0 ${2 + 26 * lift}px ${32 + 50 * lift}px -${12 + 10 * lift}px rgba(26,22,20,${0.14 + 0.12 * lift}), 0 1px 2px rgba(26,22,20,0.05)` : SHADOW,
              opacity: clamp01(arrive * 1.4), transformOrigin: "50% 50%", transform: `scale(${mix(0.965, 1, arrive) * (1 + 0.035 * lift)}) rotateX(${-rot}deg)` }}>
              {front ? (
                <>
                  <div style={title}>Din hjemmeside</div>
                  <div style={price}><span>{n}</span><Mask pin={kr}>kr</Mask></div>
                  <Row y={244} p={k(g, "w:n", 0.5)} label="1 betaling"><Check36 p={k(g, "w:gang", 0.35)} /></Row>
                  <Row y={320} p={k(g, "w:intet", 0.5)} label="Abonnement" color={`color-mix(in srgb, ${C.soft} ${off * 100}%, ${C.ink})`}><Switch on={1 - off} /></Row>
                </>
              ) : (
                <>
                  <div style={title}><Mask pin={k(g, "w:s", 0.55)}>Du betaler</Mask></div>
                  <div style={price}><Mask pin={zero}>0</Mask><Mask pin={k(g, "w:ingenting+0.08", 0.5)}>kr</Mask></div>
                </>
              )}
            </div>
          </div>
        )}

        {nul > 0 && (
          <div style={{ position: "absolute", left: CARD.x + CARD.w / 2, top: CARD.y + H, transform: `translate(-50%, ${-50 + (1 - nul) * 22}%)` }}>
            <Glass p={nul} radius={999} weight={1.1} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 30px 14px 22px", fontSize: 30, fontWeight: 500, whiteSpace: "nowrap" }}>
              <Shield s={36} d={k(g, "w:nul+0.12", 0.45, WIPE)} />Nul risiko
            </Glass>
          </div>
        )}
      </div>

      {/* the site (the thread object), on top */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${HOME.x}px ${HOME.y}px`, transform: `translate(${tx}px, ${ty}px) scale(${sc})` }}>
        <SiteHome booking={1} scroll={scroll} />
        {dim > 0.002 && (
          <div style={{ position: "absolute", left: HOME.x, top: HOME.y, width: HOME.w, height: HOME.h, borderRadius: 16, overflow: "hidden" }}><Scrim p={dim} /></div>
        )}
      </div>
      {ring > 0 && (
        <svg width={R.w + 28} height={R.h + 28} style={{ position: "absolute", left: R.x - 14, top: R.y - 14, overflow: "visible", opacity: 1 - turn }}>
          <rect x={1.5} y={1.5} width={R.w + 25} height={R.h + 25} rx={16 * sc + 13} fill="none" stroke={C.sage} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} />
        </svg>
      )}
      {din > 0.001 && (
        <div style={{ position: "absolute", left: R.x + R.w / 2, top: R.y + R.h, transform: `translate(-50%, ${-50 + (1 - din) * 22}%)` }}>
          <Glass p={din} radius={999} weight={1.1} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 30px 14px 22px", fontSize: 30, fontWeight: 500 }}>
            <UserIco /><span>Din</span>
          </Glass>
        </div>
      )}
    </>
  );
};

const Check36: React.FC<{ p: number }> = ({ p }) => {
  const q = OUT(clamp01(p));
  return (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", opacity: q, transform: `scale(${0.6 + 0.4 * q})` }}>
      <svg width={27} height={27} viewBox="0 0 48 48" fill="none" stroke={C.white} strokeWidth={5.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 25 L20 33 L36 15" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 1.4 - 0.2)} /></svg>
    </div>
  );
};

const UserIco: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 48 48" fill="none" stroke={C.sageDeep} strokeWidth={(2.2 * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <circle cx="24" cy="16" r="7" /><path d="M10 41 c2 -9 7 -13 14 -13 s12 4 14 13" />
  </svg>
);
