// The real world as a shadow theatre (Lotte Reiniger's fairytale silhouettes): Night-violet cut-outs against lamp-gold
// light. The child's silhouette is cut from Tale Forge's own hero portrait of Iris (public/img/sil-child.png), so the
// book can later paint it into the hero. Two scenes: the home at night (P01–P02) and the lamp-lit room (P03–P09, P27–P29).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { C, F, MOVE, SETTLE, SOFT, clamp01, float, lerp, rand, tw } from "./lib";
import { T } from "./clock";
import { Burst, Glow, Say, Sparkle, Stars, img } from "./parts";

const k = (g: number, at: string, s: number, e = SETTLE) => T.k(g, at, s, e);

// ---------------------------------------------------------------- the child and the adult
export const Child: React.FC<{ x: number; feet: number; h: number; rot?: number; opacity?: number; color?: string; name?: string }> = ({ x, feet, h, rot = 0, opacity = 1, color, name = "Child" }) => {
  const w = h * (512 / 768) * (768 / 700); // the PNG is 512×768 with the figure 700 px tall (y 34–734)
  const H = h * (768 / 700);
  return (
    <div data-name={name} style={{ position: "absolute", left: x - w / 2, top: feet - H * (734 / 768), width: w, height: H, opacity, transform: `rotate(${rot}deg)`, transformOrigin: "50% 95.5%" }}>
      <Img src={img("sil-child.png")} style={{ width: "100%", height: "100%", filter: color ? undefined : "drop-shadow(0 0 1px rgba(23,18,50,0.6))" }} />
    </div>
  );
};

/** The adult: a seated bust in the same cut-paper language, origin at the bottom centre, ~404 units tall. */
export const Adult: React.FC<{ x: number; base: number; s: number; rot?: number; opacity?: number }> = ({ x, base, s, rot = 0, opacity = 1 }) => (
  <svg data-name="Adult" width={520 * s} height={460 * s} viewBox="-260 -440 520 460" style={{ position: "absolute", left: x - 260 * s, top: base - 440 * s, opacity, transform: `rotate(${rot}deg)`, transformOrigin: "50% 95%", overflow: "visible" }}>
    <g fill={C.silhouette}>
      <path d="M -206 20 L -200 -112 C -194 -188 -132 -236 -50 -246 L 50 -246 C 132 -236 194 -188 200 -112 L 206 20 Z" />
      <rect x={-25} y={-282} width={50} height={60} rx={12} />
      <ellipse cx={0} cy={-334} rx={58} ry={70} />
      <path d="M -63 -322 C -70 -392 -32 -416 6 -414 C 48 -412 74 -384 66 -318 C 60 -350 38 -374 0 -374 C -34 -374 -56 -352 -63 -322 Z" />
      <circle cx={46} cy={-396} r={28} />
      <path d="M -58 -300 C -64 -270 -70 -250 -86 -238 C -60 -236 -48 -256 -44 -280 Z" />
    </g>
  </svg>
);

// ---------------------------------------------------------------- the home at night
export const NightHome: React.FC<{ g: number }> = ({ g }) => {
  const lit = k(g, "window", 0.6, SOFT);
  const doorK = k(g, "door", 0.7);
  // the walk: along the path from the foreground to the door, smaller with distance
  const wk = tw(g, T.f("walk") - 12, T.f("inside") - 4, MOVE);
  const px = lerp(250, 1300, wk), feet = lerp(812, 812, wk) + 0, h = lerp(250, 205, wk);
  const bob = Math.abs(Math.sin(g / 30 * Math.PI * 2.1)) * 6 * (wk > 0 && wk < 1 ? 1 : 0);
  const inDoor = tw(g, T.f("inside") - 10, T.f("inside") + 2, SOFT);
  const push = 1 + 0.035 * k(g, "open", 4.2, SOFT);
  return (
    <AbsoluteFill data-name="NightHome" style={{ transform: `scale(${push})`, transformOrigin: "1300px 760px" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0C0A1F 0%, #171232 34%, #34277A 60%, #6D4FE0 78%, #B08AE8 86%, #6D4FE0 100%)" }} />
      <Stars g={g} n={90} h={640} seed={2} />
      {/* crescent moon */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs><mask id="moon"><rect width={1920} height={1080} fill="#fff" /><circle cx={1590} cy={176} r={58} fill="#000" /></mask></defs>
        <circle cx={1562} cy={196} r={62} fill={C.warm} mask="url(#moon)" style={{ filter: "drop-shadow(0 0 24px rgba(255,240,200,0.55))" }} />
      </svg>
      <Glow x={1300} y={680} r={520} color="rgba(245,197,66,0.20)" opacity={lit} />
      {(() => { const st = tw(g, 6, 34, SOFT); if (st <= 0 || st >= 1) return null; const sx = lerp(420, 1080, st), sy = lerp(90, 300, st);
        return <div data-name="ShootingStar" style={{ position: "absolute", left: sx - 180, top: sy - 2, width: 180, height: 3, borderRadius: 2, transform: `rotate(17.6deg)`, transformOrigin: "100% 50%", background: "linear-gradient(90deg, rgba(255,240,200,0), rgba(255,240,200,0.95))", opacity: Math.sin(Math.PI * st), boxShadow: "0 0 10px rgba(255,240,200,0.8)" }} />; })()}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d="M0 720 C 300 650 560 690 820 690 C 1100 690 1300 640 1600 668 C 1760 680 1860 700 1920 704 L1920 1080 L0 1080Z" fill="#4A3A9C" opacity={0.75} />
        {[[180, 700, 70], [250, 690, 90], [330, 700, 60], [1650, 655, 80], [1740, 668, 64], [1830, 690, 90]].map(([x, y, s], i) => (
          <path key={i} d={`M ${x} ${y - s * 1.6} L ${x + s * 0.32} ${y - s * 0.95} L ${x + s * 0.2} ${y - s * 0.95} L ${x + s * 0.45} ${y - s * 0.4} L ${x + s * 0.28} ${y - s * 0.4} L ${x + s * 0.55} ${y} L ${x - s * 0.55} ${y} L ${x - s * 0.28} ${y - s * 0.4} L ${x - s * 0.45} ${y - s * 0.4} L ${x - s * 0.2} ${y - s * 0.95} L ${x - s * 0.32} ${y - s * 0.95} Z`} fill="#3D2F88" opacity={0.85} />
        ))}
        <path d="M0 820 C 260 806 520 812 760 808 C 1000 804 1200 806 1500 812 C 1700 816 1840 822 1920 826 L1920 1080 L0 1080Z" fill="#171232" />
        {/* the house */}
        <g fill="#120E2C">
          <rect x={1150} y={598} width={300} height={214} />
          <path d="M 1118 612 L 1300 468 L 1482 612 Z" />
          <rect x={1384} y={488} width={34} height={86} />
        </g>
        {[[1186, 648], [1346, 648]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width={68} height={68} rx={4} fill={lit > 0 ? `rgba(255,${200 + 30 * lit},${110 + 60 * lit},${0.25 + 0.75 * lit})` : "#1E1846"} />
            <path d={`M ${x + 34} ${y} V ${y + 68} M ${x} ${y + 34} H ${x + 68}`} stroke="#120E2C" strokeWidth={6} />
          </g>
        ))}
        {/* the door: dark, then opening onto warm light */}
        <rect x={1272} y={704} width={58} height={108} rx={4} fill="#0A0820" />
        <rect x={1272} y={704} width={58} height={108} rx={4} fill="url(#doorlight)" opacity={doorK} />
        <defs><linearGradient id="doorlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF7E9" /><stop offset="1" stopColor="#F5C542" /></linearGradient></defs>
        <path d="M 1272 812 L 1330 812 L 1440 900 L 1190 900 Z" fill="rgba(255,214,140,0.30)" opacity={doorK} style={{ mixBlendMode: "screen" }} />
        <path d="M0 950 C 300 900 700 930 1000 910 C 1300 890 1600 905 1920 930 L1920 1080 L0 1080Z" fill="#0F0B24" />
                {[[110, 980, 150], [250, 1000, 110], [1760, 1000, 160]].map(([x, y, s], i) => (
          <path key={i} d={`M ${x} ${y - s * 1.6} L ${x + s * 0.32} ${y - s * 0.95} L ${x + s * 0.2} ${y - s * 0.95} L ${x + s * 0.45} ${y - s * 0.4} L ${x + s * 0.28} ${y - s * 0.4} L ${x + s * 0.55} ${y} L ${x - s * 0.55} ${y} L ${x - s * 0.28} ${y - s * 0.4} L ${x - s * 0.45} ${y - s * 0.4} L ${x - s * 0.2} ${y - s * 0.95} L ${x - s * 0.32} ${y - s * 0.95} Z`} fill="#0B0820" />
        ))}
      </svg>
      <Glow x={1300} y={760} r={240} color="rgba(255,214,140,0.55)" opacity={doorK * 0.8} />
      <Child x={px} feet={feet - bob * (1 - wk * 0.6)} h={h} opacity={1 - inDoor} rot={Math.sin(g / 30 * Math.PI * 2.1) * 1.4 * (wk < 1 ? 1 : 0)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the lamp-lit room
const ROOM_BG = "radial-gradient(ellipse 72% 78% at 48% 50%, #FFF7E9 0%, #FDEBC8 30%, #F6C978 54%, #D98F3F 72%, #7A3F52 88%, #2A1A48 100%)";

const Window: React.FC<{ g: number }> = ({ g }) => (
  <svg width={1920} height={1080} style={{ position: "absolute" }} data-name="Window">
    <defs><linearGradient id="pane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C0A1F" /><stop offset="1" stopColor="#3A2C82" /></linearGradient></defs>
    <rect x={1480} y={170} width={330} height={400} fill="url(#pane)" />
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={1490 + rand(i * 3) * 310} cy={180 + rand(i * 7) * 300} r={1 + rand(i) * 1.6} fill="#F4EEFF" opacity={0.6 + float(g, 0.3, 4.6, rand(i) * 4)} />)}
    <path d="M 1480 170 H 1810 V 570 H 1480 Z M 1500 190 V 360 H 1635 V 190 Z M 1655 190 V 360 H 1790 V 190 Z M 1500 380 V 550 H 1635 V 380 Z M 1655 380 V 550 H 1790 V 380 Z" fill={C.silhouette} fillRule="evenodd" />
    <rect x={1456} y={566} width={378} height={22} rx={4} fill={C.silhouette} />
  </svg>
);

const Lamp: React.FC<{ on: number }> = ({ on }) => (
  <>
    <Glow x={185} y={480} r={420} color="rgba(255,236,190,0.75)" opacity={0.5 + on * 0.5} />
    <svg width={1920} height={1080} style={{ position: "absolute" }} data-name="Lamp">
      <g fill={C.silhouette}>
        <path d="M 110 400 L 260 400 L 300 500 L 70 500 Z" />
        <rect x={177} y={500} width={16} height={230} />
        <ellipse cx={185} cy={732} rx={56} ry={13} />
        <rect x={50} y={738} width={270} height={22} rx={6} />
        <rect x={72} y={760} width={18} height={250} />
        <rect x={280} y={760} width={18} height={250} />
      </g>
    </svg>
  </>
);

const Floor: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute" }} data-name="Floor">
    <rect x={0} y={1006} width={1920} height={74} fill={C.silhouette} />
    <path d="M 812 1080 L 812 928 C 812 904 832 890 858 890 L 1380 890 C 1406 890 1424 904 1424 928 L 1424 1080 Z" fill={C.silhouette} />
    <path d="M 1380 890 L 1380 760 C 1380 744 1392 736 1406 736 C 1420 736 1432 744 1432 760 L 1432 1080 L 1424 1080 Z" fill={C.silhouette} />
  </svg>
);

/** A paper thought cloud with the playground memory inside: three children in a ring with a ball, ours apart. */
export const Memory: React.FC<{ w: number; h: number; ink?: string }> = ({ w, h, ink = "#3A3060" }) => (
  <svg width={w} height={h} viewBox="0 0 440 250" style={{ overflow: "visible" }}>
    <path d="M 70 200 C 20 200 10 140 52 124 C 30 80 80 40 124 60 C 140 18 210 10 238 48 C 270 14 336 26 344 72 C 396 66 428 112 404 148 C 438 178 410 226 360 214 C 340 248 270 248 250 222 C 222 250 150 246 136 218 C 112 236 72 232 70 200 Z" fill="#FFF9EE" style={{ filter: "drop-shadow(0 8px 18px rgba(80,40,30,0.25))" }} />
    {/* the ring of children and the ball */}
    <g fill={ink}>
      {[[120, 150], [170, 120], [220, 150]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y - 34} r={12} />
          <path d={`M ${x - 14} ${y + 12} L ${x - 11} ${y - 16} C ${x - 9} ${y - 22} ${x + 9} ${y - 22} ${x + 11} ${y - 16} L ${x + 14} ${y + 12} Z`} />
          <rect x={x - 9} y={y + 10} width={6} height={20} rx={3} /><rect x={x + 3} y={y + 10} width={6} height={20} rx={3} />
        </g>
      ))}
      <path d="M 134 128 Q 145 122 157 116 M 184 116 Q 196 122 207 128" stroke={ink} strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={170} cy={176} r={11} fill={C.gold} />
    </g>
    {/* ours, apart */}
    <image href={img("sil-child.png")} x={300} y={86} width={62} height={93} opacity={0.82} />
  </svg>
);

const Bubble: React.FC<{ x: number; y: number; r: number; k: number; tail?: "left" | "right"; children?: React.ReactNode; name?: string }> = ({ x, y, r, k, tail = "left", children, name }) => (
  <div data-name={name} style={{ position: "absolute", left: x - r, top: y - r * 0.8, width: r * 2, height: r * 1.6, opacity: clamp01(k * 1.4), transform: `scale(${lerp(0.7, 1, SETTLE(clamp01(k)))})`, transformOrigin: tail === "left" ? "10% 100%" : "90% 100%" }}>
    <svg width={r * 2} height={r * 1.9} viewBox="0 0 200 190" style={{ position: "absolute", overflow: "visible", filter: "drop-shadow(0 6px 14px rgba(80,40,30,0.22))" }}>
      <path d={tail === "left" ? "M 100 4 C 160 4 196 40 196 82 C 196 124 160 158 100 158 C 86 158 74 156 62 152 L 22 180 L 34 140 C 14 126 4 106 4 82 C 4 40 40 4 100 4 Z" : "M 100 4 C 40 4 4 40 4 82 C 4 124 40 158 100 158 C 114 158 126 156 138 152 L 178 180 L 166 140 C 186 126 196 106 196 82 C 196 40 160 4 100 4 Z"} fill="#FFF9EE" />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: r * 0.12 }}>{children}</div>
  </div>
);

const Talk: React.FC<{ color: string }> = ({ color }) => (
  <svg width={110} height={60} viewBox="0 0 110 60">
    {[12, 30, 48].map((y, i) => <path key={i} d={`M 6 ${y} q 12 -8 24 0 t 24 0 t 24 0 ${i < 2 ? "t 24 0" : ""}`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />)}
  </svg>
);

/** The Tale Forge book, closed or open (cover = the sample book's own cover painting). open 0..1. */
export const Book: React.FC<{ x: number; y: number; w: number; open: number; glow?: number; right?: React.ReactNode; left?: React.ReactNode; title?: boolean; name?: string; rotZ?: number }> = ({ x, y, w, open, glow = 0, right, left, title = true, name = "Book", rotZ = 0 }) => {
  const h = w * 1.5;
  const ang = -180 * SOFT(clamp01(open));
  const spreadShift = (w / 2) * SOFT(clamp01(open)); // the book slides so the spread is centred when open
  return (
    <div data-name={name} style={{ position: "absolute", left: x - w / 2 + spreadShift, top: y - h / 2, width: w, height: h, perspective: w * 6, transform: `rotate(${rotZ}deg)` }}>
      {glow > 0 && <Glow x={0} y={h / 2} r={w * 2.2} color="rgba(255,226,150,0.85)" opacity={glow} />}
      {/* right page (always under the cover) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #E9D8B6 0%, #FFF7E9 6%, #FFF7E9 100%)", borderRadius: "2px 10px 10px 2px", boxShadow: "0 18px 44px rgba(5,8,20,0.42)", overflow: "hidden" }}>
        {right}
      </div>
      {/* the cover, hinged on the spine (left edge); its back is the left page */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 12px 12px 4px", overflow: "hidden", boxShadow: "0 18px 44px rgba(5,8,20,0.45)" }}>
          <Img src={img("cover.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(23,18,50,0.55) 0%, rgba(23,18,50,0) 30%)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: "6%", height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
          {title && <div style={{ position: "absolute", left: "8%", right: "8%", top: "5%", textAlign: "center", fontFamily: F.display, fontWeight: 700, fontSize: w * 0.105, lineHeight: 1.05, color: C.warm, textShadow: "0 2px 10px rgba(12,8,40,0.6)" }}>Iris and the Saved Place</div>}
        </div>
        <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", background: "linear-gradient(270deg, #E9D8B6 0%, #FFF7E9 6%, #FFF7E9 100%)", borderRadius: "10px 2px 2px 10px", overflow: "hidden" }}>
          {left}
        </div>
      </div>
    </div>
  );
};


/** Specks of lamp light drifting up through the room: quiet magic, never competing with the figures. */
const Motes: React.FC<{ g: number; n?: number; seed?: number }> = ({ g, n = 16, seed = 4 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const t = ((g / 30) * (0.035 + rand(i + seed) * 0.04) + rand(i * 3 + seed)) % 1;
      const x = 200 + rand(i * 7 + seed) * 1500 + Math.sin(g / 40 + i) * 14;
      return <div key={i} style={{ position: "absolute", left: x, top: 980 - t * 900, width: 6, height: 6, borderRadius: 3, background: "#FFE9B0", boxShadow: "0 0 10px 3px rgba(255,214,140,0.7)", opacity: Math.sin(Math.PI * t) * 0.75 }} />;
    })}
  </>
);

// ---------------------------------------------------------------- the room, first visit (P03–P09)
export const Room1: React.FC<{ g: number }> = ({ g }) => {
  const adultIn = k(g, "adult", 0.9);
  const lean = k(g, "closer", 1.2, SOFT);
  const cloudIn = k(g, "thought", 0.6);
  const cloudOut = k(g, "unsaid", 0.7, SOFT);
  const qOut = k(g, "qoff", 0.6, SOFT);
  const bookIn = k(g, "book", 0.5);
  const bookOpen = k(g, "bloom", 0.9, SOFT);
  const bloom = k(g, "bloom", 1.2, SOFT);
  const dim = k(g, "bookUp", 1.0, SOFT);
  const childTilt = lerp(-3.5, -1, lean);
  return (
    <AbsoluteFill data-name="Room1">
      <AbsoluteFill style={{ background: ROOM_BG }} />
      <AbsoluteFill style={{ backgroundImage: `url(${img("grain.png")})`, mixBlendMode: "multiply", opacity: 0.1 }} />
      <Window g={g} />
      <Lamp on={adultIn} />
      <Floor />
      <Motes g={g} />
      <Adult x={1080} base={1000 + (1 - adultIn) * 560} s={1.24} rot={-5 * lean} opacity={adultIn} />
      <Child x={640} feet={1012} h={520} rot={childTilt} />
      {/* the thought cloud, puffing out of the child's head */}
      <div style={{ position: "absolute", left: 600, top: 448, width: 26, height: 26, borderRadius: "50%", background: "#FFF9EE", opacity: tw(g, T.f("thought"), T.f("thought") + 6) * (1 - cloudOut), boxShadow: "0 4px 10px rgba(80,40,30,0.2)" }} />
      <div style={{ position: "absolute", left: 556, top: 398, width: 40, height: 40, borderRadius: "50%", background: "#FFF9EE", opacity: tw(g, T.f("thought") + 5, T.f("thought") + 11) * (1 - cloudOut), boxShadow: "0 4px 10px rgba(80,40,30,0.2)" }} />
      <div data-name="Memory" style={{ position: "absolute", left: 150, top: 150, opacity: tw(g, T.f("thought") + 9, T.f("thought") + 18) * (1 - cloudOut), transform: `scale(${lerp(0.82, 1, SETTLE(cloudIn)) * lerp(1, 0.6, cloudOut)}) translate(${cloudOut * 120}px, ${cloudOut * 140}px)`, transformOrigin: "80% 100%" }}>
        <Memory w={560} h={318} />
      </div>
      {/* the questions */}
      {(["q1", "q2", "q3"] as const).map((q, i) => (
        <div key={q} style={{ opacity: 1 - qOut, transform: `translateY(${-qOut * 40}px)` }}>
          <Bubble name={`Question${i + 1}`} x={[1250, 1340, 1210][i]} y={[440, 330, 250][i]} r={[54, 46, 40][i]} k={k(g, q, 0.4)} tail="left">
            <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: [62, 52, 46][i], color: C.violet }}>?</span>
          </Bubble>
        </div>
      ))}
      {/* the book in the adult's hands, opening into light */}
      {bookIn > 0 && g < T.f("bookUp") && (
        <div style={{ opacity: bookIn * (1 - dim), transform: `translateY(${(1 - bookIn) * 40}px)` }}>
          <Book x={1080} y={760} w={210} open={bookOpen} glow={bloom * 1.2} />
        </div>
      )}
      <Glow x={1080} y={760} r={lerp(80, 760, bloom)} color="rgba(255,240,200,0.9)" opacity={bloom * (1 - dim)} />
      <Burst k={k(g, "bloom", 2.0, SOFT)} x={1080} y={740} n={40} spread={620} rise={420} seed={5} size={18} />
      <Burst k={k(g, "bloom+0.4", 2.0, SOFT)} x={1080} y={760} n={24} spread={400} rise={520} seed={6} size={12} color={C.warm} />
      {/* the room gives way to the book's light */}
      <AbsoluteFill style={{ background: C.night, opacity: dim * 0.94 }} />
      {/* captions */}
      <Say g={g} name="CapQuote" x={960} y={58} size={70} out="w:more-0.3" color={C.plum} align="center" width={1200} words={[
        { t: "“They", at: "quote1" }, { t: "didn't", at: "w:didn't" }, { t: "let", at: "w:let" }, { t: "me", at: "w:me" }, { t: "play.”", at: "w:play", gold: false },
      ]} />
      <Say g={g} name="CapMind" x={960} y={58} size={66} out="adult-0.1" color={C.plum} align="center" width={1300} words={[
        { t: "More", at: "w:more" }, { t: "than", at: "w:than" }, { t: "they", at: "w:they2" }, { t: "know", at: "w:know" }, { t: "how", at: "w:how" }, { t: "to", at: "w:to" }, { t: "say.", at: "w:say" },
      ]} />
      <Say g={g} name="CapWay" x={960} y={58} size={64} out="w:it's-0.15" color={C.plum} align="center" width={1300} words={[
        { t: "The", at: "w:the" }, { t: "best", at: "w:best" }, { t: "way", at: "w:way" }, { t: "into", at: "w:into" }, { t: "that", at: "w:that" }, { t: "feeling…", at: "w:feeling" },
      ]} />
      <Say g={g} name="CapQuestion" x={960} y={138} size={64} out="w:it's-0.15" color={C.plum} align="center" width={1300} words={[
        { t: "isn't", at: "w:isn't" }, { t: "another", at: "w:another" }, { t: "question.", at: "w:question" },
      ]} />
      <Say g={g} name="CapStory" x={960} y={70} size={124} out="bookUp+0.4" color={C.plum} align="center" weight={700} width={1400} words={[
        { t: "It's", at: "w:it's" }, { t: "a", at: "w:a2" }, { t: "story.", at: "w:story", violet: true },
      ]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the room, after the story (P27–P29)
export const Room2: React.FC<{ g: number }> = ({ g }) => {
  const lean = k(g, "quiet", 1.4, SOFT);
  const fr = k(g, "friend", 0.6);
  const b1 = k(g, "answer", 0.45), b2 = k(g, "talk", 0.45), b3 = k(g, "talk+0.7", 0.45), b4 = k(g, "talk+1.3", 0.45);
  const up = k(g, "quiet", 1.6, SOFT);
  return (
    <AbsoluteFill data-name="Room2">
      <AbsoluteFill style={{ background: ROOM_BG }} />
      <AbsoluteFill style={{ backgroundImage: `url(${img("grain.png")})`, mixBlendMode: "multiply", opacity: 0.1 }} />
      <Window g={g} />
      <Lamp on={1} />
      <Floor />
      <Motes g={g} seed={9} />
      <Adult x={1080} base={1000} s={1.24} rot={-4 - 3 * lean} />
      <Child x={lerp(700, 760, lean)} feet={1012} h={520} rot={lerp(1, 6, lean)} />
      <Book x={930} y={850} w={120} open={1} glow={0.7 + float(g, 0.15, 3)} title={false}
        right={<Img src={img("S6BB.webp")} style={{ position: "absolute", left: "8%", top: "10%", width: "84%", height: "56%", objectFit: "cover", borderRadius: 4 }} />} />
      {/* our friend, rising from the page */}
      <div data-name="Friend" style={{ position: "absolute", left: 900 - 70, top: 520, width: 140, height: 140, borderRadius: "50%", overflow: "hidden", opacity: fr * (1 - k(g, "answer", 0.5, SOFT)), transform: `translateY(${(1 - fr) * 50}px)`, boxShadow: `0 0 0 4px ${C.goldSoft}, 0 0 40px rgba(245,197,66,0.6)` }}>
        <Img src={img("S1.webp")} style={{ position: "absolute", width: 1264 * 0.62, height: 848 * 0.62, left: -1264 * 0.62 * 0.25 + 70, top: -848 * 0.62 * 0.82 + 70 }} />
      </div>
      <Burst k={k(g, "friend", 1.4, SOFT)} x={900} y={600} n={12} spread={160} rise={120} seed={9} size={12} />
      <div style={{ opacity: 1 - up * 0.9, transform: `translateY(${-up * 60}px)` }}>
        <Bubble name="TalkChild1" x={540} y={360} r={70} k={b1} tail="right"><Talk color={C.violet} /></Bubble>
        <Bubble name="TalkAdult1" x={1260} y={330} r={64} k={b2} tail="left"><Talk color={C.ember} /></Bubble>
        <Bubble name="TalkChild2" x={520} y={200} r={56} k={b3} tail="right"><Talk color={C.violet} /></Bubble>
        <Bubble name="TalkAdult2" x={1290} y={180} r={52} k={b4} tail="left"><Talk color={C.ember} /></Bubble>
      </div>
      <Say g={g} name="CapFriend" x={960} y={110} size={64} out="w:conversation-0.3" color={C.plum} align="center" width={1500} words={[
        { t: "“What", at: "w:what3" }, { t: "do", at: "w:do2" }, { t: "you", at: "w:you" }, { t: "think", at: "w:think" }, { t: "our", at: "w:our" }, { t: "friend", at: "w:friend", gold: false }, { t: "needed?”", at: "w:needed" },
      ]} />
      <Say g={g} name="CapConversation" x={960} y={110} size={64} out="w:quiet-0.25" color={C.plum} align="center" width={1500} words={[
        { t: "…the", at: "w:the4" }, { t: "conversation", at: "w:conversation" }, { t: "doesn't", at: "w:doesn't" }, { t: "have", at: "w:have" }, { t: "to.", at: "w:to4" },
      ]} />
      <Say g={g} name="CapQuiet" x={960} y={110} size={64} out="sky+0.5" color={C.plum} align="center" width={1500} words={[
        { t: "A", at: "w:a7" }, { t: "quiet", at: "w:quiet" }, { t: "moment", at: "w:moment2" }, { t: "together.", at: "w:together" },
      ]} />
      <Sparkle x={1645} y={300} r={10} opacity={0.5 + float(g, 0.4, 2.3)} />
    </AbsoluteFill>
  );
};
