// "What happens when the right minds meet?": Unicorn Founders Malaga, 41 s, 1080 × 1080, 60 fps.
// One cream stage; every phrase changes the foreground on its word. The client's own golden-hour photos travel in
// frames that change shape (two faces meet, a card shifts perspective, shapes become the Málaga arch, roles come
// together, stories swap, a conversation becomes a connection and a collaboration, the qualification page's valuation
// curve, three editorial lines, the night globe on Málaga, a simple hello, the seat).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, SANS, SERIF, clamp01, kf, lerp, MOVE, OUT, p, SOFT, w } from "./kit";
import { Caps, Frame, Globe, Layer, LetterMorph, proj, Words } from "./parts";

const WOMAN: Layer = { src: "brand-004.webp", fx: 30, fy: 38, z: 2.2 };
const MAN: Layer = { src: "brand-004.webp", fx: 73, fy: 31, z: 2.3 };
const drift = (t: number, a: number, s = 0.035) => 1 + s * clamp01((t - a) / 4);
const L = (src: string, fx: number, fy: number, z: number, o = 1, dx = 0): Layer => ({ src, fx, fy, z, o, dx });

export const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const out: React.ReactNode[] = [];

  // ---------------------------------------------------------------- 1 · the right minds meet (0 – 4.3)
  const T3 = w("perspectives"), TS = w("shift");
  {
    const ax = kf(t, [[w("right", -0.06), -190], [w("right", 0.62), 392], [w("spark"), 400], [w("spark", 0.12), 384], [w("spark", 0.5), 392]], OUT);
    const bx = kf(t, [[w("minds", -0.06), 1270], [w("minds", 0.62), 688], [w("spark"), 680], [w("spark", 0.12), 696], [w("spark", 0.5), 688]], OUT);
    if (t < T3 + 0.5) {
      // B is absorbed into the card that A becomes
      const bk = p(t, T3, 0.45, MOVE);
      out.push(<Frame key="B" b={{ x: lerp(bx, 540, bk), y: lerp(680, 640, bk), w: lerp(300, 220, bk), h: lerp(300, 220, bk), r: 150, o: 1 - bk }} layers={[{ ...MAN, z: MAN.z! * drift(t, 1.3) }]} />);
    }
    if (t < T3) out.push(<Frame key="A" b={{ x: ax, y: 680, w: 300, h: 300, r: 150 }} layers={[{ ...WOMAN, z: WOMAN.z! * drift(t, 1.1) }]} />);
    // the spark where they touch
    const sk = clamp01((t - w("spark")) / 0.6);
    if (sk > 0 && sk < 1) {
      out.push(
        <svg key="spark" width={1080} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + 0.26, r0 = 30 + 140 * OUT(sk), r1 = r0 + 70 * (1 - sk) + 10;
            return <line key={i} x1={540 + Math.cos(a) * r0} y1={680 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={680 + Math.sin(a) * r1} stroke={C.bronze} strokeWidth={4} strokeLinecap="round" opacity={1 - sk} />;
          })}
          <circle cx={540} cy={680} r={14 + 30 * sk} fill={C.glow} opacity={0.9 * (1 - sk)} />
        </svg>,
      );
    }
    out.push(<Words key="h1" t={t} x={540} y={150} size={76} out={w("ideas", -0.45)} items={[
      { s: "What", at: w("what") }, { s: "happens", at: w("happens") }, { s: "when", at: w("when") }, { s: "", at: w("when"), br: true },
      { s: "the", at: w("the") }, { s: "right", at: w("right") }, { s: "minds", at: w("minds") }, { s: "meet?", at: w("meet"), it: true },
    ]} />);
    out.push(<Words key="h2" t={t} x={540} y={200} size={118} out={T3 - 0.3} items={[{ s: "Ideas", at: w("ideas") }, { s: "spark.", at: w("spark"), it: true }]} />);
  }

  // ---------------------------------------------------------------- 2 · perspectives shift, possibilities take shape (4.3 – 8.3)
  const T4 = w("new"), T4b = w("possibilities"), TT = w("take"), TSh = w("shape");
  {
    const g = (a: number, b: number, c: number, d: number) => kf(t, [[T3, a], [T3 + 0.55, b], [T4, b], [T4 + 0.45, c], [TSh, c], [TSh + 0.55, d]]);
    // the two shapes that open out of the circle on "possibilities" and fold back on "shape"
    if (t > T4b && t < TSh + 0.6) {
      const op = p(t, T4b, 0.55, OUT), back = p(t, TSh, 0.5, MOVE);
      const tk1 = p(t, TT, 0.5, MOVE), tk3 = p(t, TT + 0.1, 0.5, MOVE);
      const side = (dir: number, tk: number, kind: 0 | 1) => {
        const x = lerp(540, 540 + dir * 310, op), h = kind === 0 ? lerp(270, 270, tk) : lerp(270, 340, tk);
        const r = kind === 0 ? lerp(135, 20, tk) : 135;
        return { x: lerp(x, 540, back), y: 660, w: lerp(270, 260, tk), h, r, o: Math.min(1, op * 1.5) * (1 - back) };
      };
      out.push(<Frame key="s1" b={side(-1, tk1, 0)} layers={[L("brand-006.webp", 50, 30, 1.1 * drift(t, T4b))]} />);
      out.push(<Frame key="s3" b={side(1, tk3, 1)} layers={[L("brand-002.webp", 40, 50, 1.15 * drift(t, T4b))]} />);
    }
    if (t >= T3 && t < w("come", 0.75)) {
      // the card: born from A, tilts on "shift", becomes the centre circle, then the Málaga arch
      const shift = kf(t, [[TS, 0], [TS + 0.38, -15], [TS + 0.85, 0]], SOFT);
      const take = p(t, TT + 0.08, 0.5, MOVE);
      const archR = lerp(150, 135, take);
      let b = { x: g(392, 540, 540, 540), y: g(680, 650, 660, 640), w: g(300, 760, 270, 400), h: g(300, 500, 270, 560), r: [150, 150, 150, 150] as [number, number, number, number], rotY: shift };
      const card = p(t, T3, 0.55, MOVE), circ = p(t, T4, 0.45, MOVE);
      const rc = lerp(lerp(150, 24, card), 135, circ);
      const rb = lerp(rc, 18, take);
      b.r = [lerp(rc, archR, take), lerp(rc, archR, take), rb, rb];
      if (t > TSh) { const k = p(t, TSh, 0.55, MOVE); b.r = [lerp(b.r[0], 200, k), lerp(b.r[1], 200, k), 18, 18]; b.h = lerp(b.h, 560, k); }
      // after "Welcome" the arch steps aside for the logo
      const wk = p(t, w("welcome"), 0.65, MOVE);
      b = { ...b, x: lerp(b.x, 300, wk), y: lerp(b.y, 560, wk), w: lerp(b.w, 380, wk), h: lerp(b.h, 580, wk) };
      // and on "where" it becomes the founders frame
      const fk = p(t, w("where"), 0.6, MOVE);
      b = { ...b, x: lerp(b.x, 220, fk), y: lerp(b.y, 500, fk), w: lerp(b.w, 270, fk), h: lerp(b.h, 420, fk), r: [lerp(b.r[0], 135, fk), lerp(b.r[1], 135, fk), lerp(b.r[2], 16, fk), lerp(b.r[3], 16, fk)] };
      const gth = p(t, w("come"), 0.7, MOVE), gne = p(t, w("come", 0.25), 0.45, SOFT);
      b = { ...b, x: lerp(b.x, 540, gth) };
      const sh = clamp01((t - TS - 0.12) / 0.6);
      const toArch = p(t, TSh, 0.5, SOFT), toF = p(t, w("where"), 0.5, SOFT);
      out.push(<Frame key="card" b={{ ...b, o: 1 - gne }} layers={[
        { ...WOMAN, o: 1 - p(t, T3, 0.4, SOFT) },
        L("brand-005.webp", 48, 46, 1.05 * drift(t, T3), (p(t, T3, 0.4, SOFT)) * (1 - SOFT(sh)), -0.28 * SOFT(sh)),
        L("brand-001.webp", 46, 58, 1.08 * drift(t, TS), SOFT(sh) * (1 - toArch), 0.28 * (1 - SOFT(sh))),
        L("brand-003.webp", 52, 62, 1.0 * drift(t, TSh, 0.05), toArch * (1 - toF)),
        L("brand-005.webp", 50, 38, 1.7 * drift(t, w("where")), toF),
      ]} />);
    }
    out.push(<Words key="h3" t={t} x={540} y={150} size={104} out={T4 - 0.3} items={[{ s: "Perspectives", at: w("perspectives") }, { s: "shift.", at: TS, it: true }]} />);
    out.push(<Words key="h4" t={t} x={540} y={90} size={92} out={w("welcome", -0.35)} items={[{ s: "New", at: T4 }, { s: "possibilities", at: T4b }, { s: "", at: T4b, br: true }, { s: "take", at: TT, it: true }, { s: "shape.", at: TSh, it: true }]} />);
  }

  // ---------------------------------------------------------------- 3 · welcome to Unicorn Founders Malaga (8.3 – 10.6)
  {
    const o = 1 - p(t, w("where", -0.3), 0.4, SOFT);
    if (t > w("welcome") && o > 0) {
      const mk = p(t, w("welcome", 0.15), 0.7);
      out.push(<Img key="mark" src={staticFile("img/mark-ink.png")} style={{ position: "absolute", left: 780 - 81, top: 250 + (1 - mk) * 30, width: 162, opacity: mk * o, filter: mk < 1 ? `blur(${(1 - mk) * 8}px)` : undefined }} />);
      const bands: [number, number, number][] = [[0, 0.355, w("unicorn")], [0.355, 0.68, w("founders")], [0.68, 1, w("malaga")]];
      bands.forEach(([a, b, at], i) => {
        const k = p(t, at, 0.6);
        out.push(<Img key={"wm" + i} src={staticFile("img/word-ink.png")} style={{ position: "absolute", left: 780 - 170, top: 480 + (1 - k) * 26 - 0, width: 340, opacity: k * o, clipPath: `inset(${a * 100}% 0 ${(1 - b) * 100}% 0)`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined }} />);
      });
      out.push(<Caps key="intl" t={t} at={w("to")} out={w("where", -0.3)} text="AN INTERNATIONAL COMMUNITY IN MÁLAGA" x={540} y={930} />);
    }
  }

  // ---------------------------------------------------------------- 4 · founders, builders and investors come together (10.6 – 14.2)
  const TC = w("come"), T7 = w("swap"), TST = w("stories");
  {
    const gather = p(t, TC, 0.7, MOVE), gone = p(t, TC + 0.25, 0.45, SOFT);
    const frameAt = (x0: number, at: number, layer: Layer, key: string) => {
      const k = p(t, at, 0.6);
      if (k <= 0 || gone >= 1) return;
      out.push(<Frame key={key} b={{ x: lerp(x0, 540, gather), y: 500 + (1 - k) * 90, w: 270, h: 420, r: [135, 135, 16, 16], o: k * (1 - gone) }} layers={[{ ...layer, z: layer.z! * drift(t, at) }]} />);
    };
    frameAt(540, w("builders"), L("brand-004.webp", 73, 30, 1.9), "fb");
    frameAt(860, w("investors"), L("brand-001.webp", 56, 56, 2.0), "fi");
    const lab = (s: string, x: number, at: number) => {
      const k = p(t, at, 0.55), o = p(t, TC, 0.35, SOFT);
      if (k <= 0 || o >= 1) return null;
      return <div key={s} style={{ position: "absolute", left: x - 160, width: 320, top: 742 + (1 - k) * 20, textAlign: "center", fontFamily: SERIF, fontSize: 50, color: C.ink, opacity: k * (1 - o), filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined }}>{s}</div>;
    };
    out.push(lab("Founders.", 220, w("founders2")), lab("Builders.", 540, w("builders")), lab("Investors.", 860, w("investors")));
    // the group they become, until it splits into two stories
    if (t > TC && t < T7 + 0.4) {
      const k = p(t, TC, 0.75, MOVE), sp = p(t, T7, 0.3, SOFT);
      out.push(<Frame key="group" b={{ x: 540, y: 500, w: lerp(270, 900, k), h: lerp(420, 560, k), r: [lerp(135, 24, k), lerp(135, 24, k), lerp(16, 24, k), lerp(16, 24, k)], o: Math.min(1, k * 2) * (1 - sp) }} layers={[L("brand-001.webp", 50, 62, 1.0 * drift(t, TC))]} />);
      out.push(<Caps key="together" t={t} at={w("together")} out={T7 - 0.1} text="FOUNDERS · BUILDERS · INVESTORS" x={540} y={830} />);
    }
  }

  // ---------------------------------------------------------------- 5 · swap stories, explore challenges (14.2 – 16.7)
  const T9 = w("connect");
  {
    const sw = p(t, TST, 0.75, MOVE), sp = p(t, T7, 0.4, MOVE);
    const up = p(t, T9, 0.6, MOVE);
    const ROW_Y = 240;
    const card = (side: number, layer: Layer, key: string, rowX: number) => {
      if (t < T7 || t > w("one", 0.2)) return;
      const x0 = lerp(540 + side * 225, 540 + side * 240, sp), x1 = 540 - side * 240;
      let x = lerp(x0, x1, sw), y = 500 + side * (sw > 0 && sw < 1 ? 70 * Math.sin(Math.PI * sw) : 0);
      let wd = lerp(450, 400, sp), h = 560, r = 24;
      x = lerp(x, rowX, up); y = lerp(y, ROW_Y, up); wd = lerp(wd, 150, up); h = lerp(h, 150, up); r = lerp(r, 75, up);
      const gather = p(t, w("action", 0.55), 0.6, MOVE);
      x = lerp(x, 540 + side * 0, gather);
      out.push(<Frame key={key} z={side < 0 ? 2 : 1} b={{ x, y: lerp(y, 520, gather), w: wd, h, r, rot: side * 5 * Math.sin(Math.PI * sw), o: Math.min(1, sp * 3) * (1 - p(t, w("one", -0.05), 0.25, SOFT)) }} layers={[{ ...layer, z: lerp(layer.z!, layer.z! * 1.25, up) * drift(t, T7) }]} />);
    };
    card(-1, L("brand-004.webp", 30, 38, 1.35), "storyL", 720);
    card(1, L("brand-005.webp", 50, 40, 1.45), "storyR", 360);
    // dim the stories while the challenges are on
    const chips = ["Growing a business", "Navigating a challenge", "A new idea"];
    const co = p(t, T9 - 0.2, 0.35, SOFT);
    chips.forEach((s, i) => {
      const k = p(t, w("explore", i * 0.09), 0.5), hi = i === 1 ? p(t, w("challenges"), 0.35, SOFT) : 0;
      if (k <= 0 || co >= 1) return;
      out.push(<div key={s} style={{ position: "absolute", left: 540 - 260, width: 520, top: 360 + i * 98 + (1 - k) * 40, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 29, background: hi > 0.5 ? C.ink : C.cream, color: hi > 0.5 ? C.cream : C.ink, border: `2px solid ${hi > 0.5 ? C.ink : C.line}`, boxShadow: "0 18px 40px -20px rgba(41,41,41,0.45)", opacity: k * (1 - co) * (i === 1 ? 1 : 1 - 0.35 * hi), transform: `translateY(${-co * 30}px) scale(${1 + 0.04 * Math.sin(Math.PI * hi)})`, zIndex: 3 }}>{s}</div>);
    });
    out.push(<Words key="h5" t={t} x={540} y={850} size={64} out={w("explore", -0.25)} items={[{ s: "Swap", at: T7 }, { s: "stories,", at: TST, it: true }]} />);
    out.push(<Words key="h6" t={t} x={540} y={850} size={64} out={T9 - 0.2} items={[{ s: "explore", at: w("explore") }, { s: "challenges,", at: w("challenges"), it: true }]} />);
    // people: three more join the row on "people"
    [[180, "brand-001.webp", 33, 52, 2.0], [540, "brand-005.webp", 77, 48, 2.1], [900, "brand-001.webp", 56, 56, 2.2]].forEach(([x, src, fx, fy, z], i) => {
      const k = p(t, w("people", i * 0.08), 0.55), o = p(t, w("action", 0.45), 0.4, SOFT);
      if (k <= 0 || o >= 1) return;
      out.push(<Frame key={"pp" + i} b={{ x: x as number, y: 240 + (1 - k) * 40, w: 150, h: 150, r: 75, o: k * (1 - o) }} layers={[L(src as string, fx as number, fy as number, (z as number) * drift(t, w("people")))]} />);
    });
    out.push(<LetterMorph key="amb" t={t} from="ambition" to="action" map={[0, -1, -1, -1, 2, 3, 4, 5]} inAt={w("ambition")} at={w("into", -0.04)} dur={0.6} x={540} y={520} size={170} out={w("action", 0.62)} />);
  }

  // ---------------------------------------------------------------- 6 · one conversation → a connection → a collaboration (19.5 – 25.3)
  const T10 = w("one"), TB = w("becomes"), TCN = w("connection"), TB2 = w("becomes2"), TCL = w("collaboration"), T12 = w("and3");
  {
    // the conversation: a wide pill that the two story faces flow into
    if (t > w("action", 0.55) && t < TB + 0.6) {
      const k = p(t, w("action", 0.55), 0.75, MOVE), sp = p(t, TB, 0.5, SOFT);
      out.push(<Frame key="pill" b={{ x: 540, y: 520, w: lerp(150, 780, k), h: lerp(150, 380, k), r: 190, o: Math.min(1, k * 3) * (1 - sp) }} layers={[L("brand-005.webp", 34, 46, 1.12 * drift(t, T10))]} />);
    }
    // the two people it holds, apart on "becomes", together on "connection"
    if (t > TB && t < TB2 + 0.7) {
      const k = p(t, TB, 0.55, MOVE), snap = p(t, TCN, 0.45, OUT), merge = p(t, TB2, 0.6, MOVE);
      const q = (side: number, layer: Layer, key: string) => {
        const x = lerp(540 + side * 200, 540 + side * 190, k), xs = lerp(x, 540 + side * 160, snap);
        const d = lerp(380, 320, k);
        out.push(<Frame key={key} b={{ x: lerp(xs, 540, merge), y: 520, w: lerp(d, 380, merge), h: lerp(d, 380, merge), r: 190, o: Math.min(1, k * 4) * (1 - p(t, TB2 + 0.2, 0.35, SOFT)) }} layers={[{ ...layer, z: layer.z! * drift(t, TB) }]} />);
      };
      q(-1, L("brand-005.webp", 19, 52, 2.0), "qa");
      q(1, L("brand-005.webp", 50, 38, 2.0), "qb");
      // the ring that closes around them on "connection"
      const rk = p(t, TCN, 0.6, MOVE), ro = 1 - p(t, TB2, 0.35, SOFT);
      if (rk > 0 && ro > 0) {
        out.push(<svg key="ring" width={1080} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={540 - 360} y={520 - 186} width={720} height={372} rx={186} fill="none" stroke={C.bronze} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - rk} opacity={ro} />
        </svg>);
      }
    }
    // the collaboration card grows out of the ring
    if (t > TB2 && t < T12 + 0.7) {
      const k = p(t, TB2, 0.7, MOVE), dn = p(t, T12, 0.6, MOVE);
      const x = lerp(540, 230, dn), y = lerp(520, 830, dn), wd = lerp(lerp(720, 840, k), 34, dn), h = lerp(lerp(372, 580, k), 34, dn);
      out.push(<Frame key="collab" fill={C.bronze} b={{ x, y, w: wd, h, r: lerp(lerp(186, 24, k), 17, dn), o: Math.min(1, k * 2.5) }} layers={[L("brand-002.webp", 38, 52, 1.05 * drift(t, TB2), 1 - p(t, T12 + 0.25, 0.3, SOFT))]} />);
    }
    out.push(<Caps key="c1" t={t} at={w("conversation")} out={TCN - 0.15} text="ONE CONVERSATION" x={540} y={770} size={22} />);
    out.push(<Caps key="c2" t={t} at={TCN} out={TB2 + 0.1} text="A CONNECTION" x={540} y={770} size={22} />);
    out.push(<Caps key="c3" t={t} at={TCL} out={T12} text="A COLLABORATION" x={540} y={860} size={22} />);
  }

  // ---------------------------------------------------------------- 7 · your next chapter starts moving: the valuation curve (25.3 – 28.5)
  const T13 = w("different");
  {
    const o = 1 - p(t, T13 - 0.3, 0.35, SOFT);
    if (t > T12 + 0.3 && o > 0) {
      const NODES: [number, number][] = [[230, 830], [440, 730], [640, 590], [830, 400]];
      const END: [number, number] = [930, 250];
      const pts = [...NODES, END];
      const times = [w("your"), w("next"), w("chapter"), w("starts"), w("moving")];
      // progress along the polyline: segment i runs from times[i] to times[i+1]
      let seg = -1, u = 0;
      for (let i = 0; i < pts.length - 1; i++) if (t >= times[i]) { seg = i; u = clamp01((t - times[i]) / (times[i + 1] - times[i])); }
      const path: string[] = [];
      if (seg >= 0) {
        path.push(`M ${pts[0][0]} ${pts[0][1]}`);
        for (let i = 0; i <= seg; i++) {
          const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], k = i < seg ? 1 : SOFT(u);
          path.push(`L ${lerp(x0, x1, k)} ${lerp(y0, y1, k)}`);
        }
      }
      const total = seg < 0 ? 0 : (seg + SOFT(u)) / (pts.length - 1);
      out.push(<svg key="chart" width={1080} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
        <line x1={150} y1={900} x2={980} y2={900} stroke={C.line} strokeWidth={2} opacity={p(t, T12 + 0.3, 0.5)} />
        <path d={path.join(" ")} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>);
      NODES.forEach(([x, y], i) => {
        const k = p(t, times[i], 0.4);
        if (k <= 0) return;
        out.push(<div key={"n" + i} style={{ position: "absolute", left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: 24, background: i === 0 ? C.bronze : C.cream, border: `3px solid ${i === 0 ? C.bronze : C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 21, color: i === 0 ? C.cream : C.ink, opacity: o * k, transform: `scale(${lerp(0.6, 1, k)})` }}>{i + 1}</div>);
      });
      const ek = p(t, w("moving"), 0.45);
      if (ek > 0) out.push(<div key="b1" style={{ position: "absolute", left: END[0] - 70, top: END[1] - 30, width: 140, height: 60, borderRadius: 30, background: C.ink, color: C.cream, fontFamily: SERIF, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", opacity: o * ek, transform: `scale(${lerp(0.7, 1, ek)})` }}>$1B</div>);
      const val = Math.round(1000 * total);
      const lk = p(t, T12 + 0.25, 0.5);
      out.push(<div key="val" style={{ position: "absolute", left: 110, top: 120 + (1 - lk) * 20, opacity: o * lk }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.2em", color: C.muted }}>VALUATION</div>
        <div style={{ fontFamily: SERIF, fontSize: 116, lineHeight: 1.05, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{val >= 1000 ? "$1B" : `$${val}M`.replace("$0M", "$0")}</div>
      </div>);
      out.push(<Caps key="four" t={t} at={w("next")} out={T13 - 0.3} text="FOUR MEETINGS IN MÁLAGA" x={110} y={300} align="left" />);
    }
  }

  // ---------------------------------------------------------------- 8 · different industries, fresh perspectives, shared ambition (28.5 – 32.6)
  const TA = w("all"), TM = w("mlaga");
  {
    const rows: [number, string, string, number, number, Layer][] = [
      [330, "Different", "industries.", T13, w("industries"), L("brand-004.webp", 50, 40, 1.4)],
      [500, "Fresh", "perspectives.", w("fresh"), w("perspectives2"), L("brand-005.webp", 50, 45, 1.3)],
      [670, "Shared", "ambition.", w("shared"), w("ambition2"), L("brand-001.webp", 50, 60, 1.4)],
    ];
    const leave = p(t, TA - 0.3, 0.45, MOVE);
    rows.forEach(([y, a, b, ta, tb, layer], i) => {
      const k = p(t, ta, 0.6);
      if (k <= 0) return;
      const pw = lerp(0, 150, k);
      const textO = 1 - leave;
      if (textO > 0) {
        out.push(<Words key={"r" + i} t={t} x={110 + pw + 26} y={y + 6} size={66} align="left" width={900} out={TA - 0.3} items={[{ s: a, at: ta }, { s: b, at: tb, it: true }]} />);
      }
      // the pill: rows 1 and 2 leave, row 3's pill becomes the globe
      if (i < 2) {
        if (leave < 1) out.push(<Frame key={"rp" + i} shadow={0.5} b={{ x: 110 + pw / 2 - leave * 200, y: y + 48, w: pw, h: 96, r: 48, o: 1 - leave }} layers={[{ ...layer, z: layer.z! * drift(t, ta) }]} />);
      } else {
        const g = p(t, TA - 0.25, 0.75, MOVE);
        if (t < TM + 1.2) out.push(<Frame key="rp2" fill={C.night} b={{ x: lerp(110 + pw / 2, 540, g), y: lerp(y + 48, 540, g), w: lerp(pw, 720, g), h: lerp(96, 720, g), r: 360 }} shadow={0.6} layers={[{ ...layer, z: layer.z! * drift(t, ta), o: 1 - p(t, TA + 0.4, 0.4, SOFT) }]} />);
      }
    });
    // row texts slide out (handled by opacity above); a soft wipe left
  }

  // ---------------------------------------------------------------- 9 · all brought together in Málaga: the night globe (32.6 – 34.8)
  const T15 = w("your2");
  {
    const gk = p(t, TA + 0.42, 0.4, SOFT), zoom = p(t, T15, 0.75, MOVE), go = 1 - p(t, T15 + 0.3, 0.4, SOFT);
    if (gk > 0 && go > 0) {
      const R = lerp(360, 1500, zoom);
      const v0 = { lon: kf(t, [[TA - 0.2, 38], [TM + 0.1, -4.42]]), lat: kf(t, [[TA - 0.2, 8], [TM + 0.1, 30]]), R: 360, cx: 540, cy: 540 };
      const pin0 = proj(v0, -4.42, 36.72);
      // zoom about Málaga: scale the sphere, keep the pin where it is
      const v = { ...v0, R, cx: pin0.x + (540 - pin0.x) * (R / 360), cy: pin0.y + (540 - pin0.y) * (R / 360) };
      out.push(<div key="globe" style={{ position: "absolute", inset: 0 }}><Globe v={v} o={gk * go} twinkle={t * 3} /></div>);
      const pk = p(t, TM, 0.5);
      if (pk > 0) {
        const pin = proj(v, -4.42, 36.72), pulse = ((t - TM) % 1.1) / 1.1;
        out.push(<div key="pin" style={{ position: "absolute", left: pin.x - 11, top: pin.y - 11, width: 22, height: 22, borderRadius: 11, background: "#FFF3E2", boxShadow: "0 0 24px 8px rgba(255,214,170,0.75)", opacity: pk * go, transform: `scale(${lerp(0.3, 1, pk)})` }} />);
        out.push(<div key="pr" style={{ position: "absolute", left: pin.x - 11, top: pin.y - 11, width: 22, height: 22, borderRadius: 11, border: "2px solid rgba(255,230,196,0.9)", opacity: pk * go * (1 - pulse), transform: `scale(${1 + 3 * pulse})` }} />);
        const lo = pk * (1 - p(t, T15, 0.3, SOFT));
        out.push(<div key="pl" style={{ position: "absolute", left: pin.x + 30, top: pin.y - 70 + (1 - pk) * 14, opacity: lo }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: C.cream, lineHeight: 1 }}>Málaga</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.2em", color: C.glow, marginTop: 10 }}>36.72° N, 4.42° W</div>
        </div>);
      }
      out.push(<Caps key="tog" t={t} at={w("together2")} out={T15} text="ALL BROUGHT TOGETHER" x={540} y={960} color={C.muted} />);
    }
  }

  // ---------------------------------------------------------------- 10 · a simple hello, then the seat (34.8 – 41)
  const TAP = w("apply"), TSE = w("seat");
  {
    if (t > T15) {
      const k = p(t, T15 + 0.05, 0.7, MOVE), btn = p(t, TAP - 0.25, 0.6, MOVE);
      const x = 540, y = lerp(lerp(470, 470, k), 760, btn);
      const wd = lerp(lerp(24, 860, k), 460, btn), h = lerp(lerp(24, 600, k), 104, btn);
      const press = TSE <= t && t < TSE + 0.32 ? Math.sin(Math.PI * (t - TSE) / 0.32) : 0;
      const zIn = kf(t, [[w("start"), 1.05], [TAP, 1.2]], SOFT);
      out.push(<Frame key="hello" fill={C.ink} shadow={lerp(1, 0.5, btn)} b={{ x, y, w: wd * (1 - 0.04 * press), h: h * (1 - 0.04 * press), r: lerp(lerp(12, 24, k), 4, btn) }} layers={[L("brand-004.webp", 34, 38, zIn, 1 - p(t, TAP - 0.15, 0.35, SOFT))]}>
        {btn > 0.5 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: SANS, fontWeight: 700, fontSize: 31, color: C.cream, opacity: p(t, TAP + 0.15, 0.4) }}>
            Apply for a seat
            <span style={{ display: "inline-block", fontSize: 30, transform: `translate(${2 * Math.sin(t * 3)}px, ${-2 * Math.sin(t * 3)}px)` }}>↗</span>
          </div>
        )}
      </Frame>);
      out.push(<Words key="hi" t={t} x={540} y={810} size={70} out={TAP - 0.3} items={[{ s: "a", at: w("a4") }, { s: "simple", at: w("simple") }, { s: "hello.", at: w("hello"), it: true }]} />);
      // the lockup above the seat
      const lk = p(t, TAP, 0.75), breathe = 1 + 0.025 * SOFT(clamp01((t - TAP) / 2.9));
      if (lk > 0) out.push(<Img key="logo" src={staticFile("img/logo-ink.png")} style={{ position: "absolute", left: 540 - 290, top: 300 + (1 - lk) * 30, width: 580, opacity: lk, transform: `scale(${breathe})`, filter: lk < 1 ? `blur(${(1 - lk) * 8}px)` : undefined }} />);
      out.push(<Caps key="foot" t={t} at={TSE + 0.3} text="INTERNATIONAL OUTLOOK · LOCAL ROOTS" x={540} y={900} />);
    }
  }

  return <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>{out}</AbsoluteFill>;
};
