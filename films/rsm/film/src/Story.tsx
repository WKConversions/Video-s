// Royal School of Music, 35.6 s website hero explainer (English, 60 fps). Apple style: a calm, still background; all
// motion in the foreground. Karl's four site pictures are rebuilt as motion: the word guitar (S1), the note burst (S1,
// S3), the partner logos (S4 schools, S7 Trinity), the low-poly instruments (S4 events). One card carries the middle:
// the problem (S2) collapses into the logo tile (S3), the tile opens into the services card (S4).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import A from "./assets.json";
import { C, Center, FPS, INOUT, IN, Mark, Note, NoteBurst, NOTES, OUT, Rise, SANS, SHADOW, SHADOW_S, SOFT, Wordmark, c01, k, mix, rnd, sp, w, win } from "./kit";

const img = (n: string) => staticFile(`img/${n}`);
const MARK = A.mark as { d: string; aspect: number };

// ---------------------------------------------------------------- S1: the word guitar assembles, strums, notes burst
const GBOX = A.guitarBox as number[];
const GS = 0.96, GX = 960 - (GBOX[0] * GS) / 2, GY = 540 - (GBOX[1] * GS) / 2;
const HOLE = { x: GX + 380 * GS, y: GY + 710 * GS };
const S1: React.FC<{ t: number }> = ({ t }) => {
  const words = A.guitar as { t: string; x: number; y: number; s: number; w: number; k: number }[];
  const out = k(t, 2.7, 0.6, IN);                     // words fall into the card's centre
  return (
    <>
      <div style={{ position: "absolute", left: GX, top: GY, width: GBOX[0] * GS, height: GBOX[1] * GS }}>
        {words.map((wd, i) => {
          const r = rnd(i + 5), r2 = rnd(i * 3 + 1);
          const a = -0.45 + (wd.y / GBOX[1]) * 0.7 + r * 0.45;      // the guitar builds from the headstock down; frame 0 is already in flight
          const p = k(t, a, 0.75, OUT); const vel = c01((1 - p) * 2.2);
          const ang = r2 * Math.PI * 2, d0 = 700 + r * 600;
          const strum = t > w("exciting") ? Math.sin((t - w("exciting")) * 28 - wd.x * 0.03) * 7 * Math.exp(-(t - w("exciting")) * 2.4) : 0;
          const cx = GBOX[0] / 2, cy = GBOX[1] * 0.62;
          const x = mix(wd.x + Math.cos(ang) * d0, wd.x, p) + (cx - wd.x) * out * 0.9;
          const y = mix(wd.y + Math.sin(ang) * d0, wd.y, p) + strum + (cy - wd.y) * out * 0.9;
          const teal = wd.k && i % 3 === 0;
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, fontFamily: SANS, fontWeight: wd.w, fontSize: wd.s * GS, lineHeight: 0.8, whiteSpace: "nowrap",
            color: teal ? C.teal : C.ink, opacity: c01(p * 3) * (1 - out), transform: `translate(${x * GS}px, ${y * GS}px) rotate(${(1 - p) * (r - 0.5) * 60}deg) scale(${1 - out * 0.6})`,
            filter: vel > 0.05 || out > 0.02 ? `blur(${vel * 9 + out * 8}px)` : undefined }}>{wd.t}</div>;
        })}
      </div>
      <NoteBurst t={t} a={w("exciting")} x={HOLE.x} y={HOLE.y} n={70} reach={1050} seed={3} life={1.3} />
    </>
  );
};

// ---------------------------------------------------------------- the card: its size along the film (S2 → S3 → S4)
type Geo = { w: number; h: number; r: number; teal: number };
const GEO: [number, Geo][] = [
  [2.95, { w: 120, h: 120, r: 60, teal: 0 }], [3.35, { w: 1240, h: 700, r: 44, teal: 0 }],
  [w("often") + 0.3, { w: 1240, h: 700, r: 44, teal: 0 }], [w("meet") - 0.05, { w: 250, h: 250, r: 64, teal: 1 }],
  [w("we") - 0.15, { w: 250, h: 250, r: 64, teal: 1 }], [w("we") + 0.45, { w: 1440, h: 760, r: 44, teal: 0 }],
  [19.55, { w: 1440, h: 760, r: 44, teal: 0 }], [20.05, { w: 1000, h: 600, r: 40, teal: 0 }],
];
const geo = (t: number): Geo => {
  if (t <= GEO[0][0]) return GEO[0][1];
  for (let i = 0; i < GEO.length - 1; i++) {
    const [a, g0] = GEO[i], [b, g1] = GEO[i + 1];
    if (t <= b) { const p = i === 0 ? c01(sp(t, a, 1.5, 0.72)) : INOUT(c01((t - a) / (b - a))); return { w: mix(g0.w, g1.w, p), h: mix(g0.h, g1.h, p), r: mix(g0.r, g1.r, p), teal: mix(g0.teal, g1.teal, p) }; }
  }
  return GEO[GEO.length - 1][1];
};

// ---------------------------------------------------------------- S2: the problem, in the card
const TEACHERS = ["e1.png", "e2.png", "e4.png", "e6.png"];
const Search: React.FC<{ t: number }> = ({ t }) => {
  const txt = "the right teacher"; const n = Math.floor(c01((t - (w("finding") + 0.05)) / 0.55) * txt.length);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <div style={{ width: 760, height: 92, borderRadius: 46, background: C.bg, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 34px", gap: 20, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.ink }}>
        <svg width="38" height="38" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke={C.muted} strokeWidth="2.4" fill="none" /><path d="M15 15 L21 21" stroke={C.muted} strokeWidth="2.4" strokeLinecap="round" /></svg>
        <span>Finding {txt.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0.2, color: C.teal }}>|</span></span>
      </div>
      <div style={{ display: "flex", gap: 34 }}>
        {[0, 1, 2, 3].map((j) => {
          const spin = t - (w("teacher") - 0.1) - j * 0.08;     // each slot shuffles portraits, then lands
          const pos = spin < 0 ? 0 : spin * (5 + j * 0.7);
          return (
            <div key={j} style={{ width: 200, height: 200, borderRadius: 100, overflow: "hidden", position: "relative", background: "#fff", boxShadow: SHADOW_S, transform: `scale(${0.9 + 0.1 * c01(sp(t, w("finding") + 0.2 + j * 0.07, 2, 0.6))})` }}>
              {[0, 1].map((q) => { const idx = Math.floor(pos) + q; const y = (idx - pos) * 200; return (
                <Img key={q} src={img(TEACHERS[(idx + j) % 4])} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${-58}px, ${y - 52}px)`, width: 316 }} />); })}
              <div style={{ position: "absolute", right: 10, bottom: 10, width: 54, height: 54, borderRadius: 27, background: "#fff", boxShadow: SHADOW_S, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.teal, transform: `scale(${c01(sp(t, w("teacher") + 0.45 + j * 0.08, 2.4, 0.5))})` }}>?</div>
            </div>);
        })}
      </div>
    </div>
  );
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const Schedule: React.FC<{ t: number }> = ({ t }) => {
  const a = w("fitting");
  // the lesson block tries three slots; every one is taken
  const tries = [[1, 0], [3, 2], [2, 1]].map(([d, r], i) => ({ d, r, at: a + 0.25 + i * 0.45 }));
  let bx = 2, by = -1.4, shake = 0;
  for (const tr of tries) { const p = k(t, tr.at, 0.3, INOUT); bx = mix(bx, tr.d, p); by = mix(by, tr.r, p); if (t > tr.at + 0.3 && t < tr.at + 0.45) shake = Math.sin((t - tr.at) * 90) * 8; }
  return (
    <div style={{ position: "relative", width: 900, height: 470 }}>
      <div style={{ display: "flex", gap: 20, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.muted }}>
        {DAYS.map((d, i) => <div key={d} style={{ width: 164, textAlign: "center", opacity: k(t, a - 0.2 + i * 0.05, 0.3) }}>{d}</div>)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 50, width: 900, height: 420, overflow: "hidden" }}>
        {Array.from({ length: 10 }, (_, r) => DAYS.map((_, d) => { if (rnd(r * 5 + d + 2) < 0.22) return null; const i = r * 5 + d; const p = c01(sp(t, a - 0.15 + i * 0.02, 2.2, 0.6));
          const y = 10 + r * 136 - Math.max(0, t - a - 0.2) * 330;     // the weeks scroll by, every one full
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 164, height: 120, borderRadius: 22, background: i % 3 === 0 ? `${NOTES[i % 5]}55` : "#DFE4E4", transform: `translate(${d * 184}px, ${y}px) scale(${p})`, opacity: c01(p * 2) }} />; }))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 164, height: 120, borderRadius: 22, background: C.teal, boxShadow: SHADOW, color: "#fff",
        fontFamily: SANS, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transform: `translate(${bx * 184 + shake}px, ${60 + by * 136 - 10}px) rotate(${shake * 0.4}deg)`, opacity: k(t, a, 0.2) }}>
        <Note size={34} color="#fff" /> Lesson
      </div>
    </div>
  );
};
const INSTR = ["Piano", "Guitar", "Violin", "Singing", "Drums"];
const WhereToStart: React.FC<{ t: number }> = ({ t }) => {
  const a = w("knowing");
  const hover = Math.floor(c01((t - a - 0.25) / 1.2) * 7) % 5;     // the cursor hesitates from one to the next
  const at = (tt: number) => INSTR.map((_, i) => { const ang = -Math.PI / 2 + (i / 5) * Math.PI * 2 + Math.max(0, tt - a) * 1.5; return { x: Math.cos(ang) * 340, y: Math.sin(ang) * 205 }; });
  const pos = at(t);
  const seq = [0, 2, 4, 1, 3, 0, 2]; const si = Math.floor(c01((t - a - 0.25) / 1.2) * 7) % 7;
  const prev = at(t)[seq[Math.max(0, si - 1)]], tgt = pos[seq[si]]; const ph = c01(((t - a - 0.25) / 1.2 * 7) % 1 * 2.5);
  const cp = { x: mix(prev.x, tgt.x, INOUT(ph)), y: mix(prev.y, tgt.y, INOUT(ph)) };
  return (
    <div style={{ position: "relative", width: 1000, height: 560 }}>
      <div style={{ position: "absolute", left: 500 - 60, top: 280 - 80, width: 120, height: 160, fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.teal, textAlign: "center", lineHeight: "160px",
        transform: `scale(${c01(sp(t, a + 0.2, 1.6, 0.5))}) rotate(${Math.sin(t * 3) * 6}deg)` }}>?</div>
      {INSTR.map((n, i) => { const p = c01(sp(t, a - 0.1 + i * 0.06, 2, 0.6)); const on = i === [0, 2, 4, 1, 3, 0, 2][Math.floor(c01((t - a - 0.25) / 1.2) * 7) % 7];
        return <div key={n} style={{ position: "absolute", left: 0, top: 0, width: 240, height: 76, borderRadius: 38, background: on ? C.tealL : "#fff",
          border: `2px solid ${on ? C.teal : C.line}`, boxShadow: SHADOW_S, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: on ? C.tealD : C.ink,
          transform: `translate(${500 + pos[i].x * p - 120}px, ${280 + pos[i].y * p - 38}px) scale(${p * (on ? 1.06 : 1)})` }}><Note size={30} color={NOTES[i]} />{n}</div>; })}
      <svg width="44" height="54" viewBox="0 0 22 27" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${500 + cp.x + 60}px, ${280 + cp.y + 10}px)`, opacity: k(t, a + 0.25, 0.2), transition: "none" }}>
        <path d="M2 2 L2 22 L7 17 L11 25 L14 24 L10 16 L17 16 Z" fill={C.ink} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div style={{ display: "none" }}>{hover}</div>
    </div>
  );
};

// ---------------------------------------------------------------- S4: the three services, in the open card
const POLY = A.poly as { w: number; h: number; tris: { p: number[]; c: string; cx: number; cy: number }[] };
const LowPoly: React.FC<{ t: number; a: number; scale: number }> = ({ t, a, scale }) => (
  <svg width={POLY.w * scale} height={POLY.h * scale} viewBox={`0 0 ${POLY.w} ${POLY.h}`} style={{ overflow: "visible" }}>
    {POLY.tris.map((tr, i) => {
      const at = a + (tr.cx / POLY.w) * 0.5 + (1 - tr.cy / POLY.h) * 0.35 + rnd(i) * 0.25;
      const p = c01(sp(t, at, 1.6, 0.75)); if (p <= 0) return null;
      const dx = (rnd(i * 7) - 0.5) * 300 * (1 - p), dy = (rnd(i * 3) - 0.2) * 260 * (1 - p), rot = (rnd(i * 5) - 0.5) * 140 * (1 - p);
      return <polygon key={i} points={tr.p.join(" ")} fill={tr.c} stroke={tr.c} strokeWidth={0.6} opacity={c01(p * 2.5)}
        transform={`translate(${dx} ${dy}) rotate(${rot} ${tr.cx} ${tr.cy})`} />;
    })}
  </svg>
);
const HOUSE = "M60 230 L60 120 L170 30 L280 120 L280 230 Z";
const Services: React.FC<{ t: number; W: number; H: number }> = ({ t, W, H }) => {
  const s1 = w("personalized") - 0.2, s2 = w("complete") - 0.15, s3 = w("professional") - 0.15;
  const panelW = 760, panelH = H - 60;
  // which media: 0 house + notes, 1 home photo, 2 school logos, 3 low-poly instruments; the panel pushes up between them
  const push = (at: number) => k(t, at, 0.55, INOUT);
  const y1 = (1 - push(s1)) * panelH, y2 = (1 - push(s2)) * panelH, y3 = (1 - push(s3)) * panelH;
  const titles: [number, string[]][] = [[w("we") + 0.3, ["We bring", "music to you"]], [s1 + 0.1, ["Personalised", "lessons at home"]], [s2 + 0.1, ["Music", "programmes", "for schools"]], [s3 + 0.1, ["Live", "performances", "for your events"]]];
  const cur = titles.filter((x) => t >= x[0] - 0.05).length - 1;
  const draw = k(t, w("bring"), 0.9, SOFT);
  return (
    <div style={{ position: "absolute", inset: 30, display: "flex", gap: 64, alignItems: "center" }}>
      <div style={{ width: panelW, height: panelH, borderRadius: 32, overflow: "hidden", position: "relative", background: C.bg }}>
        {/* 0: the house draws, notes fly in at the door */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${-(1 - y1 / panelH) * panelH}px)` }}>
          <svg width="420" height="320" viewBox="0 0 340 260"><path d={HOUSE} fill="none" stroke={C.teal} strokeWidth="9" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900 * (1 - draw)} /></svg>
          {Array.from({ length: 12 }, (_, i) => { const u = t < w("bring") ? -1 : (((t - w("bring")) * 1.4 + i / 12) % 1); const x = mix(-300, 0, OUT(u)), y = mix(-230 + (i % 6) * 80, 30, OUT(u));
            return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: u > 0 && u < 1 ? 1 : 0, transform: `translate(${panelW / 2 + x - 20}px, ${panelH / 2 + y - 30}px) scale(${1 - u * 0.6})` }}><Note size={84} color={NOTES[i % 5]} beamed={i % 3 === 0} /></div>; })}
        </div>
        {/* 1: the home lesson, revealed through the house */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", transform: `translateY(${y1}px)` }}>
          <Img src={img("home.jpg")} style={{ position: "absolute", height: panelH, left: -260, top: 0, transform: `scale(${1.42 - 0.38 * k(t, s1, 2.0, OUT)}) translateX(${-90 + 130 * k(t, s1, 2.0, OUT)}px)`, transformOrigin: "40% 50%" }} />
        </div>
        {/* 2: the schools that run the programme (logos from the site), in two columns running opposite ways */}
        <div style={{ position: "absolute", inset: 0, background: C.pink, transform: `translateY(${y2}px)`, overflow: "hidden" }}>
          {[["svenska.png", "montessori.png", "gobierno.png", "deutsche.png"], ["deutsche.png", "laschapas.png", "svenska.png", "montessori.png"]].map((col, ci) =>
            Array.from({ length: 8 }, (_, i) => { const n = col[i % 4]; const per = 4 * 190; const run = Math.max(0, t - s2) * 280 * (ci ? 1 : -1);
              const y = (((i * 190 + run) % (2 * per)) + 2 * per) % (2 * per) - 190; const p = c01(sp(t, s2 + 0.35 + (i % 4) * 0.12 + ci * 0.06, 2.1, 0.55));
              return <div key={`${ci}-${i}`} style={{ position: "absolute", left: 0, top: 0, width: 280, height: 160, borderRadius: 24, background: "#fff", boxShadow: SHADOW_S, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${ci ? 400 : 80}px, ${y}px) scale(${p})`, opacity: c01(p * 2) }}>
                <Img src={img(`logos/${n}`)} style={{ maxWidth: 210, maxHeight: 120 }} /></div>; }))}
        </div>
        {/* 3: the instruments assemble (low-poly, from the site's artwork) */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff", transform: `translateY(${y3}px)` }}>
          <div style={{ position: "absolute", right: -10, top: panelH / 2 - (POLY.h * 1.25) / 2, transform: `scale(${1.12 + 0.14 * k(t, s3, 3, SOFT)})`, transformOrigin: "100% 50%" }}><LowPoly t={t} a={s3 + 0.05} scale={1.25} /></div>
          {Array.from({ length: 14 }, (_, i) => { const st = w("live") + 0.6; if (t < st) return null; const u = (((t - st) * 1.0 + i / 14) % 1); const r = rnd(i + 40);
            const bx = panelW - 10 - POLY.w * 1.25 + 120 * 1.25, by = panelH / 2 - (POLY.h * 1.25) / 2 + 250 * 1.25;
            return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: Math.sin(Math.PI * u) * c01((t - st) * 3), transform: `translate(${bx - u * (260 + r * 120)}px, ${by - u * (220 + r * 260) + Math.sin(u * 9 + i) * 14}px) rotate(${(r - 0.5) * 50}deg) scale(${0.6 + u * 0.7})` }}><Note size={78} color={NOTES[i % 5]} beamed={i % 3 === 0} /></div>; })}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, height: 260 }}>
        {titles.map(([at, lines], i) => { if (Math.abs(i - cur) > 0 && !(i === cur - 1 && t < titles[cur][0] + 0.4)) return null;
          const gone = i < cur ? k(t, titles[cur][0] - 0.05, 0.35, IN) : 0;
          return <div key={i} style={{ position: "absolute", left: 0, top: 40, opacity: 1 - gone, transform: `translateY(${-gone * 60}px)`, filter: gone > 0.02 ? `blur(${gone * 8}px)` : undefined }}>
            {lines.map((ln, li) => <Rise key={li} text={ln} t={t} at={at + 0.22 + li * 0.12} size={60} weight={800} color={li === lines.length - 1 ? C.teal : C.ink} />)}
          </div>; })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- S5: the five instruments
const INST: [string, string, number][] = [["piano", "piano.jpg", w("piano")], ["guitar", "guitar.jpg", w("guitar")], ["violin", "e2.png", w("violin")], ["singing", "singing.jpg", w("singing")], ["drums", "drums.jpg", w("drums")]];
const S5: React.FC<{ t: number }> = ({ t }) => {
  const idx = INST.filter((x) => t >= x[2] - 0.12).length - 1;
  const roll = INST.reduce((acc, x, i) => acc + (i > 0 ? k(t, x[2] - 0.12, 0.35, INOUT) : 0), 0);
  return (
    <>
      <Center style={{ top: -110 }}>
        <div style={{ width: 1480, height: 740, borderRadius: 40, overflow: "hidden", position: "relative", background: "#fff", boxShadow: SHADOW, transform: `scale(${0.96 + 0.04 * c01(sp(t, 19.9, 1.5, 0.7))})` }}>
          {INST.map(([n, f, at], i) => { const p = i === 0 ? 1 : k(t, at - 0.12, 0.4, INOUT); if (i > idx + 1 || (i < idx - 1)) return null;
            const isRound = f.endsWith(".png");
            return <div key={n} style={{ position: "absolute", inset: 0, clipPath: `inset(${(1 - p) * 100}% 0 0 0 round 40px)`, background: "#fff" }}>
              <Img src={img(f)} style={isRound ? { position: "absolute", left: 740 - 330, top: 370 - 316, width: 660, transform: `rotate(${(t - at) * 14}deg) scale(${1.45 - 0.45 * k(t, at - 0.12, 0.8)})` } : { position: "absolute", width: 1480, top: -120, left: 0, transform: `scale(${1.5 - 0.38 * k(t, at - 0.12, 0.8) - 0.05 * c01((t - at) / 1.5)})` }} />
            </div>; })}
        </div>
      </Center>
      <div style={{ position: "absolute", left: 0, right: 0, top: 862, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 104, color: C.ink, letterSpacing: "-0.03em" }}>
        <Rise text="Learn" t={t} at={w("learn") - 0.1} size={104} weight={800} />
        <div style={{ height: 116, overflow: "hidden", width: 470 }}>
          <div style={{ transform: `translateY(${-roll * 116}px)`, color: C.teal, lineHeight: "116px", opacity: k(t, w("piano") - 0.15, 0.25) }}>
            {INST.map(([n]) => <div key={n} style={{ height: 116 }}>{n}</div>)}
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- S6: qualified teachers, confidence and skills
const S6: React.FC<{ t: number }> = ({ t }) => {
  const up = k(t, w("build") - 0.1, 0.6, INOUT);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: mix(150, 90, up), display: "flex", justifyContent: "center" }}>
        <Rise text="Qualified teachers" t={t} at={w("qualified") - 0.1} size={76} weight={800} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: mix(330, 230, up), display: "flex", justifyContent: "center", gap: 36, transform: `scale(${1 - up * 0.3})`, transformOrigin: "50% 0" }}>
        {TEACHERS.map((f, i) => { const p = c01(sp(t, w("qualified") + i * 0.1, 1.9, 0.62)); return (
          <div key={f} style={{ width: 360, height: 344, transform: `translateY(${(1 - p) * 120}px) scale(${0.7 + 0.3 * p})`, opacity: c01(p * 2) }}>
            <Img src={img(f)} style={{ width: 360 }} /></div>); })}
      </div>
      {[["Confidence", w("confidence")], ["Skills", w("develop")]].map(([n, at], j) => { const a = at as number; const vis = k(t, a - 0.15, 0.3); return (
        <div key={j} style={{ position: "absolute", left: 960 - 620, top: 545 + j * 170, width: 1240, opacity: vis, transform: `translateY(${(1 - vis) * 40}px)`, display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ width: 300, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, textAlign: "right" }}>{n as string}</div>
          <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "flex-end", height: 130 }}>
            {Array.from({ length: 12 }, (_, i) => { const p = c01(sp(t, a + 0.05 + i * 0.05, 2.4, 0.55)); return (
              <div key={i} style={{ flex: 1, height: 40 + i * 8, borderRadius: 10, background: "#E6EAEA", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${p * 100 * (0.62 + 0.38 * Math.abs(Math.sin(t * 7 + i * 1.3 + j * 2)))}%`, background: j === 0 ? C.teal : NOTES[i % 5], borderRadius: 10 }} /></div>); })}
          </div>
        </div>); })}
    </>
  );
};

// ---------------------------------------------------------------- S7: international certifications
const S7: React.FC<{ t: number }> = ({ t }) => {
  const a = w("prepare") - 0.25, stamp = w("certifications") + 0.15;
  const p = c01(sp(t, a, 1.5, 0.72)); const sP = c01(sp(t, stamp, 2.6, 0.45));
  return (
    <Center>
      <div style={{ width: 1100, height: 640, borderRadius: 36, background: "#fff", boxShadow: SHADOW, transform: `perspective(1800px) rotateY(${(1 - p) * -38 + Math.sin((t - a) * 1.6) * 13}deg) rotateX(${Math.cos((t - a) * 1.2) * 6}deg) scale(${0.85 + 0.15 * p})`, opacity: c01(p * 2), position: "relative" }}>
        <div style={{ position: "absolute", inset: 26, borderRadius: 22, border: `3px solid ${C.teal}`, opacity: 0.35 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: "0.3em", color: C.muted }}>
          <Rise text="PREPARE FOR" t={t} at={a + 0.2} size={26} weight={700} spacing="0.3em" color={C.muted} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
          <Rise text="International certifications" t={t} at={w("international") - 0.1} size={64} serif color={C.ink} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
          <div style={{ opacity: k(t, w("international") + 0.1, 0.3), transform: `translateY(${(1 - k(t, w("international") + 0.1, 0.5)) * 30}px)` }}><Img src={img("logos/trinity.png")} style={{ height: 64 }} /></div>
          <div style={{ width: 2, height: 70, background: C.line }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: "0.04em", color: "#3A2F6B", opacity: k(t, w("international") + 0.3, 0.3), transform: `translateY(${(1 - k(t, w("international") + 0.3, 0.5)) * 30}px)` }}>ABRSM</div>
        </div>
        {/* the seal stamps */}
        <div style={{ position: "absolute", left: 550 - 90, top: 420, width: 180, height: 180, transform: `scale(${t < stamp ? 0 : 2.2 - 1.2 * sP}) rotate(${(1 - sP) * 30}deg)`, opacity: c01((t - stamp) * 8) }}>
          <svg width="180" height="180" viewBox="0 0 100 100">
            <path d="M34 62 L22 96 L36 88 L44 99 L50 70 Z" fill={C.tealD} /><path d="M66 62 L78 96 L64 88 L56 99 L50 70 Z" fill={C.tealD} />
            <circle cx="50" cy="44" r="34" fill={C.teal} /><circle cx="50" cy="44" r="26" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M38 44 L47 53 L63 36" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <NoteBurst t={t} a={stamp + 0.05} x={960} y={1000 - 30} n={26} reach={520} seed={9} life={1.0} size={52} />
    </Center>
  );
};

// ---------------------------------------------------------------- S8: the journey, on a staff
const MELODY = [4, 3, 5, 4, 6, 5, 7, 6, 8, 9, 10];
const S8: React.FC<{ t: number }> = ({ t }) => {
  const a = w("your") - 0.25; const draw = k(t, a, 0.9, SOFT);
  const out = k(t, w("get") - 0.35, 0.5, INOUT);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
        <Rise text="Your musical journey" t={t} at={w("your") - 0.05} size={86} weight={800} gap={0.09} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-out * 50}px)` }}>
        <Rise text="starts here." t={t} at={w("starts") - 0.05} size={86} weight={800} color={C.teal} />
      </div>
      <div style={{ position: "absolute", left: 260, top: 560, width: 1400, height: 200, opacity: 1 - out, transform: `scale(${1 - out * 0.15})` }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 50, height: 4, borderRadius: 2, width: 1400 * draw, background: "rgba(38,41,43,0.22)" }} />)}
        {Array.from({ length: 22 }, (_, i) => { const x = 1460 + i * 150 - Math.max(0, t - a) * 820; if (x < -120 || x > 1500) return null; const m = MELODY[i % MELODY.length] + (i >= 11 ? 1 : 0); const y = 200 - m * 22;
          const p = c01((1460 - x) / 160); const bob = Math.sin(t * 6 + i) * 4;
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: p * c01((x + 120) / 140), transform: `translate(${x}px, ${y - 76 + bob}px) scale(${0.5 + 0.5 * p})` }}><Note size={130} color={NOTES[i % 5]} beamed={i % 4 === 3} /></div>; })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- S9: end card
const S9: React.FC<{ t: number }> = ({ t }) => {
  const a = w("get") - 0.3; const p = c01(sp(t, a, 1.6, 0.7));
  const btn = c01(sp(t, w("get") + 0.05, 1.9, 0.6)); const press = t > w("touch") ? 1 - 0.06 * Math.exp(-(t - w("touch")) * 9) * Math.sin(Math.min(Math.PI, (t - w("touch")) * 14)) : 1;
  return (
    <>
      {/* brand notes orbit slowly round the logo: the end card never stands still */}
      {Array.from({ length: 16 }, (_, i) => { const ang = (i / 16) * Math.PI * 2 + (t - a) * 0.55; const rr = 560 + 40 * Math.sin(i * 2.1 + t);
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: 0.85 * k(t, a + 0.3 + i * 0.05, 0.6), transform: `translate(${960 + Math.cos(ang) * rr * 1.25 - 30}px, ${420 + Math.sin(ang) * rr * 0.62 - 40}px) rotate(${Math.sin(t + i) * 14}deg)` }}><Note size={76} color={NOTES[i % 5]} beamed={i % 3 === 0} /></div>; })}
      <div style={{ position: "absolute", left: 960 - 105, top: 190, width: 210, height: 210, borderRadius: 54, background: C.teal, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>
        <Mark h={96} d={MARK.d} aspect={MARK.aspect} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
        <Wordmark size={84} t={t} at={[a + 0.15, a + 0.22, a + 0.29, a + 0.36]} /></div>
      <div style={{ position: "absolute", left: 960 - 230, top: 640, width: 460, height: 110, borderRadius: 55, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
        fontFamily: SANS, fontWeight: 700, fontSize: 40, boxShadow: SHADOW, transform: `scale(${btn * press})`, opacity: c01(btn * 2) }}>Get in touch <span style={{ color: C.teal }}>→</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, color: C.muted, opacity: k(t, w("today"), 0.4) }}>royalschoolofmusic.es</div>
    </>
  );
};

// ---------------------------------------------------------------- the film
export const Story: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const g = geo(t);
  const cardOn = t >= 2.95 && t < 20.25;
  const s2 = (a: number, b: number) => win(t, a, b, 0.3, 0.3);
  const less = k(t, w("often"), 0.7, SOFT);                         // "often less so": the card goes grey and sinks
  const meetOut = k(t, w("meet") - 0.5, 0.35, IN);                  // the problem leaves before the card becomes the tile
  const tileContent = win(t, w("meet") - 0.05, w("we") + 0.05, 0.3, 0.3);
  const servicesIn = t > w("we") ? win(t, w("we") + 0.15, 19.75, 0.4, 0.4) : 0;
  const cardFade = 1 - k(t, 19.8, 0.45, IN);
  const scene = (a: number, b: number, el: React.ReactNode, din = 0.4, dout = 0.4) => {
    if (t < a - 0.01 || t > b + 0.01) return null; const e = c01(sp(t, a, 1.5, 0.75)), o = k(t, b - dout, dout, IN);
    return <AbsoluteFill style={{ opacity: c01(e * 2) * (1 - o), transform: `scale(${mix(1.05, 1, e) * (1 - 0.05 * o)})`, filter: e < 0.9 || o > 0.02 ? `blur(${(1 - c01(e / 0.9)) * 10 + o * 10}px)` : undefined }}>{el}</AbsoluteFill>;
  };
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {t < 3.6 && <S1 t={t} />}
      <NoteBurst t={t} a={w("meet") + 0.05} x={960} y={540} n={70} reach={1100} seed={5} life={2.1} size={84} />
      {cardOn && (
        <Center>
          <div style={{ width: g.w, height: g.h, borderRadius: g.r, background: g.teal > 0.01 ? `color-mix(in srgb, ${C.teal} ${g.teal * 100}%, #fff)` : C.card, boxShadow: SHADOW, position: "relative", overflow: "hidden",
            transform: `translateY(${less * 26 * (1 - meetOut)}px)`, opacity: cardFade, filter: less > 0.01 && t < w("meet") ? `saturate(${1 - less * 0.9})` : undefined }}>
            <Center style={{ opacity: s2(3.2, w("fitting") - 0.05) * (1 - meetOut), transform: "scale(1.3)" }}>{t < w("fitting") + 0.1 && <Search t={t} />}</Center>
            <Center style={{ opacity: s2(w("fitting") - 0.15, w("knowing") - 0.05) * (1 - meetOut) }}>{t > w("fitting") - 0.2 && t < w("knowing") + 0.1 && <div style={{ transform: "scale(1.2)" }}><Schedule t={t} /></div>}</Center>
            <Center style={{ opacity: s2(w("knowing") - 0.15, w("meet") - 0.1) * (1 - meetOut), transform: `scale(${1 - less * 0.06})` }}>{t > w("knowing") - 0.2 && t < w("meet") && <WhereToStart t={t} />}</Center>
            <Center style={{ opacity: tileContent }}>{t > w("meet") - 0.1 && t < w("we") + 0.4 && <div style={{ transform: `scale(${0.6 + 0.4 * c01(sp(t, w("meet") - 0.05, 1.8, 0.55))})` }}><Mark h={112} d={MARK.d} aspect={MARK.aspect} /></div>}</Center>
            {servicesIn > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 760, opacity: servicesIn, transform: `translate(${(g.w - 1440) / 2}px, ${(g.h - 760) / 2}px)` }}><Services t={t} W={1440} H={760} /></div>}
          </div>
        </Center>
      )}
      {/* "Meet Royal School of Music": the wordmark rises under the tile, notes burst in the brand colours */}
      {t > w("meet") - 0.2 && t < w("we") + 0.6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", opacity: 1 - k(t, w("we") - 0.1, 0.35, IN) }}>
          <Wordmark size={96} t={t} at={[w("royal"), w("school"), w("of"), w("music")]} /></div>)}
      {scene(19.95, 24.15, <S5 t={t} />)}
      {scene(24.0, 27.75, <S6 t={t} />)}
      {scene(27.6, 30.6, <S7 t={t} />)}
      {scene(30.45, 33.1, <S8 t={t} />)}
      {t > w("get") - 0.35 && <S9 t={t} />}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/dither.png")})`, backgroundRepeat: "repeat", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
