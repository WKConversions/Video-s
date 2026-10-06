// Every object on the one stage, as a pure function of the frame and the labels (clock.ts). The thread of the film is the
// cable between the two brand tiles: it links them, carries the film WKConversions made to bFound, arches over the
// response, pulls the lock open with both tiles, feeds the code, flanks the contact page and holds the end lockup.
import React from "react";
import { T, CODE_TIMES } from "./clock";
import { ARRIVE, C, DEPART, F, GLASS, GRAD, MOVE, clamp01, lerp, mix, rgba } from "./lib";
import { EASE, track } from "./kinetic";
import { BfLogo, Cable, Cursor, Glyph, GradText, Headline, Label, P, Skel, Tile, Window, WkcMark } from "./ui";

const k = (g: number, pos: string | number, dur: number, ease: (t: number) => number = ARRIVE) => T.k(g, pos, dur, ease);
const sec = (g: number) => g / 30;
/** In (scale 0.6 → 1 on the soft ease-out, the style's tile entrance) and out (scale down and fade). */
const life = (g: number, a: string, b?: string, dIn = 0.55, dOut = 0.4) => {
  const u = k(g, a, dIn), e = b ? k(g, b, dOut, MOVE) : 0;
  return { s: lerp(0.6, 1, u) * (1 - 0.25 * e), o: clamp01(u * 1.6) * (1 - e), on: u > 0 && e < 1 };
};
const at = (x: number, y: number, s = 1, o = 1, origin = "50% 50%"): React.CSSProperties =>
  ({ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s})`, transformOrigin: origin, opacity: o, willChange: "transform" });

// ---------- the two brand tiles: they part from one point, leave by shrinking where they stand, perch, come back ----------
const WKC_T = (g: number) => track(g, [
  ["open", 880, 540, 120, 0], ["open+0.75", 700, 540, 190, 1, ARRIVE], ["more", 700, 540, 190, 1], ["more+0.7", 380, 600, 170, 1, MOVE],
  ["maker", 380, 600, 170, 1], ["maker+0.6", 330, 610, 200, 1, MOVE], ["response+0.3", 330, 610, 200, 1], ["response+1.0", 230, 200, 120, 1, MOVE],
  ["price-0.3", 230, 200, 120, 1], ["price+0.3", 230, 200, 90, 0, MOVE], ["wkc", 520, 220, 120, 0], ["wkc+0.7", 640, 220, 170, 1, ARRIVE],
  ["field-0.3", 640, 220, 170, 1], ["field+0.4", 330, 230, 150, 1, MOVE], ["visit-0.2", 330, 230, 150, 1], ["visit+0.5", 250, 130, 104, 1, MOVE],
  ["endcard-0.3", 250, 130, 104, 1], ["endcard", 250, 130, 80, 0, MOVE], ["endcard+0.05", 960, 340, 140, 0], ["endcard+0.85", 730, 340, 230, 1, MOVE], ["end", 742, 340, 230, 1],
]);
const BF_T = (g: number) => track(g, [
  ["open", 1040, 540, 120, 0], ["link", 1040, 540, 120, 0], ["link+0.75", 1220, 540, 190, 1, ARRIVE], ["more", 1220, 540, 190, 1], ["more+0.7", 1540, 600, 170, 1, MOVE],
  ["maker", 1540, 600, 170, 1], ["maker+0.6", 1640, 610, 170, 1, MOVE], ["deliver+0.5", 1640, 610, 170, 1], ["deliver+0.9", 1640, 610, 200, 1, ARRIVE],
  ["response", 1640, 610, 200, 1], ["response+0.45", 1690, 200, 120, 1, MOVE],
  ["price-0.3", 1690, 200, 120, 1], ["price+0.3", 1690, 200, 90, 0, MOVE], ["bf", 1400, 220, 120, 0], ["bf+0.7", 1280, 220, 170, 1, ARRIVE],
  ["field-0.3", 1280, 220, 170, 1], ["field+0.4", 1590, 230, 150, 1, MOVE], ["visit-0.2", 1590, 230, 150, 1], ["visit+0.5", 1670, 130, 104, 1, MOVE],
  ["endcard-0.3", 1670, 130, 104, 1], ["endcard", 1670, 130, 80, 0, MOVE], ["endcard+0.05", 960, 340, 140, 0], ["endcard+0.85", 1190, 340, 230, 1, MOVE], ["end", 1178, 340, 230, 1],
]);

// ---------- the film WKConversions made for bFound (its own frame: the logo over a pale lilac gradient and the url pill) ----------
const BfFilm: React.FC<{ w: number; h: number; build: number; t: number; fade?: number }> = ({ h, build, t, fade = 1 }) => {
  const b1 = clamp01(build * 3), b2 = clamp01(build * 3 - 1), b3 = clamp01(build * 3 - 2);
  const sh = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `radial-gradient(120% 90% at ${30 + 20 * sh}% 0%, #FFFFFF, #EEF0FC 55%, #E3E2FA)` }}>
      <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%, -50%) scale(${lerp(0.94, 1, fade)})`, display: "flex", alignItems: "center", opacity: fade }}>
        <div style={{ opacity: ARRIVE(b1), transform: `scale(${lerp(0.5, 1, ARRIVE(b1))}) rotate(${(1 - ARRIVE(b1)) * -30}deg)` }}><BfLogo h={h * 0.2} mark /></div>
        <div style={{ width: (h * 0.2 * 1831) / 466 - h * 0.2 * 1.02, height: h * 0.2, overflow: "hidden", position: "relative", clipPath: `inset(0 ${(1 - ARRIVE(b2)) * 100}% 0 0)` }}>
          <BfLogo h={h * 0.2} style={{ position: "absolute", left: -h * 0.2 * 1.02, top: 0 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "70%", transform: `translate(-50%, ${(1 - ARRIVE(b3)) * 30}px)`, opacity: ARRIVE(b3) * fade, padding: `${h * 0.03}px ${h * 0.07}px`, borderRadius: 999,
        background: "linear-gradient(90deg, #A9A3EE, #C2B8F4)", color: "#fff", fontFamily: F.ui, fontWeight: 500, fontSize: h * 0.06, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>bfoundconsulting.com</div>
    </div>
  );
};

// ---------- the LinkedIn response (the post as it reads; commenters stay anonymous: no names, no faces) ----------
const QUOTE = "been waiting to share this!! 🎬 bFound. looking kinda goooood huge credit to Karl van Kessel from WKConversions for making this video for me!";
const Reaction: React.FC<{ name: string; bg: string; size: number }> = ({ name, bg, size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px #fff", flex: "none" }}>
    <Glyph name={name} size={size * 0.62} color="#fff" stroke={2} />
  </div>
);
const REACT = [["thumb", "#378FE9"], ["clap", "#44A35C"], ["heart", "#E0605A"]] as const;
const PostCard: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  const n1 = Math.round(118 * EASE.steady(k(g, "response+0.6", 1.6, (u) => u))), n2 = Math.round(45 * EASE.steady(k(g, "response+0.75", 1.6, (u) => u)));
  const big = k(g, "right", 0.7, MOVE), play = clamp01((t - T.s("right") - 0.3) / 2.2);
  return (
    <div style={{ width: 640, borderRadius: 26, ...GLASS, background: "linear-gradient(170deg, rgba(255,255,255,0.97), rgba(255,255,255,0.92))", padding: 26, boxSizing: "border-box", fontFamily: F.ui, color: C.ink }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: C.bfSoft, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 1.5px ${C.line}` }}><BfLogo h={30} mark /></div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Emma Bauditz</div>
          <div style={{ fontSize: 15, color: C.txt2 }}>Founder Branding & Digital Strategy · bFound</div>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 19, lineHeight: 1.42, color: C.ink2 }}>{QUOTE}</div>
      <div style={{ position: "relative", marginTop: 16, height: 316, borderRadius: 16, overflow: "hidden", transform: `scale(${1 + 0.06 * big})`, transformOrigin: "50% 50%", boxShadow: big > 0 ? `0 ${30 * big}px ${60 * big}px -30px rgba(40,50,110,0.5)` : undefined }}>
        <BfFilm w={588} h={316} build={1} t={t} />
        <div style={{ position: "absolute", left: 22, bottom: 22, width: 56, height: 56, borderRadius: "50%", background: "rgba(11,19,36,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 1 - big }}><Glyph name="play" size={28} color="#fff" fill="#fff" /></div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${play * 100}%`, background: GRAD, opacity: big }} />
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: C.txt2 }}>
        <div style={{ display: "flex" }}>{REACT.map(([n, c], i) => <div key={n} style={{ marginLeft: i ? -8 : 0 }}><Reaction name={n} bg={c} size={30} /></div>)}</div>
        <span style={{ fontWeight: 700, color: C.ink, fontVariantNumeric: "tabular-nums", minWidth: 40 }}>{n1}</span>
        <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}><b style={{ color: C.ink }}>{n2}</b> comments</span>
      </div>
    </div>
  );
};
/** Comments arriving under the post: anonymous (a gradient disc, no face, no name), the words as skeleton lines. */
const Comments: React.FC<{ g: number; x: number; y: number }> = ({ g, x, y }) => {
  const t = sec(g), t0 = T.s("shows");
  if (t < t0 - 0.1 || t > T.s("price") + 0.2) return null;
  const out = k(g, "price-0.45", 0.45, MOVE);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const born = t0 + i * 0.6, age = t - born;
    if (age < 0) continue;
    const yy = y + 300 - age * 100;
    if (yy < y - 420) continue;
    const a = ARRIVE(clamp01(age / 0.45)), fadeTop = clamp01((yy - (y - 420)) / 120);
    const hue = [C.wkc, C.violet, C.bf, C.sky, C.lilac][i % 5];
    items.push(
      <div key={i} style={{ ...at(x, yy, lerp(0.85, 1, a), a * fadeTop * (1 - out)), width: 500, height: 100, borderRadius: 22, background: "#fff", boxShadow: "0 16px 30px -18px rgba(40,50,110,0.35), inset 0 0 0 1px #E6E9F2", display: "flex", alignItems: "center", gap: 18, padding: "0 22px", boxSizing: "border-box" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${hue}, ${C.lilac})`, flex: "none" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}><Skel w={`${50 + 30 * ((i * 37) % 10) / 10}%`} h={11} c="#D9DCEA" /><Skel w={`${70 + 25 * ((i * 53) % 10) / 10}%`} h={11} /></div>
        <Glyph name={i % 3 === 0 ? "heart" : i % 3 === 1 ? "clap" : "thumb"} size={28} color={i % 3 === 0 ? "#E0605A" : i % 3 === 1 ? "#44A35C" : "#378FE9"} />
      </div>
    );
  }
  return <>{items}</>;
};
/** Reactions floating up beside the post (left of it, clear of the counts) while they climb. */
const Floaters: React.FC<{ g: number; x: number; y: number }> = ({ g, x, y }) => {
  const t = sec(g), t0 = T.s("impact");
  if (t < t0 || t > T.s("price") + 0.2) return null;
  const out = 1 - k(g, "price-0.45", 0.4, MOVE);
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const born = t0 + i * 0.3, age = t - born;
        if (age < 0 || age > 2.0) return null;
        const u = age / 2.0, [n, c] = REACT[i % 3];
        const xx = x + ((i * 47) % 7 - 3) * 12, yy = y - u * 330;
        return <div key={i} style={at(xx, yy, 0.85 + 0.2 * Math.sin(Math.PI * u), Math.sin(Math.PI * u) * out)}><Reaction name={n} bg={c} size={42} /></div>;
      })}
    </>
  );
};

// ---------- out of reach ----------
const BIZ_GLYPHS = ["store", "bag", "building", "rocket", "cart", "chart"];
const bizPos = (i: number): P => [300 + (i % 2) * 190, 330 + Math.floor(i / 2) * 190];

// ---------- the code ----------
const CODE = "BFOUND50";
const CodeField: React.FC<{ g: number; w: number; size: number; caret?: boolean }> = ({ g, w, size, caret = true }) => {
  const t = sec(g);
  const fk = ARRIVE(clamp01((t - CODE_TIMES[7] - 0.05) / 0.35));
  return (
    <div style={{ width: w, height: size * 1.55, borderRadius: size * 0.28, background: "#fff", boxShadow: `inset 0 0 0 2.5px ${mix("#D6DAEA", C.violet, fk)}, 0 20px 40px -24px rgba(40,50,110,0.4)`, display: "flex", alignItems: "center", padding: `0 ${size * 0.4}px`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
        {CODE.split("").map((ch, i) => {
          const u = ARRIVE(clamp01((t - CODE_TIMES[i] + 0.04) / 0.16));
          return u > 0 ? (
            <span key={i} style={{ position: "relative", display: "inline-block", opacity: u, transform: `translateY(${(1 - u) * size * 0.25}px)` }}>
              {ch}{fk > 0 && <span style={{ position: "absolute", left: 0, top: 0, opacity: fk }}><GradText>{ch}</GradText></span>}
            </span>
          ) : null;
        })}
        {caret && <span style={{ width: size * 0.06, height: size * 0.9, marginLeft: size * 0.06, background: C.violet, opacity: (1 - fk) * (Math.floor(t * 2.4) % 2 ? 1 : 0.15) }} />}
      </div>
      {fk > 0 && <div style={{ marginLeft: "auto", width: size * 0.62, height: size * 0.62, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${ARRIVE(clamp01((t - CODE_TIMES[7] - 0.2) / 0.3))})` }}><Glyph name="check" size={size * 0.4} color="#fff" stroke={2.6} /></div>}
    </div>
  );
};
/** The contact page window (stage geometry: window 1400×800 centred at 960,560; the form's referral field sits at about 1300,628). */
const FIELD_SLOT: P = [1300, 628];

// ---------- the stage ----------
export const Scenes: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  const [wx, wy, ws, wo] = WKC_T(g), [bx, by, bs, bo] = BF_T(g);
  const els: React.ReactNode[] = [];
  const svg: React.ReactNode[] = [];
  const wkcGlow = 0.45 + 0.4 * (k(g, "maker", 0.4) - k(g, "response", 0.4)) + 0.4 * (k(g, "wkc", 0.4) - k(g, "field", 0.4));
  const bfGlow = 0.45 + 0.5 * (k(g, "deliver+0.5", 0.4) - k(g, "response", 0.4)) + 0.4 * (k(g, "bf", 0.4) - k(g, "field", 0.4));

  // P1–P2: the work grows out of the link; P3–P4 it dissolves into its draft and is made again on the timeline, then delivered
  const winIn = life(g, "more", "deliver+0.1", 0.6, 0.5);
  const dl = k(g, "deliver", 0.6, MOVE);
  const [winX, winY, winS] = track(g, [["more", 960, 560, 0.2], ["more+0.6", 960, 600, 1, ARRIVE], ["maker", 960, 600, 1], ["maker+0.6", 1030, 470, 0.86, MOVE], ["deliver", 1030, 470, 0.86], ["deliver+0.6", bx, by, 0.12, MOVE]]);
  const reb = T.s("maker") + 0.45, span = 2.2;
  const bld = EASE.steady(clamp01((t - reb) / span));
  const build = t < reb ? 1 : bld, fade = t < reb ? 1 - k(g, "maker", 0.45, MOVE) : 1;
  if (winIn.on || (t >= T.s("more") && t < T.s("deliver") + 0.7)) {
    const o = t < T.s("deliver") ? winIn.o : 1 - clamp01((dl - 0.75) / 0.25);
    els.push(<div key="win" style={{ ...at(winX, winY, winS * (t < T.s("maker") ? winIn.s : 1), o) }}><Window w={720} h={452}><BfFilm w={720} h={406} build={build} t={t} fade={fade} /></Window></div>);
  }
  // rings: "more than great work" (they stay below the headline)
  for (let i = 0; i < 3; i++) {
    const u = clamp01((t - T.s("more") - 0.3 - i * 0.35) / 1.6);
    if (u > 0 && u < 1) els.push(<div key={`ring${i}`} style={{ ...at(960, 600, 1, (1 - u) * (1 - u) * 0.6), width: 760 + 300 * EASE.whipOut(u), height: 490 + 100 * EASE.whipOut(u), borderRadius: 60, border: `3px solid ${rgba(C.violet, 0.5)}` }} />);
  }
  // the timeline: three layers, keyframes lighting as the playhead passes (the same span as the build)
  const tl = life(g, "maker+0.2", "deliver", 0.5, 0.4);
  if (tl.on) {
    els.push(
      <div key="tl" style={{ ...at(1030, 820, tl.s, tl.o), width: 620, height: 150, borderRadius: 20, ...GLASS, padding: "18px 22px", boxSizing: "border-box", fontFamily: F.ui }}>
        {["b-mark", "Found.", "url pill"].map((n, i) => (
          <div key={n} style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
            <div style={{ width: 100, fontSize: 16, color: C.txt2, fontWeight: 600 }}>{n}</div>
            <div style={{ position: "relative", flex: 1, height: 3, background: "#E3E6F0", borderRadius: 3 }}>
              {[0.06 + i * 0.33, 0.26 + i * 0.33].map((p, j) => (
                <div key={j} style={{ position: "absolute", left: `${p * 100}%`, top: -7, width: 14, height: 14, marginLeft: -7, transform: "rotate(45deg)", borderRadius: 2,
                  background: mix("#FFFFFF", mix(C.wkc, C.bf, p), clamp01((bld - p) * 12)), boxShadow: `inset 0 0 0 2px ${mix(C.wkc, C.bf, p)}` }} />
              ))}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 122 + bld * 454, top: 10, bottom: 10, width: 3, borderRadius: 3, background: GRAD }} />
      </div>
    );
  }
  const chk = life(g, "deliver+0.55", "response-0.25", 0.4, 0.25);

  // P5–P7: the response grows out of bFound's tile
  const post = life(g, "response+0.3", "price-0.45", 0.8, 0.45);
  if (post.on) {
    const [px, py] = track(g, [["response+0.3", 1450, 600], ["response+1.1", 700, 600, MOVE], ["right", 700, 600], ["right+0.7", 720, 585, MOVE]]);
    els.push(<div key="post" style={{ ...at(px, py, post.s * 1.18, post.o) }}><PostCard g={g} /></div>);
    els.push(<Floaters key="fl" g={g} x={px - 470} y={py + 380} />);
  }
  els.push(<Comments key="cm" g={g} x={1470} y={600} />);
  const eyebrow = life(g, "response+0.3", "price-0.45", 0.5, 0.35);
  if (eyebrow.on) els.push(<div key="eb" style={{ ...at(720, 150, 1, eyebrow.o) }}><Label size={24}>The response</Label></div>);

  // P8–P12: the price (it sharpens on the spoken number), the professional video, the lock it hangs on, the businesses outside
  const pc = life(g, "price", "unlock+0.6", 0.6, 0.45);
  const fall = k(g, "unlock+0.2", 0.7, DEPART);
  if (pc.on) {
    const num = k(g, "w:one-0.1", 0.5);
    const [cx, cy, cs] = track(g, [["price", 960, 470, 1], ["pro", 960, 470, 1], ["pro+0.6", 960, 190, 0.62, MOVE], ["lock", 960, 190, 0.62], ["lock+0.6", 960, 455 + 0, 0.34, MOVE]]);
    const per = k(g, "per", 0.4), strike = k(g, "w:change", 0.35, MOVE);
    els.push(
      <div key="price" style={{ ...at(cx, cy + fall * 140, cs * pc.s, pc.o * (1 - fall)), width: 1000, height: 330, borderRadius: 36, ...GLASS, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Label size={24}>A motion design video, typically</Label>
        <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 18, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink }}>
          <span style={{ fontSize: 170, lineHeight: 1, opacity: lerp(0.25, 1, num), filter: num < 1 ? `blur(${(1 - num) * 14}px)` : undefined, transform: `scale(${lerp(0.9, 1, num)})`, display: "inline-block" }}>€1,000</span>
          <span style={{ fontSize: 56, color: C.txt2, opacity: per, transform: `translateX(${(1 - per) * 20}px)`, display: "inline-block" }}>/ video</span>
          {strike > 0 && <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 16, borderRadius: 16, background: GRAD, transformOrigin: "0 50%", transform: `scaleX(${strike}) rotate(-4deg)` }} />}
        </div>
      </div>
    );
  }
  const vid = life(g, "pro", "field", 0.6, 0.4);
  const [vx, vy] = track(g, [["pro", 1300, 600], ["unlock", 1300, 600], ["unlock+0.8", 1180, 600, MOVE]]);
  if (vid.on) {
    els.push(
      <div key="vid" style={{ ...at(vx, vy, vid.s, vid.o) }}>
        <Tile size={300} glow={C.violet} glowK={0.8}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph name="play" size={64} color="#fff" fill="#fff" /></div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.ink, textAlign: "center", lineHeight: 1.2 }}>Professional<br />motion design</div>
          </div>
        </Tile>
      </div>
    );
  }
  const wall = life(g, "lock", "unlock", 0.5, 0.7);
  const unlock = k(g, "unlock", 0.45, MOVE);
  if (wall.on || (t >= T.s("lock") && t < T.s("unlock") + 1)) {
    els.push(<div key="wall" style={{ ...at(960, 600 + fall * 120, 1, wall.o), width: 90, height: 640, borderRadius: 45, background: "rgba(72,94,157,0.10)", boxShadow: "inset 0 0 0 2px rgba(72,94,157,0.35), 0 30px 60px -30px rgba(40,50,110,0.45)" }} />);
    const lk = k(g, "lock", 0.4);
    els.push(
      <div key="lock" style={{ ...at(960, 600 + fall * 140, lerp(0.5, 1, lk), lk * (1 - fall)) }}>
        <Tile size={128} glow={unlock > 0 ? C.violet : C.grey} glowK={0.8}>
          <Glyph name={unlock > 0.5 ? "unlock" : "lock"} size={64} color={unlock > 0.5 ? C.violet : C.ink2} stroke={2.2} style={{ transform: `translateY(${unlock * -4}px)` }} />
        </Tile>
      </div>
    );
  }
  const bz = life(g, "many", "field", 0.5, 0.4);
  if (bz.on) {
    BIZ_GLYPHS.forEach((n, i) => {
      const a = life(g, `many+${0.07 * i}`, "field", 0.5, 0.4), lit = k(g, `unlock+${0.15 + 0.05 * i}`, 0.35);
      const [x, y] = bizPos(i);
      els.push(<div key={`bz${i}`} style={{ ...at(x, y, a.s, a.o) }}><Tile size={120} glow={lit > 0 ? C.wkc : C.grey} glowK={0.3 + 0.5 * lit}><Glyph name={n} size={56} color={mix("#A3A8BC", C.bf, lit)} stroke={1.8} /></Tile></div>);
      const reach = k(g, `many+${0.15 + 0.07 * i}`, 0.6, MOVE);
      svg.push(<Cable key={`bc${i}`} id={`bc${i}`} a={[x + 60, y]} b={[lerp(x + 60, 905, reach), lerp(y, 600, reach)]} k={reach > 0 ? 1 : 0} o={a.o * (1 - lit)} bend={0.05} t={t} flow={0} dashed width={2.5} colorA={C.grey} colorB={C.grey} />);
      if (i % 2 === 1) {
        const j = (i - 1) / 2;
        svg.push(<Cable key={`bs${i}`} id={`bs${i}`} a={[x + 60, y]} b={[vx - 150, vy - 80 + 80 * j]} k={lit} o={a.o} bend={0.04} t={t} flow={0.8} width={3} />);
      }
    });
  }

  // P13–P15: the two tiles pull the lock open together
  if (t >= T.s("wkc") && t < T.s("unlock") + 0.6) {
    const f = 1 - k(g, "unlock+0.1", 0.4, MOVE);
    svg.push(<Cable key="wl" id="wl" a={[wx, wy + ws * 0.42]} b={[960, 540]} k={k(g, "wkc+0.5", 0.6, MOVE)} o={f} bend={-0.12} t={t} flow={1.6} colorA={C.wkc} colorB={C.violet} />);
    svg.push(<Cable key="bl" id="bl" a={[bx, by + bs * 0.42]} b={[960, 540]} k={k(g, "bf+0.5", 0.6, MOVE)} o={f} bend={0.12} t={t} flow={1.6} colorA={C.bf} colorB={C.violet} />);
  }

  // the thread: the cable between the two tiles (its arch eases between chapters)
  const linkK = k(g, "link+0.4", 0.7, MOVE);
  if (wo > 0.01 && bo > 0.01) {
    const viaWin = t >= T.s("more") && t < T.s("deliver") + 0.6;
    if (viaWin) {
      const sp = clamp01(k(g, "more", 0.6, MOVE));
      const L: P = [winX - 360 * winS, winY], R: P = [winX + 360 * winS, winY];
      svg.push(<Cable key="t1" id="t1" a={[wx + ws * 0.45, wy]} b={[lerp(960, L[0], sp), lerp(540, L[1], sp)]} k={linkK} o={Math.min(wo, bo) * (1 - dl)} bend={0.1} t={t} flow={1.4} colorA={C.wkc} colorB={C.violet} />);
      svg.push(<Cable key="t2" id="t2" a={[lerp(960, R[0], sp), lerp(540, R[1], sp)]} b={[bx - bs * 0.45, by]} k={linkK} o={Math.min(wo, bo) * (1 - dl)} bend={0.1} t={t} flow={1.4} colorA={C.violet} colorB={C.bf} />);
      if (t >= T.s("deliver")) svg.push(<Cable key="t3" id="t3" a={[wx + ws * 0.45, wy]} b={[bx - bs * 0.45, by]} k={dl} o={Math.min(wo, bo)} bend={0.0001 - 0.12 * (1 - k(g, "deliver+0.15", 0.45, MOVE))} t={t} flow={1.4} />);
    } else if (!(t >= T.s("wkc") && t < T.s("unlock") + 0.3)) {
      const reK = t >= T.s("endcard") ? k(g, "endcard+0.6", 0.7, MOVE) : t >= T.s("unlock") ? k(g, "unlock+0.2", 0.6, MOVE) : 1;
      const arch = 0.0001 - 0.16 * (k(g, "response", 0.7, MOVE) - k(g, "price-0.3", 0.5, MOVE)) - 0.1 * (k(g, "field-0.3", 0.7, MOVE) - k(g, "endcard-0.3", 0.5, MOVE));
      svg.push(<Cable key="t0" id="t0" a={[wx + ws * 0.45, wy]} b={[bx - bs * 0.45, by]} k={t < T.s("more") ? linkK : reK} o={Math.min(wo, bo)} bend={arch} t={t} flow={1.4} />);
    }
  }
  // the code section: both tiles feed the field (cables to its side midpoints)
  const fc = life(g, "field", undefined, 0.6);
  if (t >= T.s("field") - 0.3 && t < T.s("visit") + 0.4) {
    const fk = k(g, "field+0.3", 0.6, MOVE), fo = 1 - k(g, "visit-0.3", 0.4, MOVE);
    svg.push(<Cable key="fw" id="fw" a={[wx, wy + ws * 0.45]} b={[960 - 410 * fc.s, 578]} k={fk} o={fo} bend={0.12} t={t} flow={1.4} colorA={C.wkc} colorB={C.violet} />);
    svg.push(<Cable key="fb" id="fb" a={[bx, by + bs * 0.45]} b={[960 + 410 * fc.s, 578]} k={fk} o={fo} bend={-0.12} t={t} flow={1.4} colorA={C.bf} colorB={C.violet} />);
  }

  // the two tiles (drawn over their cables)
  const tile = (key: string, x: number, y: number, s: number, o: number, glow: string, glowK: number, child: React.ReactNode) =>
    o > 0.01 && els.push(<div key={key} style={{ ...at(x, y, 1, o) }}><Tile size={s} glow={glow} glowK={glowK}>{child}</Tile></div>);
  tile("wkcT", wx, wy, ws, wo, C.wkc, wkcGlow, <WkcMark w={ws * 0.62} grad id="wt" />);
  tile("bfT", bx, by, bs, bo, C.bf, bfGlow, <BfLogo h={bs * 0.42} mark />);
  if (chk.on) els.push(<div key="chk" style={{ ...at(bx + bs * 0.38, by - bs * 0.38, chk.s, chk.o), width: 52, height: 52, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px #fff" }}><Glyph name="check" size={30} color="#fff" stroke={2.8} /></div>);

  // P16–P18: the code (typed as spoken), then it travels into the contact form's referral field
  const br = life(g, "visit", "endcard", 0.6, 0.5);
  const mv = k(g, "visit", 0.6, MOVE);
  const pr = life(g, "four", "visit", 0.5, 0.35), sp = k(g, "startup", 0.45);
  if (pr.on) els.push(
    <div key="pr" style={{ ...at(960, 800, pr.s, pr.o), display: "flex", alignItems: "baseline", gap: 22, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 120, lineHeight: 1 }}>€400</span>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, letterSpacing: "0", color: C.txt2, opacity: sp, transform: `translateX(${(1 - sp) * 16}px)`, display: "inline-block" }}>WKConversions startup price</span>
    </div>
  );

  // P19–P21: the contact page (the address, big, as it is spoken; the code in the form; €200 with the code, then Submit)
  if (br.on) {
    const url = (() => {
      const host = "wkconversions", tw = T.s("w:wkconversions3"), te = tw + 1.05;
      const n = Math.round(host.length * clamp01((t - tw) / (te - tw)));
      let s = host.slice(0, n);
      if (t >= T.s("w:dot")) s += ".";
      if (t >= T.s("w:com")) s += "com";
      if (t >= T.s("w:slash")) s += "/";
      const c = t >= T.s("w:contact") ? "contact".slice(0, Math.round(7 * clamp01((t - T.s("w:contact")) / 0.55))) : "";
      return { main: s, contact: c };
    })();
    const page = k(g, "visit+0.1", 0.6);
    const sub = k(g, "two+0.8", 0.2, (u) => u), press = Math.sin(Math.PI * sub);
    const cur = k(g, "claim", 0.6, MOVE), slotOn = t >= T.s("visit") + 0.6;
    els.push(
      <div key="br" style={{ ...at(960, 560, br.s, br.o) }}>
        <Window w={1400} h={800} url={<span>{url.main}{url.contact}</span>}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 800, opacity: page, transform: `translate3d(0, ${(1 - page) * 20 + 40}px, 0)`, backgroundImage: "radial-gradient(circle, #D3D7E3 2.2px, transparent 2.7px)", backgroundSize: "36px 36px" }}>
            <div style={{ position: "absolute", left: 70, top: 110, width: 600 }}>
              <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: C.wkc, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 18 }}>Your video starts here</div>
              <div style={{ marginTop: 26, fontFamily: F.display, fontWeight: 800, fontSize: 78, lineHeight: 1, letterSpacing: "-0.05em", color: C.ink }}>Tell us about <span style={{ color: C.wkc }}>your video.</span></div>
            </div>
            <div style={{ position: "absolute", right: 60, top: 40, width: 620, borderRadius: 24, background: "#fff", boxShadow: "0 24px 50px -30px rgba(40,50,110,0.4), inset 0 0 0 1px #E6E9F2", padding: 32, boxSizing: "border-box", fontFamily: F.ui }}>
              {["Company name", "Website", "Where will it be used?"].map((l) => (
                <div key={l} style={{ marginBottom: 18 }}><div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{l}</div><div style={{ height: 40, borderRadius: 10, boxShadow: "inset 0 0 0 1.5px #E1E4EE" }} /></div>
              ))}
              <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Referral code</div>
              <div style={{ opacity: slotOn ? 1 : 0 }}><CodeField g={g} w={556} size={34} caret={false} /></div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 16, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: F.ui, fontSize: 20, fontWeight: 600, letterSpacing: 0, color: C.txt2 }}>Price:</span>
                <span style={{ fontSize: 48, color: C.ink }}>€400</span>
              </div>
              <div style={{ marginTop: 18, display: "inline-block", padding: "14px 30px", borderRadius: 12, background: C.wkc, color: "#fff", fontWeight: 600, fontSize: 20, transform: `scale(${1 - 0.06 * press})` }}>Submit</div>
            </div>
          </div>
        </Window>
        {cur > 0 && <Cursor x={lerp(1160, 800, cur)} y={lerp(820, 595, cur)} press={press} o={clamp01(cur * 3) * (1 - k(g, "endcard-0.2", 0.3))} />}
      </div>
    );
    // the address, big, typing on the words, flanked by the two tiles
    const ua = k(g, "w:wkconversions3", 0.5);
    if (url.main.length > 0) els.push(
      <div key="url" style={{ ...at(960, 112, lerp(0.4, 1, ua), ua * br.o), fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>
        {url.main}<span style={{ color: C.wkc }}>{url.contact}</span>
      </div>
    );
    // €200 with the code: a tag grows out of the referral field's check and settles under the page's headline
    const tg = k(g, "two", 0.6, MOVE), tgo = clamp01(tg * 2) * br.o, cut = k(g, "two+0.35", 0.35, MOVE), v2 = k(g, "two+0.45", 0.4);
    if (tg > 0) els.push(
      <div key="tag" style={{ ...at(lerp(1560, 600, tg), lerp(630, 770, tg), lerp(0.2, 1, tg), tgo), padding: "22px 34px", borderRadius: 28, ...GLASS, background: "linear-gradient(160deg, rgba(255,255,255,0.97), rgba(255,255,255,0.88))", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
        <Label size={20}>With BFOUND50</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
          <span style={{ position: "relative", fontSize: 54, color: mix("#0B1324", "#A3A8BC", cut) }}>€400
            <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 7, borderRadius: 7, background: GRAD, transformOrigin: "0 50%", transform: `scaleX(${cut}) rotate(-4deg)` }} /></span>
          <span style={{ fontSize: 104, opacity: v2, transform: `translateX(${(1 - v2) * 20}px)`, display: "inline-block" }}><GradText>€200</GradText></span>
        </div>
      </div>
    );
  }

  if (fc.on && t < T.s("visit") + 0.6) {
    const [fx, fy] = [lerp(960, FIELD_SLOT[0], mv), lerp(560, FIELD_SLOT[1] - 30 * (1 - mv), mv)];
    els.push(<div key="fl" style={{ ...at(fx, fy, fc.s, fc.o) }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        <div style={{ opacity: 1 - mv }}><Label size={24}>Referral code</Label></div>
        <CodeField g={g} w={lerp(820, 576, mv)} size={lerp(92, 34, mv)} />
      </div>
    </div>);
  }
  // the end card: the two partners named, the code, where to claim it
  const ec = life(g, "endcard+0.3", undefined, 0.6);
  if (ec.on) {
    const x2 = k(g, "endcard+0.55", 0.5);
    els.push(<div key="x" style={{ ...at(960, 340, lerp(0.6, 1, x2), x2), fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.txt2, lineHeight: 1, padding: "0 12px 8px", background: "radial-gradient(closest-side, rgba(250,251,254,0.95), rgba(250,251,254,0))" }}>×</div>);
    els.push(<div key="wn1" style={{ ...at(wx, 500, ec.s, ec.o), fontFamily: F.display, fontWeight: 800, fontSize: 44, letterSpacing: "-0.04em", color: C.wkc, whiteSpace: "nowrap" }}>WKConversions</div>);
    els.push(<div key="wn2" style={{ ...at(bx, 500, ec.s, ec.o) }}><BfLogo h={52} /></div>);
    els.push(<div key="ec" style={{ ...at(960, 760, ec.s, ec.o), display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ padding: "16px 50px", borderRadius: 999, background: "#fff", boxShadow: `inset 0 0 0 3px ${C.violet}, 0 24px 50px -26px rgba(40,50,110,0.5)`, fontFamily: F.display, fontWeight: 800, fontSize: 88, letterSpacing: "0.05em" }}><GradText>BFOUND50</GradText></div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 52, letterSpacing: "-0.04em", color: C.ink, opacity: k(g, "endcard+0.6", 0.5), whiteSpace: "nowrap" }}>Your video for <GradText>€200</GradText> at wkconversions.com/contact</div>
    </div>);
  }

  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{svg}</svg>
      {els}
    </>
  );
};

/** The film's few words: the key phrase of a beat, never the whole voice-over. The partners' names in their own colours. */
export const Headlines: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Headline g={g} x={960} y={110} size={78} align="center" out="maker-0.3" lines={[
      [{ t: "A", at: "w:a" }, { t: "great", at: "w:great" }, { t: "partnership", at: "w:partnership", key: true }],
      [{ t: "should", at: "w:should" }, { t: "create", at: "w:create" }, { t: "more", at: "w:more" }, { t: "than", at: "w:than" }, { t: "great", at: "w:great2", key: true }, { t: "work.", at: "w:work", key: true }],
    ]} />
    <Headline g={g} x={170} y={140} size={76} out="response-0.3" lines={[
      [{ t: "Made", at: "w:after" }, { t: "by", at: "w:after" }, { t: "WKConversions", at: "w:wkconversions", brand: "wkc" }],
      [{ t: "for", at: "w:for" }, { t: "bFound.", at: "w:bfound", brand: "bf" }],
    ]} />
    <Headline g={g} x={960} y={880} size={70} align="center" out="wkc-0.3" lines={[
      [{ t: "Inaccessible", at: "w:inaccessible", grey: true }, { t: "to", at: "w:to" }, { t: "many", at: "w:many" }, { t: "businesses.", at: "w:businesses" }],
    ]} />
    <Headline g={g} x={960} y={830} size={70} align="center" out="field-0.3" lines={[
      [{ t: "WKConversions", at: "w:wkconversions2", brand: "wkc" }, { t: "×", at: "w:and" }, { t: "bFound", at: "w:bfound2", brand: "bf" }],
      [{ t: "decided", at: "w:decided" }, { t: "to change", at: "w:change" }, { t: "that.", at: "w:that" }],
    ]} />
    <Headline g={g} x={960} y={330} size={58} align="center" out="visit-0.2" lines={[
      [{ t: "50%", at: "half", key: true }, { t: "off", at: "w:off", key: true }, { t: "our", at: "w:our" }, { t: "startup", at: "w:startup" }, { t: "price.", at: "w:price" }],
    ]} />
  </>
);
