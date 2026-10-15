// Scene D (18.8–25.45 s): "Preview everything for free." / "Happy with the result? It's yours for just 499 kroner."
// See ../../../plan/v2-storyboard.md.
//   566    the hand-off laptop (exactly scene C's last frame); a slim preview bar slides into its screen
//   19.24  "everything": the screen's page lifts out and the site's five pages fan out as a 3D cover flow that glides
//   20.18  "Preview everything. Free." with "Free." in blue
//   20.9   the pages gather into one and fly into a phone that turns in; "Happy with the result?" builds on the left
//   21.5   a checkout sheet slides up the phone; on "it's" the button is tapped, it becomes a check and "It's yours"
//   23.0   a blue iris grows out of the button and floods the frame; "499" rolls in as a slot counter; " kr." joins
//   24.95  the group blur-rises out (gone by 759); flat C.blue to the end
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { Ico, Laptop, MobileSite, PH, PW, Phone, SANS, SERIF, SH, SW, Site, f } from "../shared";

type Ease = (t: number) => number;
const LIN: Ease = (t) => t;
const INOUT: Ease = Easing.bezier(0.42, 0, 0.58, 1);
const kf = (g: number, a: number, d: number, e: Ease = ARRIVE) => e(clamp01((g - a) / d));
const W = (w: string) => f(w);

/* ---------- frames ---------- */
const HAND = 566;                 // scene C's last frame: the laptop at (960, 600) s 0.72
const FAN = W("w:everything");    // 577
const GATHER = 620;               // the pages gather (20.8 s)
const PHONE_IN = 632;
const SHEET = 644;                // the checkout sheet slides up (21.47 s)
const TAP = W("w:its");           // 671
const IRIS = 689;                 // the iris starts (22.97 s); full by 702
const FULL = 702;
const OUT = 745;                  // the 499 group leaves; gone by 757

/* ---------- small statement lines (words rise, fade, sharpen) ---------- */
type BW = { t: string; at: string; blue?: boolean };
const Line: React.FC<{ g: number; words: BW[]; x?: number; y: number; size: number; out: number; color?: string; align?: "center" | "left"; weight?: number }> = ({ g, words, x = 0, y, size, out, color = C.ink, align = "center", weight = 600 }) => {
  if (g > out + 30) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? 0 : x, top: y, width: align === "center" ? 1920 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start",
      fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.1, color, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const a = kf(g, W(w.at), 24), o = kf(g, out + i * 1.5, 12, DEPART);
        const bl = (1 - a) * 10 + o * 8;
        return <span key={i} style={{ display: "inline-block", marginLeft: i === 0 ? 0 : size * 0.26, color: w.blue ? C.blue : undefined, opacity: Math.min(1, a * 1.4) * (1 - o),
          transform: `translateY(${(1 - a) * size * 0.3 - o * size * 0.32}px)`, filter: bl > 0.05 ? `blur(${bl}px)` : undefined }}>{w.t}</span>;
      })}
    </div>
  );
};

/* ---------- the preview bar inside the laptop's screen ---------- */
const BAR = 58;
const PreviewBar: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, HAND + 1, 16);
  const pulse = 0.5 + 0.5 * Math.sin((g - HAND) / 6);
  return (
    <div style={{ position: "absolute", left: 0, top: (a - 1) * BAR, width: SW, height: BAR, background: "rgba(255,255,255,0.96)", borderBottom: `1px solid ${C.line}`,
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", boxSizing: "border-box", fontFamily: SANS, zIndex: 3 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 18px 8px 12px", borderRadius: 999, background: C.blueTint, color: C.blueDeep, fontWeight: 600, fontSize: 22 }}>
        <Ico n="eye" s={26} c={C.blueDeep} w={2.4} />Preview
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: i === 0 ? 34 : 10, height: 10, borderRadius: 5, background: i === 0 ? C.blue : C.line }} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 500, fontSize: 20, color: C.gray }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: C.blue, opacity: 0.5 + 0.5 * pulse }} />Free preview
      </div>
    </div>
  );
};

/* ---------- the five pages, as mini pages built from the site's parts ---------- */
const PAGES = ["Home", "Bread", "Cakes", "Catering", "Visit"];
const BG = "#FFFDF9", INK = "#2B1E15", BROWN = "#3A2A1E", MUTE = "#6B5B4E", SAND = "#F2EAE0";
const Nav: React.FC<{ on: string }> = ({ on }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 56px", boxSizing: "border-box" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 28, color: BROWN }}>Bageriet Lund</div>
    <div style={{ display: "flex", gap: 34, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "#5A4A3E" }}>
      {PAGES.slice(1).map((p) => <span key={p} style={{ borderBottom: p === on ? `2px solid ${BROWN}` : "2px solid transparent", paddingBottom: 4, color: p === on ? BROWN : undefined }}>{p}</span>)}
    </div>
  </div>
);
const Pic: React.FC<{ src: string; x: number; y: number; w: number; h: number; pos?: string }> = ({ src, x, y, w, h, pos }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 20, overflow: "hidden", background: SAND }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos ?? "50% 50%", filter: "saturate(0.5) brightness(1.03)" }} />
  </div>
);
const H: React.FC<{ x: number; y: number; size?: number; children: React.ReactNode }> = ({ x, y, size = 58, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.06, color: INK, letterSpacing: "-0.02em" }}>{children}</div>
);
const Bars: React.FC<{ x: number; y: number; ws: number[] }> = ({ x, y, ws }) => (
  <>{ws.map((w, i) => <div key={i} style={{ position: "absolute", left: x, top: y + i * 30, width: w, height: 13, borderRadius: 7, background: "#EADFD2" }} />)}</>
);
const MiniPage: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  if (i === 0) return <Site g={g} build={1} scroll={0} select={false} />;
  const name = PAGES[i];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, background: BG, overflow: "hidden" }}>
      <Nav on={name} />
      {i === 1 && <>
        <Pic src="img/flour.jpg" x={56} y={112} w={600} h={420} />
        <H x={710} y={150}>Our bread</H>
        <Bars x={712} y={250} ws={[440, 400, 300]} />
        {["Sourdough", "Rye", "Seeded"].map((t, j) => (
          <div key={t} style={{ position: "absolute", left: 712, top: 370 + j * 56, width: 460, height: 44, borderRadius: 12, background: SAND, display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box",
            fontFamily: SERIF, fontWeight: 600, fontSize: 20, color: INK }}>{t}</div>
        ))}
        <Pic src="img/pastry.jpg" x={56} y={572} w={1168} h={200} pos="50% 70%" />
      </>}
      {i === 2 && <>
        <H x={56} y={120}>Cakes for every day</H>
        <Bars x={58} y={210} ws={[520, 380]} />
        <Pic src="img/cake.jpg" x={56} y={300} w={560} h={460} />
        <Pic src="img/pastry.jpg" x={640} y={300} w={584} h={220} pos="40% 40%" />
        <Pic src="img/flour.jpg" x={640} y={540} w={584} h={220} />
      </>}
      {i === 3 && <>
        <Pic src="img/pastry.jpg" x={56} y={104} w={1168} h={330} pos="30% 60%" />
        <H x={56} y={478}>Catering</H>
        <Bars x={58} y={566} ws={[560, 500, 340]} />
        <div style={{ position: "absolute", left: 56, top: 680, display: "inline-flex", padding: "15px 28px", borderRadius: 999, background: INK, color: BG, fontFamily: SANS, fontWeight: 600, fontSize: 18 }}>Ask about catering</div>
        <Pic src="img/cake.jpg" x={760} y={478} w={464} h={290} />
      </>}
      {i === 4 && <>
        <H x={56} y={130}>Visit us</H>
        <div style={{ position: "absolute", left: 58, top: 230, fontFamily: SANS, fontWeight: 500, fontSize: 20, color: MUTE, lineHeight: 1.6 }}>In the heart of Aarhus</div>
        <div style={{ position: "absolute", left: 56, top: 310, width: 500, height: 64, borderRadius: 14, background: "#F6EEE4", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px",
          boxSizing: "border-box", fontFamily: SANS, fontWeight: 600, fontSize: 18, color: BROWN }}><span>Opening hours</span><span style={{ fontWeight: 500, color: MUTE }}>Mon–Fri 6–18</span></div>
        <Bars x={58} y={410} ws={[420, 360]} />
        <div style={{ position: "absolute", left: 620, top: 112, width: 604, height: 650, borderRadius: 22, overflow: "hidden", background: "#F1EBE2" }}>
          {[[0, 180, 604, 26], [0, 430, 604, 18], [200, 0, 22, 650], [420, 0, 30, 650]].map(([x, y, w, h], j) => (
            <div key={j} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "#FFFDF9" }} />
          ))}
          <div style={{ position: "absolute", left: 230, top: 210, width: 180, height: 210, borderRadius: 16, background: "#E8DFD2" }} />
          <div style={{ position: "absolute", left: 290, top: 240 }}><Ico n="pin" s={72} c={INK} w={2.6} /></div>
        </div>
      </>}
    </div>
  );
};

/* ---------- the cover flow ---------- */
const CY = 572;
const flowX = (d: number) => Math.sign(d) * (Math.abs(d) < 1 ? Math.abs(d) * 480 : 480 + (Math.abs(d) - 1) * 330);
const Flow: React.FC<{ g: number }> = ({ g }) => {
  if (g < FAN || g > PHONE_IN + 16) return null;
  const spread = kf(g, FAN, 30, MOVE);
  const glide = mix(0, 1.25, kf(g, FAN + 6, GATHER - FAN, INOUT)) + 0.02 * (g - FAN);
  const gat = kf(g, GATHER, 14, MOVE), fly = kf(g, GATHER + 6, 20, MOVE);
  const startS = 0.72 + 0.03 * kf(FAN, HAND, 30, INOUT), baseS = 0.5;
  const lab = kf(g, FAN + 14, 16) * (1 - kf(g, GATHER - 4, 8, DEPART));
  const cards = PAGES.map((name, i) => {
    const d = (i - glide) * spread * (1 - gat);
    const ad = Math.abs(d);
    const x = 960 + flowX(d) + mix(0, PX - 960, fly);
    const y = mix(600, CY, spread) - 10 * spread * (1 - gat) + mix(0, -30, fly);
    const ry = -Math.max(-1, Math.min(1, d)) * 40;
    const z = -Math.min(ad, 2.2) * 160;
    const s = mix(startS, baseS, spread) * mix(1, 0.4, fly);
    const born = i === 0 ? 1 : clamp01(spread * 3 - i * 0.25);
    const o = born * (1 - kf(g, PHONE_IN + 2, 12, DEPART));
    return { name, i, x, y, ry, z, s, o, ad };
  }).sort((a, b) => b.ad - a.ad);
  return (
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "960px 600px" }}>
      {cards.map((c) => c.o > 0.005 && (
        <div key={c.name} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, opacity: c.o, transformOrigin: "50% 50%",
          transform: `translate3d(${c.x - SW / 2}px, ${c.y - SH / 2}px, ${c.z}px) rotateY(${c.ry + 0.01}deg) scale(${c.s})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: mix(14, 30, spread), overflow: "hidden", background: BG,
            boxShadow: `0 0 0 ${2 / c.s}px rgba(29,29,31,0.05), 0 ${60}px ${120}px -${50}px rgba(29,29,31,${0.45 * spread})` }}>
            {c.i === 0 ? <>
              <div style={{ position: "absolute", left: 0, top: BAR * (1 - spread), width: SW, height: SH }}><Site g={g} build={1} scroll={0} select={false} /></div>
              {spread < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - spread }}><PreviewBar g={g} /></div>}
            </> : <MiniPage g={g} i={c.i} />}
          </div>
          <div style={{ position: "absolute", left: 0, top: SH + 44, width: SW, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: "-0.02em",
            color: c.ad < 0.5 ? C.ink : C.gray, opacity: lab * clamp01(1.6 - c.ad * 0.45) }}>{c.name}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- the phone, the checkout sheet ---------- */
const PX = 1290, PY = 552, PS = 1.0;
const BTN = { x: PW / 2, y: PH - 96 };                // the button's centre in screen coordinates
const phoneRy = (g: number) => mix(26, 9, kf(g, PHONE_IN, 34)) - 9 * kf(g, PHONE_IN + 22, 66, LIN);
const btnOnScreen = (g: number) => {
  const ry = (phoneRy(g) * Math.PI) / 180;
  const lx = (13 + BTN.x - (PW + 26) / 2) * PS, ly = (13 + BTN.y - (PH + 26) / 2) * PS;
  const dr = kf(g, PHONE_IN + 20, 70, LIN);
  return { x: PX - 30 * dr + lx * Math.cos(ry), y: PY - 22 * dr + ly };
};
const Sheet: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, SHEET, 22);
  if (a <= 0) return null;
  const press = Math.sin(Math.PI * kf(g, TAP - 2, 6, LIN));
  const done = kf(g, TAP + 2, 10, MOVE);
  const rip = kf(g, TAP, 18, LIN);
  const SHT = 380;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(29,29,31,${0.22 * a})` }} />
      <div style={{ position: "absolute", left: 0, top: PH - SHT * a, width: PW, height: SHT + 40, borderRadius: "34px 34px 0 0", background: C.white,
        boxShadow: "0 -20px 50px -20px rgba(29,29,31,0.35)", fontFamily: SANS }}>
        <div style={{ position: "absolute", left: PW / 2 - 22, top: 10, width: 44, height: 5, borderRadius: 3, background: C.line }} />
        <div style={{ position: "absolute", left: 26, top: 38, fontWeight: 600, fontSize: 30, letterSpacing: "-0.025em", color: C.ink }}>Your website</div>
        <div style={{ position: "absolute", left: 26, top: 82, fontWeight: 500, fontSize: 18, color: C.gray }}>Bageriet Lund</div>
        <div style={{ position: "absolute", left: 26, top: 130, width: PW - 52, height: 1, background: C.line }} />
        {[["One payment", "499 kr"], ["Subscription", "None"]].map(([l, r], j) => (
          <div key={l} style={{ position: "absolute", left: 26, top: 150 + j * 42, width: PW - 52, display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 500, color: C.gray }}>
            <span>{l}</span><span style={{ color: C.ink, fontWeight: 600 }}>{r}</span>
          </div>
        ))}
        <div style={{ position: "absolute", left: 22, top: SHT - 96 - 36, width: PW - 44, height: 72 }}>
          {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: (PW - 44) / 2 - 40, top: -4, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.32)",
            opacity: 1 - rip, transform: `scale(${0.6 + 2.6 * ARRIVE(rip)})`, zIndex: 2 }} />}
          <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: C.blue, transform: `scale(${1 - 0.05 * press})`, boxShadow: `0 14px 30px -14px ${C.blueGlow}`,
            display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 600, fontSize: 26, letterSpacing: "-0.015em", overflow: "hidden" }}>
            <span style={{ position: "absolute", opacity: 1 - done, transform: `translateY(${-done * 20}px)` }}>Get it for 499 kr</span>
            <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, opacity: done, transform: `translateY(${(1 - done) * 20}px)` }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mix(0.4, 1, done)})` }}>
                <Ico n="check" s={22} c={C.blue} w={3.4} />
              </span>It's yours
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
const PhoneShot: React.FC<{ g: number }> = ({ g }) => {
  const a = kf(g, PHONE_IN, 30);
  if (a <= 0 || g > FULL) return null;
  const ry = phoneRy(g);
  const x = mix(PX + 260, PX, a) - 30 * kf(g, PHONE_IN + 20, 70, LIN), y = PY + mix(60, 0, a) - 22 * kf(g, PHONE_IN + 20, 70, LIN);
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${x}px ${y}px`, transform: `perspective(2200px) rotateY(${ry}deg)`, opacity: clamp01(a * 2) }}>
      <div style={{ position: "absolute", left: x - 340, top: y + 400, width: 680, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(29,29,31,0.18) 0%, rgba(29,29,31,0) 70%)" }} />
      <Phone x={x} y={y} s={PS}>
        <MobileSite g={g} build={1} />
        <Sheet g={g} />
      </Phone>
    </div>
  );
};

/* ---------- the slot-machine price ---------- */
const DIG = 320, CELL = 1.12;
const Digit: React.FC<{ g: number; d: number; i: number }> = ({ g, d, i }) => {
  const start = W("w:499") - 3 + i * 2.2, dur = 13 + i * 0.4;
  const p = kf(g, start, dur, Easing.bezier(0.2, 0.6, 0.25, 1));
  const N = 9 + i * 2;
  const seq = Array.from({ length: N }, (_, j) => (j === N - 1 ? d : (d + 3 + j * 7 + i * 3) % 10));
  const pos = (N - 1) * p;                          // in cells; the strip rolls up
  const vel = (N - 1) * (kf(g + 0.5, start, dur, Easing.bezier(0.2, 0.6, 0.25, 1)) - kf(g - 0.5, start, dur, Easing.bezier(0.2, 0.6, 0.25, 1)));
  const o = clamp01((g - start + 1) / 3);
  return (
    <div style={{ position: "relative", width: "0.62em", height: `${CELL}em`, overflow: "hidden", opacity: o,
      WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-pos * CELL * DIG}px)`, filter: vel > 0.05 ? `blur(${Math.min(10, vel * 9)}px)` : undefined }}>
        {seq.map((n, j) => <div key={j} style={{ height: `${CELL}em`, lineHeight: `${CELL}em`, textAlign: "center" }}>{n}</div>)}
      </div>
    </div>
  );
};
const Price: React.FC<{ g: number }> = ({ g }) => {
  if (g < W("w:499") - 4 || g >= 758) return null;
  const kr = kf(g, W("w:kroner") - 1, 18), sub = kf(g, W("w:kroner") + 5, 20);
  const push = 1 + 0.09 * kf(g, FULL, 56, LIN);
  const out = kf(g, OUT, 12, DEPART);
  const KRW = 0.98 * DIG;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${push}) translateY(${-out * 40}px)`, transformOrigin: "960px 520px", opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 520 - (CELL * DIG) / 2 - 30, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: SANS, fontWeight: 700,
        fontSize: DIG, letterSpacing: "-0.04em", color: C.white, fontVariantNumeric: "tabular-nums" }}>
        {[4, 9, 9].map((d, i) => <Digit key={i} g={g} d={d} i={i} />)}
        <div style={{ width: mix(0, KRW, MOVE(kr)), height: `${CELL}em`, position: "relative", overflow: "visible" }}>
          <span style={{ position: "absolute", left: 0.2 * DIG, top: 0, lineHeight: `${CELL}em`, whiteSpace: "nowrap", opacity: kr, fontWeight: 600,
            transform: `translateY(${(1 - kr) * 60}px)`, filter: kr < 0.98 ? `blur(${(1 - kr) * 10}px)` : undefined }}>kr.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 800, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, letterSpacing: "-0.02em",
        color: "rgba(255,255,255,0.92)", opacity: sub, transform: `translateY(${(1 - sub) * 24}px)`, filter: sub < 0.98 ? `blur(${(1 - sub) * 8}px)` : undefined }}>
        One payment. No subscription.
      </div>
    </div>
  );
};

/* ---------- the scene ---------- */
export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < HAND || g > f(25.45)) return null;

  // the laptop: a slow push while the bar arrives, then it sinks away as its page lifts out
  const push = kf(g, HAND, 30, INOUT);
  const sink = kf(g, FAN, 22, MOVE);
  const ls = 0.72 + 0.03 * push - 0.1 * sink;
  const ly = 600 + 340 * sink;
  const lo = 1 - kf(g, FAN + 4, 16, DEPART);
  const bar = g > HAND;

  // the iris
  const iris = kf(g, IRIS, FULL - IRIS, Easing.bezier(0.55, 0, 0.45, 1));
  const b = btnOnScreen(g);
  const R = mix(34, 2300, iris);

  return (
    <AbsoluteFill>
      {g < FULL && <>
        {lo > 0.01 && (
          <Laptop x={960} y={ly} s={ls} o={lo}>
            {g < FAN ? (
              <>
                <div style={{ position: "absolute", left: 0, top: bar ? kf(g, HAND + 1, 16) * BAR : 0, width: SW, height: SH }}><Site g={g} build={1} scroll={0} select={false} /></div>
                {bar && <PreviewBar g={g} />}
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${C.blueTint} 0%, #FFFFFF 60%)` }} />
            )}
          </Laptop>
        )}
        <Flow g={g} />
        <PhoneShot g={g} />

        {/* "Preview everything. Free." */}
        <Line g={g} y={96} size={76} out={GATHER + 2} words={[{ t: "Preview", at: "w:preview" }, { t: "everything.", at: "w:everything" }, { t: "Free.", at: "w:free", blue: true }]} />

        {/* "Happy with the result?" / "It's yours." on the left of the phone */}
        <Line g={g} align="left" x={190} y={392} size={64} color={C.gray} weight={600} out={FULL} words={[{ t: "Happy", at: "w:happy" }, { t: "with", at: "w:with" }, { t: "the", at: "w:the2" }, { t: "result?", at: "w:result" }]} />
        <Line g={g} align="left" x={186} y={480} size={128} out={FULL} words={[{ t: "It's", at: "w:its" }, { t: "yours.", at: "w:yours", blue: true }]} />
      </>}

      {/* the iris grows out of the button and floods the frame */}
      {iris > 0 && iris < 1 && (
        <div style={{ position: "absolute", left: b.x - R, top: b.y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: C.blue }} />
      )}
      {g >= FULL && <AbsoluteFill style={{ background: C.blue }} />}
      {g >= FULL - 2 && g < OUT + 4 && (
        <div style={{ position: "absolute", left: 960 - 900, top: 520 - 600, width: 1800, height: 1200, borderRadius: "50%", opacity: 0.5 * kf(g, FULL - 2, 20) * (1 - kf(g, OUT - 16, 12, DEPART)),
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 70%)" }} />
      )}
      <Price g={g} />
    </AbsoluteFill>
  );
};
