// The screen-facing cards: each grows out of a block's roof on its word and folds back into it, tethered by a hairline
// stem while the camera moves. The tags and offer cards (P1–P5), the grey cards of most businesses (P6–P9), and the one
// card on your roof that carries the story from "content" to the sign-off (P10–P26), then the sign-off badge.
import React from "react";
import { T } from "./clock";
import { ARRIVE, C, DEPART, F, MOVE, clamp01, lerp, mix, rgba } from "./lib";
import { EASE } from "./kinetic";
import { hash } from "./iso";
import { BIZ, Biz } from "./map";
import { VIEW, compRoof, k, roofAt, sec, youRoof } from "./scene";
import { Button, Card, Cursor, Icon, Mark, Tag } from "./ui";

const lin = (u: number) => u;
/** In on `inAt` (scale 0.15 → 1 on the site's ease, opacity over 4 frames), out on `outAt` (folds back down). */
export const life = (g: number, inAt: string, outAt?: string, dIn = 0.5, dOut = 0.36) => {
  const u = k(g, inAt, dIn, lin), e = outAt ? k(g, outAt, dOut, DEPART) : 0, eo = outAt ? k(g, outAt, dOut, MOVE) : 0;
  return { s: lerp(0.15, 1, ARRIVE(u)) * (1 - 0.85 * e), o: clamp01((u * dIn * 30) / 4) * (1 - eo), on: u > 0 && e < 1 };
};

/** A card floating above an anchor point (a roof), bottom-centre at (ax + dx, ay - lift), with a stem down to the roof. */
const Float: React.FC<{ ax: number; ay: number; lift: number; dx?: number; w: number; h: number; s: number; o: number; stem?: boolean; children: React.ReactNode; z?: number; blur?: number; top?: number; name: string }> = ({
  ax, ay, lift, dx = 0, w, h, s, o, stem = true, children, blur = 0, top, name }) => {
  if (o <= 0.001) return null;
  const bx = ax + dx * s, by = top === undefined ? ay - lift * s : Math.max(ay - lift * s, top + h * s);
  return (
    <>
      {stem && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o }}>
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.txt3} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={5} fill={C.card} stroke={C.txt3} strokeWidth={2} />
        </svg>
      )}
      <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, opacity: o, transform: `translate3d(${bx - w / 2}px, ${by - h}px, 0)`, willChange: "transform" }}>
        <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 100%", filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
          {children}
        </div>
      </div>
    </>
  );
};

const Bar: React.FC<{ w: number | string; h?: number; c?: string; style?: React.CSSProperties }> = ({ w, h = 12, c = C.line, style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: c, flex: "none", ...style }} />
);

// ---------------- P1–P5: tags and the same offer ----------------
const OfferCard: React.FC<{ g: number; who: string; comm: boolean }> = ({ g, who, comm }) => {
  const t = sec(g), m = comm ? k(g, "comm", 0.5, MOVE) : 0;
  return (
    <Card style={{ left: 0, top: 0, width: 300, height: 176, padding: 22, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="cube" size={26} stroke={1.6} /></div>
        <div>
          <div style={{ fontSize: 15, color: C.txt3, fontWeight: 500 }}>{who}</div>
          <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Offer</div>
        </div>
        {comm && <div style={{ marginLeft: "auto", opacity: m, transform: `scale(${0.6 + 0.4 * m})` }}><Icon name="signal" size={30} color={C.blue} stroke={1.8} /></div>}
      </div>
      <div style={{ position: "relative", marginTop: 20, height: 70 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 11, opacity: 1 - m }}>
          <Bar w="88%" /><Bar w="70%" /><Bar w="52%" />
        </div>
        {comm && m > 0 && (
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: C.ink, opacity: m, overflow: "hidden" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 14, top: 12 + i * 17, height: 9, borderRadius: 9, background: i === 0 ? C.blue : "#6FA9EE",
              width: `${30 + 50 * (0.5 + 0.5 * Math.sin(t * 5 + i * 1.9))}%` }} />)}
            <div style={{ position: "absolute", right: 14 + 20 * Math.sin(t * 3), top: 18 + 14 * Math.cos(t * 4.2), width: 26, height: 26, borderRadius: "50%", background: C.blue }} />
          </div>
        )}
      </div>
    </Card>
  );
};

const Tags: React.FC<{ g: number }> = ({ g }) => {
  const [yx, yy] = youRoof(g), [cx, cy] = compRoof(g);
  const a = life(g, "youTag", "offer-0.2", 0.45, 0.3), b = life(g, "compTag", "offer-0.2", 0.45, 0.3);
  const o1 = life(g, "offer", "most-0.05", 0.5, 0.4), o2 = life(g, "offer+0.1", "most-0.05", 0.5, 0.4);
  const eq = life(g, "equal", "comm", 0.4, 0.3);
  // the two cards, and the "=" between them
  const ly = (yy + cy) / 2 - 40 - 88 - 42;
  return (
    <>
      <Float name="youTag" ax={yx} ay={yy} lift={40} w={220} h={76} s={a.s} o={a.o}><div style={{ display: "flex", justifyContent: "center" }}><Tag size={36} dot={C.txt3}>You</Tag></div></Float>
      <Float name="compTag" ax={cx} ay={cy} lift={40} w={300} h={64} s={b.s} o={b.o}><div style={{ display: "flex", justifyContent: "center" }}><Tag size={30} dot={C.ink}>Competitor</Tag></div></Float>
      <Float name="yourOffer" ax={yx} ay={yy} lift={40} w={300} h={176} s={o1.s} o={o1.o}><OfferCard g={g} who="Your" comm={false} /></Float>
      <Float name="theirOffer" ax={cx} ay={cy} lift={40} w={300} h={176} s={o2.s} o={o2.o}><OfferCard g={g} who="Their" comm /></Float>
      {eq.o > 0 && (
        <div style={{ position: "absolute", left: (yx + cx) / 2 - 42, top: ly + 4, width: 84, height: 84, borderRadius: "50%", background: C.blue, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 800, fontSize: 60, lineHeight: 1,
          opacity: eq.o, transform: `scale(${eq.s})`, boxShadow: `0 16px 30px -12px ${rgba(C.blue, 0.6)}` }}>=</div>
      )}
    </>
  );
};

// ---------------- P6–P9: most businesses ----------------
/** The grey cards sit on the nearest business to each of these lots (some lots are empty). */
const GREY = ([[-3, -1], [-2, 1], [0, -1]] as [number, number][]).map(([i, j]) =>
  BIZ.filter((b) => b.role === "biz").reduce((a, b) => (Math.hypot(b.i - i, b.j - j) < Math.hypot(a.i - i, a.j - j) ? b : a))) as Biz[];
const GLYPH = "abcdefghijklmnopqrstuvwxyz#%&?*/0123456789";
const scramble = (n: number, seed: number, g: number) => Array.from({ length: n }, (_, i) => (hash(i, seed, Math.floor(g / 2)) < 0.16 ? " " : GLYPH[Math.floor(hash(i, seed, Math.floor(g / 2) + 1) * GLYPH.length)])).join("");
const GreyCard: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const drain = k(g, `lose+${0.06 * i}`, 0.9, MOVE), un = k(g, `unclear+${0.05 * i}`, 0.3), fo = k(g, `forget+${0.04 * i}`, 0.6, MOVE), im = k(g, `visuals+${0.07 * i}`, 0.4, ARRIVE);
  return (
    <Card radius={18} style={{ left: 0, top: 0, width: 230, height: 146, padding: 16, boxSizing: "border-box", opacity: 1 - 0.35 * fo,
      boxShadow: fo > 0 ? `inset 0 0 0 2px ${rgba("#AEB4BC", fo)}` : undefined, background: fo > 0 ? `rgba(255,255,255,${1 - 0.3 * fo})` : C.card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="eye" size={20} color={C.txt3} stroke={1.6} />
        <div style={{ flex: 1, height: 12, borderRadius: 12, background: C.card2, overflow: "hidden" }}>
          <div style={{ width: `${lerp(68 - 8 * i, 5, drain)}%`, height: "100%", borderRadius: 12, background: mix(C.txt3, "#C9CED4", drain) }} />
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 14, height: 84, display: "flex", gap: 12 }}>
        {im > 0 && (
          <div style={{ width: 70, height: 70, borderRadius: 12, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${im})` }}>
            <Icon name="image" size={40} color="#AEB4BC" stroke={1.4} />
          </div>
        )}
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 10, opacity: 1 - un }}><Bar w="90%" h={10} /><Bar w="72%" h={10} /><Bar w="56%" h={10} /></div>
          {un > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: un, fontFamily: F.ui, fontSize: 15, lineHeight: "20px", color: C.txt3, fontWeight: 500, overflow: "hidden", wordBreak: "break-all", letterSpacing: "0.02em" }}>
              {scramble(im > 0 ? 40 : 66, i, g)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
const GreyCards: React.FC<{ g: number }> = ({ g }) => {
  if (sec(g) < T.s("most") - 0.1 || sec(g) > T.s("content") + 0.5) return null;
  const v = VIEW(g);
  return (
    <>
      {GREY.map((b, i) => {
        const [x, y] = roofAt(g, b, 0, v);
        const l = life(g, `most+${0.09 * i}`, `content-${0.25 - 0.05 * i}`, 0.5, 0.36);
        return <Float name={`grey${i}`} key={b.id} ax={x} ay={y} lift={30} w={230} h={146} s={l.s * 1.1} o={l.o} top={36}><GreyCard g={g} i={i} /></Float>;
      })}
    </>
  );
};

// ---------------- P10–P26: the card on your roof ----------------
const CW = 640, CH = 420;
/** A scene inside the card: in on `a`, out on `b` (cross-fades with a small rise and blur). */
const sceneO = (g: number, a: string, b?: string, dIn = 0.35, dOut = 0.25) => {
  const i = k(g, a, dIn), o = b ? k(g, b, dOut, DEPART) : 0, oo = b ? k(g, b, dOut, MOVE) : 0;
  return { o: i * (1 - oo), y: (1 - i) * 18 - o * 14, blur: (1 - i) * 6 + o * 6, on: i > 0 && o < 1 };
};
const Scene: React.FC<{ s: { o: number; y: number; blur: number; on: boolean }; children: React.ReactNode; top?: number }> = ({ s, children, top = 88 }) =>
  !s.on ? null : (
    <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, opacity: s.o, transform: `translateY(${s.y}px)`, filter: s.blur > 0.1 ? `blur(${s.blur}px)` : undefined }}>{children}</div>
  );

const N_PTS = 90;
const knot = (i: number): [number, number] => {
  const u = i / (N_PTS - 1), a = u * Math.PI * 2;
  return [170 + 120 * Math.sin(a * 2 + 0.4) + 45 * Math.cos(a * 7), 120 + 80 * Math.sin(a * 3) + 30 * Math.sin(a * 9 + 1)];
};
const straight = (i: number): [number, number] => [40 + (520 * i) / (N_PTS - 1), 130];
const growth = (i: number): [number, number] => { const u = i / (N_PTS - 1); return [40 + 520 * u, 205 - 175 * Math.pow(u, 1.9) + 10 * Math.sin(u * 9) * (1 - u)]; };
const pathOf = (p: [number, number][]) => "M" + p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");

/** The process as one compact line: each step lights blue as it is spoken and takes its check when the next one starts. */
const Stepper: React.FC<{ g: number }> = ({ g }) => {
  const steps = ["Goal", "Message", "Concept", "Frames"], at = ["goal", "sharpen", "concept", "frames"];
  return (
    <div style={{ position: "absolute", left: 30, top: 96, height: 36, display: "flex", alignItems: "center", gap: 5 }}>
      {steps.map((s, i) => {
        const on = k(g, at[i], 0.35, MOVE), done = i < 3 ? k(g, at[i + 1], 0.35, MOVE) : k(g, "purpose", 0.35, MOVE);
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px 5px 5px", borderRadius: 999, background: mix(C.card2, C.blueSoft, on) }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: mix(C.card, C.blue, done), boxShadow: `inset 0 0 0 2px ${mix("#C9CED4", C.blue, on)}`,
              display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.18 * Math.sin(Math.PI * on)})` }}>
              {done > 0 && <Icon name="check" size={13} color="#fff" stroke={2.6} style={{ opacity: done, transform: `scale(${0.6 + 0.4 * done})` }} />}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: mix(C.txt3, C.blueInk, on) }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

const Sketch: React.FC<{ i: number; w: number; h: number; c?: string }> = ({ i, w, h, c = C.txt2 }) => {
  const m = i % 6;
  return (
    <svg width={w} height={h} viewBox="0 0 100 60" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      {m === 0 && <><path d="M50 12l22 12v16L50 52 28 40V24z" /><path d="M28 24l22 12 22-12M50 36v16" /></>}
      {m === 1 && <><circle cx="38" cy="32" r="14" /><path d="M60 22h22M60 32h16M60 42h20" /></>}
      {m === 2 && <path d="M14 46c14-2 18-30 34-30s16 22 38 20" />}
      {m === 3 && <><rect x="22" y="16" width="56" height="30" rx="6" /><path d="M40 31h20M54 25l6 6-6 6" /></>}
      {m === 4 && <><path d="M16 46l20-18 14 10 20-22 14 12" /><circle cx="84" cy="28" r="4" fill={c} /></>}
      {m === 5 && <><circle cx="50" cy="30" r="16" /><circle cx="50" cy="30" r="6" fill={c} /></>}
    </svg>
  );
};

const MainCard: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  if (t < T.s("content") - 0.1 || t > T.s("fin") + 0.7) return null;
  const [ax, ay] = youRoof(g, 6);
  const l = life(g, "content", "fin", 0.55, 0.5);
  // the process (P20–P23) brings the card forward and a little larger
  const fw = k(g, "goal", 0.9, EASE.soft) * (1 - k(g, "fin-0.3", 0.5, MOVE));
  const lift = lerp(60, 90, fw), dx = lerp(-270, -350, fw), sc = lerp(1.04, 1.16, fw);
  const s1 = sceneO(g, "content+0.15", "brand-0.3", 0.35, 0.22);
  const sB = sceneO(g, "brand-0.05", "comes", 0.3, 0.3);
  const head = k(g, "comes", 0.55, MOVE);
  const sK = sceneO(g, "complex", "motion-0.3", 0.35, 0.22);
  const sM = sceneO(g, "motion", "explain-0.3", 0.35, 0.22);
  const sE = sceneO(g, "explain", "drive-0.3", 0.35, 0.22);
  const sC = sceneO(g, "drive+0.18", "goal-0.35", 0.35, 0.22);
  const sG = sceneO(g, "goal", "sharpen-0.3", 0.35, 0.22);
  const sS = sceneO(g, "sharpen", "concept-0.3", 0.35, 0.22);
  const sP = sceneO(g, "concept-0.05", "frames-0.3", 0.5, 0.22);
  const sF = sceneO(g, "frames-0.05", undefined, 0.5);
  // the strip's travel: 160 px/s, slowed to a third while the random shapes are on (they are the loudest motion then)
  let stripX = 0;
  for (let f = T.f("frames"); f < g; f++) stripX += (160 / 30) * (1 - (2 / 3) * (k(f, "random", 0.4, MOVE) - k(f, "strike1+0.3", 0.4, MOVE)));
  const stepO = k(g, "goal", 0.4);
  // knot → line → growth curve
  const dr = k(g, "complex", 0.6, EASE.steady), cl1 = k(g, "clear", 0.6, MOVE), gr = k(g, "perf", 0.7, MOVE);
  const writhe = 1 - cl1;
  const curve = Array.from({ length: N_PTS }, (_, i) => {
    const a0 = knot(i), b = straight(i), c = growth(i);
    const a: [number, number] = [a0[0] + writhe * 9 * Math.sin(t * 5.5 + i * 0.45), a0[1] + writhe * 9 * Math.cos(t * 4.7 + i * 0.38)];
    const p: [number, number] = [lerp(a[0], b[0], cl1), lerp(a[1], b[1], cl1)];
    return [lerp(p[0], c[0], gr), lerp(p[1], c[1], gr)] as [number, number];
  });
  const bars = [0, 1, 2].map((i) => {
    const jx = 340 + 150 * hash(i, 1, 3) + 10 * Math.sin(t * 4 + i), jy = 30 + 170 * hash(i, 2, 3) + 8 * Math.cos(t * 3.4 + i * 2), jr = (hash(i, 3, 3) - 0.5) * 50 + 9 * Math.sin(t * 3 + i);
    const nx = 340, ny = 40 + i * 30, nr = 0;
    const w = i === 0 ? 200 : 210 - 22 * i;
    const ap = k(g, `offers+${0.05 * i}`, 0.35, ARRIVE) * (1 - gr);
    return { x: lerp(jx, nx, cl1), y: lerp(jy, ny, cl1), r: lerp(jr, nr, cl1), w, ap, blue: i === 0 ? cl1 : 0 };
  });
  // the cursor: hovers "Learn more" and leaves (P10); clicks "Start a project" (P19)
  const c1 = k(g, "cursor", 0.9, MOVE), c2 = k(g, "act", 0.7, EASE.whipIn);
  const cur1 = { x: lerp(lerp(700, 470, c1), 760, c2), y: lerp(lerp(470, 330, c1), 300, c2), o: clamp01((t - T.s("cursor")) * 6) * (1 - c2) };
  const d1 = k(g, "drive+0.15", 0.6, MOVE), press = Math.sin(Math.PI * k(g, "conv", 0.22, (u) => u)) , rip = k(g, "conv+0.05", 0.6, EASE.whipOut);
  const cur2 = { x: lerp(680, 360, d1), y: lerp(460, 262, d1), o: clamp01((t - T.s("drive") - 0.15) * 6) * (1 - k(g, "goal-0.3", 0.3)) };
  return (
    <Float name="mainCard" ax={ax} ay={ay} lift={lift} dx={dx} w={CW} h={CH} s={l.s * sc} o={l.o}>
      <Card style={{ left: 0, top: 0, width: CW, height: CH }}>
        {/* header: a browser bar, then the wkc mark once WKConversions comes in */}
        <div style={{ position: "absolute", left: 24, right: 24, top: 20, height: 48, display: "flex", alignItems: "center", gap: 10 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: C.line, opacity: 1 - head }} />)}
          <div style={{ marginLeft: 12, flex: 1, height: 30, borderRadius: 15, background: C.card2, opacity: 1 - head }} />
          {head > 0 && (
            <div style={{ position: "absolute", left: 0, top: 4, display: "flex", alignItems: "center", gap: 12, opacity: head, transform: `translateY(${(1 - head) * 10}px)` }}>
              <Mark w={70} id="hdr" />
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 24, letterSpacing: "-0.04em" }}>WKConversions</div>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 80, height: 1, background: C.line }} />
        {/* P10: generic content with no reason to act */}
        <Scene s={s1}>
          <div style={{ position: "absolute", left: 32, top: 24, width: 230, height: 190, borderRadius: 16, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="image" size={92} color="#C9CED4" stroke={1.2} />
          </div>
          <div style={{ position: "absolute", left: 290, top: 30, display: "flex", flexDirection: "column", gap: 14 }}>
            <Bar w={260} h={22} c="#D3D7DD" /><Bar w={300} h={12} /><Bar w={280} h={12} /><Bar w={220} h={12} />
          </div>
          <div style={{ position: "absolute", left: 290, top: 200 }}>
            <Button grey label="Learn more" size={22} press={0} style={{ boxShadow: `inset 0 0 0 1.5px ${c1 > 0.95 && c2 < 0.2 ? "#AEB4BC" : C.line}` }} />
          </div>
        </Scene>
        {/* P11: the mark writes itself on */}
        {sB.on && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 80, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18,
            opacity: sB.o, transform: `scale(${1 - 0.25 * k(g, "comes", 0.4, DEPART)})`, filter: sB.blur > 0.1 ? `blur(${sB.blur}px)` : undefined }}>
            <Mark w={300} id="big" reveal={k(g, "brand", 0.75, EASE.steady)} />
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 48, letterSpacing: "-0.05em", opacity: k(g, "brand+0.35", 0.4), transform: `translateY(${(1 - k(g, "brand+0.35", 0.4)) * 14}px)` }}>WKConversions</div>
          </div>
        )}
        {/* P12: the site's own line, while WKConversions comes in */}
        <Scene s={sceneO(g, "comes+0.4", "complex-0.3", 0.4, 0.22)}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F.display, fontWeight: 800, fontSize: 52, letterSpacing: "-0.05em", lineHeight: 1.04 }}>
            Motion design that<br />makes it <span style={{ color: C.blue, position: "relative" }}>click.
              <span style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: 7, borderRadius: 7, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${k(g, "comes+0.55", 0.5, MOVE)})` }} /></span>
          </div>
        </Scene>
        {/* P13–P15: complex → clear → high-performance */}
        <Scene s={sK} top={96}>
          <svg width={CW} height={300} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {gr > 0 && <path d={pathOf(curve) + ` L560,250 L40,250 Z`} fill={rgba(C.blue, 0.1 * gr)} />}
            <path d={pathOf(curve)} fill="none" stroke={mix(mix(C.txt2, C.ink, cl1), C.blue, gr)} strokeWidth={lerp(4, 6, cl1)} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={`${dr} 1`} />
            {gr > 0.6 && (() => { const u = clamp01((gr - 0.6) / 0.4), i = Math.round(lerp(0, N_PTS - 1, EASE.steady(u))), p = curve[i];
              return <><circle cx={p[0]} cy={p[1]} r={14 + 4 * Math.sin(t * 7)} fill={rgba(C.blue, 0.2)} /><circle cx={p[0]} cy={p[1]} r={9} fill="#fff" stroke={C.blue} strokeWidth={4} /></>; })()}
          </svg>
          {bars.map((b, i) => b.ap > 0.01 && (
            <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: i === 0 ? 18 : 12, borderRadius: 12, background: i === 0 ? mix("#AEB4BC", C.blue, b.blue) : "#D3D7DD",
              transform: `rotate(${b.r}deg) scale(${b.ap})`, transformOrigin: "0 50%", opacity: Math.min(1, b.ap * 1.5) }} />
          ))}
        </Scene>
        {/* P16–P17: motion design, playing */}
        <Scene s={sM} top={96}>
          <div style={{ position: "absolute", left: 28, right: 28, top: 10, height: 290, borderRadius: 18, background: C.blue, overflow: "hidden" }}>
            {(() => {
              const u = t * 1.6, b = Math.abs(Math.sin(u * Math.PI)), sq = 1 - Math.max(0, 1 - b * 6) * 0.3;
              return (
                <>
                  <div style={{ position: "absolute", left: 90, top: 210 - 150 * b, width: 70, height: 70, borderRadius: "50%", background: "#fff", transform: `scale(${1 / sq}, ${sq})`, transformOrigin: "50% 100%" }} />
                  <div style={{ position: "absolute", left: 250, top: 90, width: 90, height: 90, borderRadius: 22, background: C.ink, transform: `rotate(${t * 140}deg) scale(${0.85 + 0.15 * Math.sin(t * 5)})` }} />
                  <div style={{ position: "absolute", left: 400 + 60 * Math.sin(t * 2.6), top: 70, width: 130, height: 22, borderRadius: 22, background: "#fff" }} />
                  <div style={{ position: "absolute", left: 400 + 60 * Math.sin(t * 2.6 + 1.1), top: 110, width: 90, height: 22, borderRadius: 22, background: "#6FA9EE" }} />
                  <div style={{ position: "absolute", left: 400 + 60 * Math.sin(t * 2.6 + 2.2), top: 150, width: 110, height: 22, borderRadius: 22, background: "#fff" }} />
                  <svg width={60} height={60} viewBox="0 0 60 60" style={{ position: "absolute", left: 455 + 40 * Math.cos(t * 3), top: 200 + 18 * Math.sin(t * 3), transform: `rotate(${-t * 90}deg)` }}><path d="M30 6l24 44H6z" fill={C.ink} /></svg>
                </>
              );
            })()}
          </div>
        </Scene>
        {/* P18: explain value */}
        <Scene s={sE} top={96}>
          {["Problem", "Solution", "Value"].map((s, i) => {
            const a = k(g, `explain+${0.13 * i}`, 0.4, ARRIVE), v = i === 2 ? k(g, "value", 0.45, MOVE) : 0;
            return (
              <React.Fragment key={s}>
                <div style={{ position: "absolute", left: 40 + i * 190, top: 40, width: 180, height: 150, borderRadius: 18, background: mix(C.card, C.blue, v), boxShadow: `inset 0 0 0 2.5px ${mix("#C9CED4", C.blue, v)}`, transform: `scale(${a})`, opacity: Math.min(1, a * 1.4),
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 && <Sketch i={2} w={120} h={72} />}
                  {i === 1 && <Sketch i={5} w={120} h={72} c={C.ink} />}
                  {i === 2 && <Icon name="check" size={70} color={mix(C.txt2, "#FFFFFF", v)} stroke={2.2} />}
                </div>
                <div style={{ position: "absolute", left: 40 + i * 190, width: 180, top: 202, textAlign: "center", fontSize: 22, fontWeight: 600, color: i === 2 ? mix(C.txt2, C.blueInk, v) : C.txt2, opacity: a }}>{s}</div>
              </React.Fragment>
            );
          })}
        </Scene>
        {/* P19: drive conversion: the site's own button, clicked */}
        <Scene s={sC} top={96}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: F.display, fontWeight: 800, fontSize: 36, letterSpacing: "-0.045em" }}>Ready to make your story <span style={{ color: C.blue }}>click?</span></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 360 * rip, height: 360 * rip, marginLeft: -180 * rip, marginTop: -180 * rip, borderRadius: "50%", border: `3px solid ${C.blue}`, opacity: 1 - rip }} />}
              <Button size={30} press={press} />
            </div>
          </div>
          {cur2.o > 0 && <Cursor x={cur2.x} y={cur2.y - 96} press={press} o={cur2.o} />}
        </Scene>
        {cur1.o > 0 && <Cursor x={cur1.x} y={cur1.y} o={cur1.o} />}
        {/* P20–P23: the process */}
        {stepO > 0 && <div style={{ opacity: stepO * (1 - k(g, "fin", 0.3)) }}><Stepper g={g} /></div>}
        <Scene s={sG} top={150}>
          {(() => {
            const hit = k(g, "goalHit", 0.35, EASE.impact), pop = k(g, "goalHit+0.35", 0.6, EASE.whipOut);
            return (
              <svg width={CW} height={260} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                {[100, 70, 40].map((r, i) => <circle key={r} cx={320} cy={125} r={r * k(g, `goal+${0.08 * i}`, 0.45, ARRIVE)} fill={i === 2 ? C.blue : "none"} stroke={i === 2 ? C.blue : C.txt2} strokeWidth={4} />)}
                {pop > 0 && pop < 1 && <circle cx={320} cy={125} r={40 + 110 * pop} fill="none" stroke={C.blue} strokeWidth={4} opacity={1 - pop} />}
                <circle cx={lerp(620, 320, hit)} cy={lerp(-60, 125, hit)} r={13} fill="#fff" stroke={C.ink} strokeWidth={5} opacity={clamp01((t - T.s("goal") - 0.2) * 5)} />
              </svg>
            );
          })()}
        </Scene>
        <Scene s={sS} top={150}>
          {(() => {
            const sh = k(g, "sharpen+0.1", 0.8, EASE.soft);
            return (
              <div style={{ position: "absolute", left: 50, top: 40 }}>
                <div style={{ position: "relative", display: "inline-block", fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: `${lerp(0.02, -0.05, sh)}em`, filter: `blur(${(1 - sh) * 12}px)`, color: C.ink }}>
                  Your message.
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 8, borderRadius: 8, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${k(g, "w:message", 0.5, MOVE)})` }} />
                </div>
                <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 12, filter: `blur(${(1 - sh) * 8}px)` }}><Bar w={420} /><Bar w={330} /></div>
              </div>
            );
          })()}
        </Scene>
        <Scene s={sP} top={150}>
          <div style={{ position: "absolute", left: 28, right: 28, top: 8, height: 238, borderRadius: 16, background: C.ink }}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = k(g, `concept+${0.07 * i}`, 0.4, ARRIVE);
              return <div key={i} style={{ position: "absolute", left: 14 + (i % 3) * 192, top: 14 + Math.floor(i / 3) * 108, width: 180, height: 98, borderRadius: 10, background: C.card,
                transform: `scale(${a})`, opacity: Math.min(1, a * 1.4), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sketch i={i} w={110} h={66} />
              </div>;
            })}
          </div>
        </Scene>
        <Scene s={sF} top={150}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 24, height: 160, overflow: "hidden", background: C.ink }}>
            {Array.from({ length: 9 }, (_, i) => {
              const x = ((i * 168 - stripX) % (9 * 168) + 9 * 168) % (9 * 168) - 168;
              const tick = clamp01((t - T.s("every")) * 4) * ARRIVE(clamp01((320 - (x + 75)) / 36));
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 22, width: 150, height: 116, borderRadius: 10, background: "#1C2835", overflow: "hidden", transform: `translate3d(${x}px, 0, 0)` }}>
                  <div style={{ position: "absolute", inset: 10, borderRadius: 6, background: C.card, display: "flex", alignItems: "center", justifyContent: "center" }}><Sketch i={i} w={96} h={58} /></div>
                  {tick > 0 && <div style={{ position: "absolute", right: 6, top: 6, width: 30, height: 30, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center",
                    transform: `scale(${tick})` }}><Icon name="check" size={18} color="#fff" stroke={2.6} /></div>}
                </div>
              );
            })}
            {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: -24, right: -24, top: r ? 146 : 6, height: 8, backgroundImage: "radial-gradient(circle, #33404E 3px, transparent 3.5px)", backgroundSize: "24px 8px", transform: `translate3d(${-(stripX % 24)}px, 0, 0)` }} />)}
            <div style={{ position: "absolute", left: 318, top: 0, bottom: 0, width: 4, background: C.blue, opacity: clamp01((t - T.s("every") + 0.2) * 4) }} />
          </div>
          {(() => { const p = k(g, "purpose", 0.45, ARRIVE);
            return p > 0 && <div style={{ position: "absolute", right: 30, top: 196, transform: `scale(${p})`, transformOrigin: "100% 50%" }}><Tag dot={C.blue} size={20}>Every frame with purpose</Tag></div>; })()}
        </Scene>
      </Card>
    </Float>
  );
};

// ---------------- P24–P26: no random animations, no visuals just to look good ----------------
const Clutter: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  if (t < T.s("random") - 0.1 || t > T.s("sweep") + 0.8) return null;
  const [ax, ay] = youRoof(g, 6);
  const cx = ax - 350 * 1.16, cy = ay - 90 * 1.16 - (CH * 1.16) / 2;      // the card's centre (the process framing)
  const out1 = k(g, "strike1+0.35", 0.35, DEPART), out2 = k(g, "sweep+0.3", 0.35, DEPART);
  // just outside the card's edges (the card is 755 px wide here), well inside the frame
  const shapes = [
    { dx: -470, dy: -130, at: "random" }, { dx: 470, dy: -140, at: "random+0.1" }, { dx: -470, dy: 130, at: "random+0.2" }, { dx: 470, dy: 120, at: "random+0.3" },
  ];
  const decor = [
    { dx: -360, dy: -60, at: "visuals2" }, { dx: 360, dy: -40, at: "visuals2+0.1" }, { dx: -250, dy: 245, at: "visuals2+0.2" }, { dx: 240, dy: -265, at: "visuals2+0.3" }, { dx: 120, dy: 250, at: "just" },
  ];
  return (
    <>
      {shapes.map((s, i) => {
        const a = k(g, s.at, 0.3, ARRIVE) * (1 - out1);
        if (a <= 0.01) return null;
        const wob = Math.sin(t * (7 + i * 1.3) + i) * 18, rot = t * (220 + 90 * i) * (i % 2 ? -1 : 1);
        return (
          <svg key={i} width={140} height={140} viewBox="0 0 90 90" style={{ position: "absolute", left: cx + s.dx - 70 + wob, top: cy + s.dy - 70 + Math.cos(t * 9 + i) * 14, transform: `rotate(${rot}deg) scale(${a})`, overflow: "visible" }}>
            {i % 4 === 0 && <rect x={15} y={15} width={60} height={60} rx={6} fill="none" stroke={C.ink} strokeWidth={6} />}
            {i % 4 === 1 && <path d="M45 8l38 66H7z" fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
            {i % 4 === 2 && <circle cx={45} cy={45} r={32} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="12 10" />}
            {i % 4 === 3 && <path d="M8 60l14-30 14 30 14-30 14 30 14-30" fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />}
          </svg>
        );
      })}
      {decor.map((s, i) => {
        const a = k(g, s.at, 0.35, ARRIVE) * (1 - out2);
        if (a <= 0.01) return null;
        const bob = Math.sin(t * 5 + i * 2) * 8;
        return (
          <div key={`d${i}`} style={{ position: "absolute", left: cx + s.dx - 60, top: cy + s.dy - 60 + bob, width: 120, height: 120, transform: `scale(${a}) rotate(${Math.sin(t * 3 + i) * 12}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i === 0 && <div style={{ width: 110, height: 110, borderRadius: "46% 54% 60% 40%", background: "linear-gradient(135deg,#FF8AD8,#A78BFA 55%,#7DD3FC)" }} />}
            {i === 1 && <svg width={110} height={110} viewBox="0 0 40 40"><path d="M20 2l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="#FFD84D" stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" /></svg>}
            {i === 2 && <svg width={110} height={110} viewBox="0 0 40 40"><path d="M20 20m-2 0a2 2 0 1 1 4 0a5 5 0 1 1-10 0a8 8 0 1 1 16 0a11 11 0 1 1-22 0" fill="none" stroke="#A78BFA" strokeWidth={2.6} strokeLinecap="round" /></svg>}
            {i === 3 && <svg width={100} height={100} viewBox="0 0 40 40"><path d="M20 4l3 10 10-3-6 9 6 9-10-3-3 10-3-10-10 3 6-9-6-9 10 3z" fill="#FF8AD8" /></svg>}
            {i === 4 && <div style={{ padding: "12px 20px", borderRadius: 999, background: "linear-gradient(90deg,#FFD84D,#FF8AD8)", fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>Looks good ✦</div>}
          </div>
        );
      })}
      {/* the strikes: a blue slash across each random shape, then across each decoration */}
      {shapes.map((s, i) => {
        const sl = k(g, `strike1+${0.04 * i}`, 0.2, MOVE) * (1 - out1);
        return sl > 0.01 && <div key={`s${i}`} style={{ position: "absolute", left: cx + s.dx - 85, top: cy + s.dy - 7, width: 170, height: 14, transform: "rotate(-35deg)" }}><div style={{ width: 170 * sl, height: 14, borderRadius: 14, background: C.blue }} /></div>;
      })}
      {decor.map((s, i) => {
        const sl = k(g, `sweep+${0.04 * i}`, 0.2, MOVE) * (1 - out2);
        return sl > 0.01 && <div key={`x${i}`} style={{ position: "absolute", left: cx + s.dx - 70, top: cy + s.dy - 6, width: 140, height: 12, transform: "rotate(-35deg)" }}><div style={{ width: 140 * sl, height: 12, borderRadius: 12, background: C.blue }} /></div>;
      })}
    </>
  );
};

// ---------------- P27–P33: the sign-off badge ----------------
const Badge: React.FC<{ g: number }> = ({ g }) => {
  const [ax, ay] = youRoof(g, 4);
  const l = life(g, "fin+0.55", "endcard", 0.55, 0.3), handover = sec(g) >= T.s("endcard") ? 0 : 1;
  return (
    <Float name="badge" ax={ax} ay={ay} lift={52} w={400} h={90} s={sec(g) >= T.s("endcard") ? 1 : l.s} o={l.o}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 999, background: C.card, boxShadow: "0 30px 64px -30px rgba(5,15,25,.40), 0 3px 10px rgba(5,15,25,.06), inset 0 0 0 1px #E2E3E6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: handover }}>
            <Mark w={86} id="badge" reveal={k(g, "fin+0.65", 0.6, EASE.steady)} />
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36, letterSpacing: "-0.05em", color: C.ink }}>WKConversions</div>
          </div>
        </div>
      </div>
    </Float>
  );
};

export const Cards: React.FC<{ g: number }> = ({ g }) => (
  <>
    {sec(g) < T.s("most") + 0.5 && <Tags g={g} />}
    <GreyCards g={g} />
    <MainCard g={g} />
    <Clutter g={g} />
    {sec(g) > T.s("fin") && <Badge g={g} />}
  </>
);
