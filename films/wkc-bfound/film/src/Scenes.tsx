// Every object on the one stage, as a pure function of the frame and the labels (clock.ts). The thread of the film is the
// cable between the two brand tiles: it links them, carries the film WKConversions made to bFound, reaches across the top
// while the response comes in, breaks the lock with both tiles pulling on it, feeds the code, and holds the end lockup.
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

// ---------- the two brand tiles ----------
const WKC_T = (g: number) => track(g, [
  ["open", -160, 540, 190, 0], ["open+0.75", 700, 540, 190, 1, ARRIVE], ["more", 700, 540, 190, 1], ["more+0.7", 380, 600, 170, 1, MOVE],
  ["maker", 380, 600, 170, 1], ["maker+0.6", 330, 610, 200, 1, MOVE], ["response", 330, 610, 200, 1], ["response+0.7", 230, 200, 120, 1, MOVE],
  ["price-0.3", 230, 200, 120, 1], ["price+0.4", -140, 200, 120, 0, MOVE], ["wkc", -140, 220, 170, 0], ["wkc+0.7", 640, 220, 170, 1, ARRIVE],
  ["field-0.3", 640, 220, 170, 1], ["field+0.4", 330, 230, 150, 1, MOVE], ["visit-0.3", 330, 230, 150, 1], ["visit+0.3", -140, 230, 150, 0, MOVE],
  ["endcard", -140, 380, 240, 0], ["endcard+0.8", 730, 380, 240, 1, ARRIVE], ["end", 742, 380, 240, 1],
]);
const BF_T = (g: number) => track(g, [
  ["open", 2080, 540, 190, 0], ["link", 2080, 540, 190, 0], ["link+0.75", 1220, 540, 190, 1, ARRIVE], ["more", 1220, 540, 190, 1], ["more+0.7", 1540, 600, 170, 1, MOVE],
  ["maker", 1540, 600, 170, 1], ["maker+0.6", 1640, 610, 170, 1, MOVE], ["deliver+0.5", 1640, 610, 170, 1], ["deliver+0.9", 1640, 610, 200, 1, ARRIVE],
  ["response", 1640, 610, 200, 1], ["response+0.7", 1690, 200, 120, 1, MOVE],
  ["price-0.3", 1690, 200, 120, 1], ["price+0.4", 2060, 200, 120, 0, MOVE], ["bf", 2060, 220, 170, 0], ["bf+0.7", 1280, 220, 170, 1, ARRIVE],
  ["field-0.3", 1280, 220, 170, 1], ["field+0.4", 1590, 230, 150, 1, MOVE], ["visit-0.3", 1590, 230, 150, 1], ["visit+0.3", 2060, 230, 150, 0, MOVE],
  ["endcard", 2060, 380, 240, 0], ["endcard+0.8", 1190, 380, 240, 1, ARRIVE], ["end", 1178, 380, 240, 1],
]);

// ---------- the film WKConversions made for bFound (its own frame: the logo over a pale lilac gradient and the url pill) ----------
const BfFilm: React.FC<{ w: number; h: number; build: number; t: number }> = ({ w, h, build, t }) => {
  const b1 = clamp01(build * 3), b2 = clamp01(build * 3 - 1), b3 = clamp01(build * 3 - 2);
  const sh = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `radial-gradient(120% 90% at ${30 + 20 * sh}% 0%, #FFFFFF, #EEF0FC 55%, #E3E2FA)` }}>
      <div style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center" }}>
        <div style={{ opacity: ARRIVE(b1), transform: `scale(${lerp(0.5, 1, ARRIVE(b1))}) rotate(${(1 - ARRIVE(b1)) * -30}deg)` }}><BfLogo h={h * 0.2} mark /></div>
        <div style={{ width: (h * 0.2 * 1831) / 466 - h * 0.2 * 1.02, height: h * 0.2, overflow: "hidden", position: "relative", clipPath: `inset(0 ${(1 - ARRIVE(b2)) * 100}% 0 0)` }}>
          <BfLogo h={h * 0.2} style={{ position: "absolute", left: -h * 0.2 * 1.02, top: 0 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "70%", transform: `translate(-50%, ${(1 - ARRIVE(b3)) * 30}px)`, opacity: ARRIVE(b3), padding: `${h * 0.03}px ${h * 0.07}px`, borderRadius: 999,
        background: "linear-gradient(90deg, #A9A3EE, #C2B8F4)", color: "#fff", fontFamily: F.ui, fontWeight: 500, fontSize: h * 0.06, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>bfoundconsulting.com</div>
    </div>
  );
};

// ---------- the LinkedIn response (the post as it reads; commenters stay anonymous: no names, no faces) ----------
const QUOTE = "been waiting to share this!! bFound. looking kinda goooood huge credit to Karl van Kessel from WKConversions for making this video for me!";
const Reaction: React.FC<{ name: string; bg: string; size: number }> = ({ name, bg, size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px #fff", flex: "none" }}>
    <Glyph name={name} size={size * 0.62} color="#fff" stroke={2} />
  </div>
);
const REACT = [["thumb", "#378FE9"], ["clap", "#44A35C"], ["heart", "#E0605A"]] as const;
const PostCard: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  const n1 = Math.round(118 * EASE.steady(k(g, "impact", 1.6, (u) => u))), n2 = Math.round(45 * EASE.steady(k(g, "impact+0.15", 1.6, (u) => u)));
  const big = k(g, "right", 0.7, MOVE), play = clamp01((t - T.s("right") - 0.3) / 2.2);
  return (
    <div style={{ width: 640, borderRadius: 26, ...GLASS, background: "linear-gradient(170deg, rgba(255,255,255,0.97), rgba(255,255,255,0.9))", padding: 26, boxSizing: "border-box", fontFamily: F.ui, color: C.ink }}>
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
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 74, height: 74, marginLeft: -37, marginTop: -37, borderRadius: "50%", background: "rgba(11,19,36,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 1 - big, transform: `scale(${1 - 0.3 * big})` }}><Glyph name="play" size={36} color="#fff" fill="#fff" /></div>
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
  if (t < t0 - 0.1 || t > T.s("price") + 0.8) return null;
  const out = k(g, "price-0.2", 0.5, MOVE);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const born = t0 + i * 0.42, age = t - born;
    if (age < 0) continue;
    const yy = y + 380 - age * 150 - (1 - ARRIVE(clamp01(age / 0.5))) * -40;
    if (yy < y - 420) continue;
    const a = ARRIVE(clamp01(age / 0.45)), fadeTop = clamp01((yy - (y - 420)) / 120);
    const hue = [C.wkc, C.violet, C.bf, C.sky, C.lilac][i % 5];
    items.push(
      <div key={i} style={{ ...at(x, yy, lerp(0.8, 1.2, a), a * fadeTop * (1 - out)), width: 470, height: 92, borderRadius: 20, ...GLASS, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${hue}, ${C.lilac})`, flex: "none" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}><Skel w={`${50 + 30 * ((i * 37) % 10) / 10}%`} h={10} c="#D9DCEA" /><Skel w={`${70 + 25 * ((i * 53) % 10) / 10}%`} h={10} /></div>
        <Glyph name={i % 3 === 0 ? "heart" : i % 3 === 1 ? "clap" : "thumb"} size={26} color={i % 3 === 0 ? "#E0605A" : i % 3 === 1 ? "#44A35C" : "#378FE9"} />
      </div>
    );
  }
  return <>{items}</>;
};
/** Reactions floating up from the post while the count climbs. */
const Floaters: React.FC<{ g: number; x: number; y: number }> = ({ g, x, y }) => {
  const t = sec(g), t0 = T.s("impact");
  if (t < t0 || t > T.s("price") + 0.5) return null;
  const out = 1 - k(g, "price-0.2", 0.4, MOVE);
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const born = t0 + i * 0.13, age = t - born;
        if (age < 0 || age > 1.8) return null;
        const u = age / 1.8, [n, c] = REACT[i % 3];
        const xx = x + ((i * 47) % 7 - 3) * 22 + Math.sin(age * 4 + i) * 14, yy = y - u * 300;
        return <div key={i} style={at(xx, yy, 0.8 + 0.3 * Math.sin(Math.PI * u), Math.sin(Math.PI * u) * out)}><Reaction name={n} bg={c} size={40} /></div>;
      })}
    </>
  );
};

// ---------- €1,000 per video, out of reach ----------
const BIZ_GLYPHS = ["store", "bag", "building", "rocket", "cart", "chart"];
const bizPos = (i: number): P => [300 + (i % 2) * 190, 330 + Math.floor(i / 2) * 190];

// ---------- the code ----------
const CODE = "BFOUND50";
const CodeField: React.FC<{ g: number; w: number; size: number; caret?: boolean }> = ({ g, w, size, caret = true }) => {
  const t = sec(g);
  const done = CODE_TIMES.filter((c) => t >= c - 0.04).length;
  const full = done >= CODE.length;
  return (
    <div style={{ width: w, height: size * 1.55, borderRadius: size * 0.28, background: "#fff", boxShadow: `inset 0 0 0 2.5px ${full ? C.violet : "#D6DAEA"}, 0 20px 40px -24px rgba(40,50,110,0.4)`, display: "flex", alignItems: "center", padding: `0 ${size * 0.4}px`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
        {CODE.split("").map((ch, i) => {
          const u = ARRIVE(clamp01((t - CODE_TIMES[i] + 0.04) / 0.16));
          return u > 0 ? <span key={i} style={{ display: "inline-block", opacity: u, transform: `translateY(${(1 - u) * size * 0.25}px)` }}>{full ? <GradText>{ch}</GradText> : ch}</span> : null;
        })}
        {caret && !full && <span style={{ width: size * 0.06, height: size * 0.9, marginLeft: size * 0.06, background: C.violet, opacity: Math.floor(t * 2.4) % 2 ? 1 : 0.15 }} />}
      </div>
      {full && <div style={{ marginLeft: "auto", width: size * 0.62, height: size * 0.62, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${ARRIVE(clamp01((t - CODE_TIMES[7] - 0.2) / 0.3))})` }}><Glyph name="check" size={size * 0.4} color="#fff" stroke={2.6} /></div>}
    </div>
  );
};

// ---------- the stage ----------
export const Scenes: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  const [wx, wy, ws, wo] = WKC_T(g), [bx, by, bs, bo] = BF_T(g);
  const els: React.ReactNode[] = [];
  const svg: React.ReactNode[] = [];
  const wkcGlow = 0.45 + 0.4 * (k(g, "maker", 0.4) - k(g, "response", 0.4)) + 0.4 * (k(g, "wkc", 0.4) - k(g, "field", 0.4));
  const bfGlow = 0.45 + 0.5 * (k(g, "deliver+0.5", 0.4) - k(g, "response", 0.4)) + 0.4 * (k(g, "bf", 0.4) - k(g, "field", 0.4));

  // P1–P2: the work window grows out of the link; P3–P4 it is made and delivered
  const winIn = life(g, "more", "deliver+0.1", 0.6, 0.5);
  const dl = k(g, "deliver", 0.6, MOVE);
  const [winX, winY, winS] = track(g, [["more", 960, 560, 0.2], ["more+0.6", 960, 600, 1, ARRIVE], ["maker", 960, 600, 1], ["maker+0.6", 1030, 470, 0.86, MOVE], ["deliver", 1030, 470, 0.86], ["deliver+0.6", bx, by, 0.12, MOVE]]);
  const build = t < T.s("maker") ? 1 : EASE.steady(clamp01((t - T.s("motion")) / 1.1));
  if (winIn.on || (t >= T.s("more") && t < T.s("deliver") + 0.7)) {
    const o = t < T.s("deliver") ? winIn.o : 1 - clamp01((dl - 0.75) / 0.25);
    els.push(<div key="win" style={{ ...at(winX, winY, winS * (t < T.s("maker") ? winIn.s : 1), o) }}><Window w={720} h={452}><BfFilm w={720} h={406} build={build} t={t} /></Window></div>);
  }
  // rings: "more than great work"
  for (let i = 0; i < 3; i++) {
    const u = clamp01((t - T.s("more") - 0.3 - i * 0.35) / 1.6);
    if (u > 0 && u < 1) els.push(<div key={`ring${i}`} style={{ ...at(960, 600, 1, (1 - u) * 0.8), width: 760 + 700 * EASE.whipOut(u), height: 490 + 520 * EASE.whipOut(u), borderRadius: 60, border: `3px solid ${rgba(C.violet, 0.5)}` }} />);
  }
  // the timeline (the film being made): three layers, keyframes lighting as the playhead passes
  const tl = life(g, "make", "deliver", 0.5, 0.4);
  if (tl.on) {
    const ph = EASE.steady(clamp01((t - T.s("motion")) / 1.1));
    els.push(
      <div key="tl" style={{ ...at(1030, 820, tl.s, tl.o), width: 620, height: 150, borderRadius: 20, ...GLASS, padding: "18px 22px", boxSizing: "border-box", fontFamily: F.ui }}>
        {["b-mark", "Found.", "url pill"].map((n, i) => (
          <div key={n} style={{ position: "relative", height: 36, display: "flex", alignItems: "center" }}>
            <div style={{ width: 100, fontSize: 15, color: C.txt2, fontWeight: 600 }}>{n}</div>
            <div style={{ position: "relative", flex: 1, height: 3, background: "#E3E6F0", borderRadius: 3 }}>
              {[0.06 + i * 0.33, 0.26 + i * 0.33].map((p, j) => (
                <div key={j} style={{ position: "absolute", left: `${p * 100}%`, top: -7, width: 14, height: 14, marginLeft: -7, transform: "rotate(45deg)", borderRadius: 2,
                  background: ph >= p ? mix(C.wkc, C.bf, p) : "#fff", boxShadow: `inset 0 0 0 2px ${mix(C.wkc, C.bf, p)}` }} />
              ))}
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 122 + ph * 454, top: 10, bottom: 10, width: 3, borderRadius: 3, background: GRAD }} />
      </div>
    );
  }
  // delivered: a check on bFound's tile
  const chk = life(g, "deliver+0.55", "response", 0.4, 0.3);

  // P5–P7: the response grows out of bFound's tile
  const post = life(g, "response", "price-0.1", 0.6, 0.45);
  if (post.on) {
    const [px, py] = track(g, [["response", 1640, 610], ["response+0.6", 690, 600, MOVE], ["right", 690, 600], ["right+0.7", 720, 585, MOVE]]);
    els.push(<div key="post" style={{ ...at(px, py, post.s * 1.18, post.o) }}><PostCard g={g} /></div>);
    els.push(<Floaters key="fl" g={g} x={px - 190} y={py + 400} />);
  }
  els.push(<Comments key="cm" g={g} x={1440} y={600} />);
  const eyebrow = life(g, "response", "price-0.2", 0.5, 0.35);
  if (eyebrow.on) els.push(<div key="eb" style={{ ...at(720, 150, 1, eyebrow.o) }}><Label size={18}>The response</Label></div>);

  // P8–P12: the price, the professional video, the lock, the businesses outside
  const pc = life(g, "price", "wkc-0.2", 0.6, 0.45);
  if (pc.on) {
    const n = Math.round(Math.min(1000, 1000 * EASE.steady(clamp01((t - T.s("price") - 0.3) / (T.s("w:euros") - T.s("price") - 0.3)))) / 10) * 10;
    const [cx, cy, cs] = track(g, [["price", 960, 470, 1], ["pro", 960, 470, 1], ["pro+0.6", 960, 190, 0.62, MOVE]]);
    const per = k(g, "per", 0.4);
    els.push(
      <div key="price" style={{ ...at(cx, cy, cs * pc.s, pc.o), width: 1000, height: 330, borderRadius: 36, ...GLASS, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Label size={17}>A motion design video, typically</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink }}>
          <span style={{ fontSize: 170, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>€{n.toLocaleString("en-US")}</span>
          <span style={{ fontSize: 56, color: C.txt2, opacity: per, transform: `translateX(${(1 - per) * 20}px)`, display: "inline-block" }}>/ video</span>
        </div>
      </div>
    );
  }
  const vid = life(g, "pro", "field-0.3", 0.6, 0.4);
  const [vx, vy] = track(g, [["pro", 1300, 600], ["unlock", 1300, 600], ["unlock+0.8", 1180, 600, MOVE]]);
  if (vid.on) {
    els.push(
      <div key="vid" style={{ ...at(vx, vy, vid.s, vid.o) }}>
        <Tile size={300} glow={C.violet} glowK={0.8}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph name="play" size={64} color="#fff" fill="#fff" /></div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.ink, textAlign: "center", lineHeight: 1.2 }}>Professional<br />motion design</div>
          </div>
        </Tile>
      </div>
    );
  }
  const wall = life(g, "lock", "unlock", 0.5, 0.7);
  const unlock = k(g, "unlock", 0.45, MOVE);
  if (wall.on || (t >= T.s("lock") && t < T.s("unlock") + 1)) {
    const fall = k(g, "unlock+0.2", 0.7, DEPART);
    els.push(<div key="wall" style={{ ...at(960, 600 + fall * 120, 1, wall.o), width: 70, height: 640, borderRadius: 35, background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(230,233,248,0.85))", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.95), 0 30px 60px -30px rgba(40,50,110,0.45)" }} />);
    const lk = k(g, "lock", 0.4);
    els.push(
      <div key="lock" style={{ ...at(960, 600 + fall * 140, lerp(0.5, 1, lk), lk * (1 - fall)) }}>
        <Tile size={128} glow={unlock > 0 ? C.violet : C.grey} glowK={0.8}>
          <Glyph name={unlock > 0.5 ? "unlock" : "lock"} size={64} color={unlock > 0.5 ? C.violet : C.ink2} stroke={2.2} style={{ transform: `translateY(${unlock * -4}px)` }} />
        </Tile>
      </div>
    );
  }
  // the businesses outside
  const bz = life(g, "many", "field-0.3", 0.5, 0.4);
  if (bz.on) {
    BIZ_GLYPHS.forEach((n, i) => {
      const a = life(g, `many+${0.07 * i}`, "field-0.3", 0.5, 0.4), lit = k(g, `unlock+${0.35 + 0.1 * i}`, 0.5);
      const [x, y] = bizPos(i);
      els.push(<div key={`bz${i}`} style={{ ...at(x, y, a.s, a.o) }}><Tile size={120} glow={lit > 0 ? C.wkc : C.grey} glowK={0.3 + 0.5 * lit}><Glyph name={n} size={56} color={mix("#A3A8BC", C.bf, lit)} stroke={1.8} /></Tile></div>);
      // a dashed reach that stops at the wall, then the solid cable to the video once it is open
      const reach = k(g, `many+${0.15 + 0.07 * i}`, 0.6, MOVE);
      svg.push(<Cable key={`bc${i}`} id={`bc${i}`} a={[x + 60, y]} b={[lerp(x + 60, 905, reach), lerp(y, 600, reach)]} k={reach > 0 ? 1 : 0} o={a.o * (1 - lit)} bend={0.05} t={t} flow={0} dashed width={2.5} colorA={C.grey} colorB={C.grey} />);
      svg.push(<Cable key={`bs${i}`} id={`bs${i}`} a={[x + 60, y]} b={[vx - 150, vy]} k={lit} o={a.o} bend={0.08 * (i % 2 ? 1 : -1)} t={t} flow={0.8} width={3} />);
    });
  }

  // P13–P15: the two tiles pull the lock open together
  if (t >= T.s("wkc") && t < T.s("unlock") + 0.6) {
    const f = 1 - k(g, "unlock+0.1", 0.4, MOVE);
    svg.push(<Cable key="wl" id="wl" a={[wx, wy + ws * 0.42]} b={[960, 540]} k={k(g, "wkc+0.5", 0.6, MOVE)} o={f} bend={-0.12} t={t} flow={1.6} colorA={C.wkc} colorB={C.violet} />);
    svg.push(<Cable key="bl" id="bl" a={[bx, by + bs * 0.42]} b={[960, 540]} k={k(g, "bf+0.5", 0.6, MOVE)} o={f} bend={0.12} t={t} flow={1.6} colorA={C.bf} colorB={C.violet} />);
  }

  // the thread: the cable between the two tiles
  const linkK = k(g, "link+0.4", 0.7, MOVE);
  if (wo > 0.01 && bo > 0.01) {
    const viaWin = t >= T.s("more") && t < T.s("deliver") + 0.6;
    if (viaWin) {
      const sp = clamp01(k(g, "more", 0.6, MOVE));
      const L: P = [winX - 360 * winS, winY], R: P = [winX + 360 * winS, winY];
      svg.push(<Cable key="t1" id="t1" a={[wx + ws * 0.45, wy]} b={[lerp(960, L[0], sp), lerp(540, L[1], sp)]} k={linkK} o={Math.min(wo, bo) * (1 - dl)} bend={0.1} t={t} flow={1.4} colorA={C.wkc} colorB={C.violet} />);
      svg.push(<Cable key="t2" id="t2" a={[lerp(960, R[0], sp), lerp(540, R[1], sp)]} b={[bx - bs * 0.45, by]} k={linkK} o={Math.min(wo, bo) * (1 - dl)} bend={0.1} t={t} flow={1.4} colorA={C.violet} colorB={C.bf} />);
      if (t >= T.s("deliver")) svg.push(<Cable key="t3" id="t3" a={[wx + ws * 0.45, wy]} b={[bx - bs * 0.45, by]} k={dl} o={Math.min(wo, bo)} bend={-0.12} t={t} flow={1.4} />);
    } else if (!(t >= T.s("wkc") && t < T.s("unlock") + 0.3)) {
      const reK = t >= T.s("unlock") ? k(g, "unlock+0.2", 0.6, MOVE) : t >= T.s("endcard") ? k(g, "endcard+0.6", 0.7, MOVE) : 1;
      const arch = t >= T.s("response") && t < T.s("price") + 0.5 ? -0.16 : t >= T.s("field") - 0.3 && t < T.s("visit") ? -0.1 : 0.0001;
      svg.push(<Cable key="t0" id="t0" a={[wx + ws * 0.45, wy]} b={[bx - bs * 0.45, by]} k={t < T.s("more") ? linkK : reK} o={Math.min(wo, bo)} bend={arch} t={t} flow={1.4} />);
    }
  }
  // the code section: both tiles feed the field
  if (t >= T.s("field") - 0.3 && t < T.s("visit") + 0.4) {
    const fk = k(g, "field+0.3", 0.6, MOVE), fo = 1 - k(g, "visit-0.3", 0.4, MOVE);
    svg.push(<Cable key="fw" id="fw" a={[wx, wy + ws * 0.45]} b={[600, 470]} k={fk} o={fo} bend={0.12} t={t} flow={1.4} colorA={C.wkc} colorB={C.violet} />);
    svg.push(<Cable key="fb" id="fb" a={[bx, by + bs * 0.45]} b={[1320, 470]} k={fk} o={fo} bend={-0.12} t={t} flow={1.4} colorA={C.bf} colorB={C.violet} />);
  }

  // the two tiles (drawn over their cables)
  const tile = (key: string, x: number, y: number, s: number, o: number, glow: string, glowK: number, child: React.ReactNode) =>
    o > 0.01 && els.push(<div key={key} style={{ ...at(x, y, 1, o) }}><Tile size={s} glow={glow} glowK={glowK}>{child}</Tile></div>);
  tile("wkcT", wx, wy, ws, wo, C.wkc, wkcGlow, <WkcMark w={ws * 0.62} grad id="wt" />);
  tile("bfT", bx, by, bs, bo, C.bf, bfGlow, <BfLogo h={bs * 0.42} mark />);
  if (chk.on) els.push(<div key="chk" style={{ ...at(bx + bs * 0.38, by - bs * 0.38, chk.s, chk.o), width: 52, height: 52, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px #fff" }}><Glyph name="check" size={30} color="#fff" stroke={2.8} /></div>);

  // P16–P18: the code
  const fc = life(g, "field", "visit+0.35", 0.6, 0.35);
  const half = life(g, "half", "visit+0.2", 0.5, 0.3), pr = life(g, "four", "visit+0.2", 0.5, 0.3), sp = k(g, "startup", 0.45);
  if (fc.on) {
    els.push(<div key="fl" style={{ ...at(960, 560, fc.s, fc.o) }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        <Label size={18}>Referral code</Label>
        <CodeField g={g} w={820} size={92} />
      </div>
    </div>);
  }
  if (half.on) els.push(<div key="half" style={{ ...at(1480, 470, half.s, half.o), padding: "16px 28px", borderRadius: 999, background: GRAD, color: "#fff", fontFamily: F.display, fontWeight: 800, fontSize: 58, letterSpacing: "-0.04em", boxShadow: `0 20px 40px -18px ${rgba(C.violet, 0.8)}`, transform: `translate3d(1480px, 470px, 0) translate(-50%, -50%) scale(${half.s}) rotate(${-6 * half.s}deg)` }}>−50%</div>);
  if (pr.on) els.push(
    <div key="pr" style={{ ...at(960, 800, pr.s, pr.o), display: "flex", alignItems: "baseline", gap: 22, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.05em", color: C.ink, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 120, lineHeight: 1 }}>€400</span>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, letterSpacing: "0", color: C.txt2, opacity: sp, transform: `translateX(${(1 - sp) * 16}px)`, display: "inline-block" }}>WKConversions startup price</span>
    </div>
  );

  // P19–P21: the contact page
  const br = life(g, "visit", "endcard", 0.6, 0.5);
  if (br.on) {
    const url = (() => {
      const host = "wkconversions", tw = T.s("w:wkconversions3"), te = tw + 1.05;
      const n = Math.round(host.length * clamp01((t - tw) / (te - tw)));
      let s = host.slice(0, n);
      if (t >= T.s("w:dot")) s += ".";
      if (t >= T.s("w:com")) s += "com";
      if (t >= T.s("w:slash")) s += "/";
      if (t >= T.s("w:contact")) s += "contact".slice(0, Math.round(7 * clamp01((t - T.s("w:contact")) / 0.55)));
      return s;
    })();
    const page = k(g, "visit+0.45", 0.6);
    const sub = k(g, "claim+0.55", 0.2, (u) => u), press = Math.sin(Math.PI * sub);
    const cut = k(g, "two", 0.35, MOVE), n200 = Math.round(lerp(400, 200, EASE.steady(k(g, "two+0.1", 0.7, (u) => u))));
    const cur = k(g, "claim", 0.6, MOVE);
    els.push(
      <div key="br" style={{ ...at(960, 560, br.s, br.o) }}>
        <Window w={1400} h={800} url={<span>{url}<span style={{ display: "inline-block", width: 2, height: 18, marginLeft: 2, background: C.txt2, verticalAlign: "-3px", opacity: Math.floor(t * 2.4) % 2 ? 1 : 0.2 }} /></span>}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1000, opacity: page, transform: `translateY(${(1 - page) * 20 + 40 - 26 * Math.max(0, t - T.s("visit")) + 26 * Math.max(0, t - T.s("claim"))}px)`, backgroundImage: "radial-gradient(circle, #D3D7E3 2.2px, transparent 2.7px)", backgroundSize: "36px 36px" }}>
            <div style={{ position: "absolute", left: 70, top: 110, width: 600 }}>
              <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: C.wkc, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 18 }}>Your video starts here</div>
              <div style={{ marginTop: 26, fontFamily: F.display, fontWeight: 800, fontSize: 78, lineHeight: 1, letterSpacing: "-0.05em", color: C.ink }}>Tell us about <span style={{ color: C.wkc }}>your video.</span></div>
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}><Skel w={520} h={12} /><Skel w={470} h={12} /><Skel w={380} h={12} /></div>
            </div>
            <div style={{ position: "absolute", right: 60, top: 40, width: 620, borderRadius: 24, background: "#fff", boxShadow: "0 24px 50px -30px rgba(40,50,110,0.4), inset 0 0 0 1px #E6E9F2", padding: 32, boxSizing: "border-box", fontFamily: F.ui }}>
              {["Company name", "Website", "Where will it be used?"].map((l) => (
                <div key={l} style={{ marginBottom: 18 }}><div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{l}</div><div style={{ height: 40, borderRadius: 10, boxShadow: "inset 0 0 0 1.5px #E1E4EE" }} /></div>
              ))}
              <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Referral code</div>
              <div style={{ transformOrigin: "0 0" }}><CodeField g={g} w={576} size={34} caret={false} /></div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 16, fontFamily: F.display, fontWeight: 800, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: F.ui, fontSize: 20, fontWeight: 600, letterSpacing: 0, color: C.txt2 }}>Price:</span>
                <span style={{ position: "relative", fontSize: 54, color: mix("#0B1324", "#A3A8BC", cut) }}>€400
                  <span style={{ position: "absolute", left: -4, right: -4, top: "52%", height: 6, borderRadius: 6, background: GRAD, transformOrigin: "0 50%", transform: `scaleX(${cut}) rotate(-4deg)` }} /></span>
                {cut > 0 && <span style={{ fontSize: 80, opacity: cut, transform: `translateX(${(1 - cut) * 20}px)`, display: "inline-block" }}><GradText>€{n200}</GradText></span>}
              </div>
              <div style={{ marginTop: 18, display: "inline-block", padding: "14px 30px", borderRadius: 12, background: C.wkc, color: "#fff", fontWeight: 600, fontSize: 20, transform: `scale(${1 - 0.06 * press})` }}>Submit</div>
            </div>
          </div>
        </Window>
        {cur > 0 && <Cursor x={lerp(1180, 840, cur)} y={lerp(860, 600, cur)} press={press} o={clamp01(cur * 3) * (1 - k(g, "endcard-0.2", 0.3))} />}
      </div>
    );
  }

  // the end card: the lockup, the code, where to claim it
  const ec = life(g, "endcard+0.3", undefined, 0.6);
  if (ec.on) {
    const x2 = k(g, "endcard+0.55", 0.5);
    els.push(<div key="x" style={{ ...at(960, 380, lerp(0.5, 1, x2), x2), width: 96, height: 96, borderRadius: "50%", background: "#fff", boxShadow: `0 16px 30px -16px ${rgba(C.violet, 0.6)}, inset 0 0 0 2px ${rgba(C.violet, 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 84, color: C.violet, lineHeight: 1, paddingBottom: 10, boxSizing: "border-box" }}>×</div>);
    els.push(<div key="ec" style={{ ...at(960, 720, ec.s, ec.o), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ padding: "18px 52px", borderRadius: 999, background: "#fff", boxShadow: `inset 0 0 0 3px ${C.violet}, 0 24px 50px -26px rgba(40,50,110,0.5)`, fontFamily: F.display, fontWeight: 800, fontSize: 96, letterSpacing: "0.05em" }}><GradText>BFOUND50</GradText></div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 54, letterSpacing: "-0.04em", color: C.ink, opacity: k(g, "endcard+0.6", 0.5), whiteSpace: "nowrap" }}>Your video for <GradText>€200</GradText> at wkconversions.com/contact</div>
    </div>);
  }

  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{svg}</svg>
      {els}
    </>
  );
};

/** The film's few words: the key phrase of a beat, never the whole voice-over. */
export const Headlines: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Headline g={g} x={960} y={110} size={78} align="center" out="maker-0.3" lines={[
      [{ t: "A", at: "w:a" }, { t: "great", at: "w:great" }, { t: "partnership", at: "w:partnership", key: true }],
      [{ t: "creates", at: "w:create" }, { t: "more", at: "w:more" }, { t: "than", at: "w:than" }, { t: "great", at: "w:great2", key: true }, { t: "work.", at: "w:work", key: true }],
    ]} />
    <Headline g={g} x={170} y={140} size={76} out="response-0.3" lines={[
      [{ t: "Made", at: "w:after" }, { t: "by", at: "w:after" }, { t: "WKConversions", at: "w:wkconversions", key: true }],
      [{ t: "for", at: "w:for" }, { t: "bFound.", at: "w:bfound", key: true }],
    ]} />
    <Headline g={g} x={960} y={880} size={70} align="center" out="wkc-0.3" lines={[
      [{ t: "Inaccessible", at: "w:inaccessible", grey: true }, { t: "to", at: "w:to" }, { t: "many", at: "w:many" }, { t: "businesses.", at: "w:businesses" }],
    ]} />
    <Headline g={g} x={960} y={830} size={70} align="center" out="field-0.3" lines={[
      [{ t: "WKConversions", at: "w:wkconversions2", key: true }, { t: "×", at: "w:and" }, { t: "bFound", at: "w:bfound2", key: true }],
      [{ t: "changed", at: "w:change" }, { t: "that.", at: "w:that" }],
    ]} />
    <Headline g={g} x={960} y={330} size={58} align="center" out="visit-0.2" lines={[
      [{ t: "50%", at: "half", key: true }, { t: "off", at: "w:off", key: true }, { t: "our", at: "w:our" }, { t: "startup", at: "w:startup" }, { t: "price.", at: "w:price" }],
    ]} />
  </>
);
