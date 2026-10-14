// Costa Connect — "Blijf verbonden, waar je ook onderneemt". One continuous stage on the warm canvas; every phrase of
// the voice-over gets its own visual on its key word. The thread is one network line between Spain (orange) and the
// Netherlands (navy): it stalls in the gap ("afstand"), Costa Connect closes it, it branches into the services,
// carries the contact and the updates, shortens and thickens, and ends running into the call to action.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, GRADTXT, MOVE, SMALLPOP, clamp01, mix } from "./lib";
import { Box, Cable, Eyebrow, Grain, Icon, Mesh, Win, glass, mixHex, pointAt } from "./saas";
import { breathe, measure, off } from "./kinetic";

const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
/** a slow constant drift that eases in over 0.4 s (content keeps moving while it holds) */
const drift = (g: number, from: string | number, pps: number) => {
  const t = (g - f(from)) / 30; if (t <= 0) return 0; return pps * (t < 0.4 ? (t * t) / 0.8 : t - 0.2);
};
/** an orb's place on a looping cable (undefined before it starts) */
const loop = (g: number, from: string | number, period: number, phase = 0) => {
  const t = (g - f(from)) / period + phase; return t <= 0 ? undefined : Math.max(0.02, t % 1);
};
const typed = (g: number, at: string, text: string, cps = 26) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- words: a line built word by word (rise, fade, de-blur); key words in the site's gradient type ---------- */
type Wd = { t: string; at: string; grad?: boolean; color?: string };
const Words: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; weight?: number; center?: boolean; out?: string; color?: string; ls?: number; under?: boolean }> = ({
  g, words, x = 0, y, size, weight = 800, center, out, color = C.ink, ls = -0.03, under = true }) => {
  const gap = size * 0.24, gw = words.map((w) => (w.grad ? measure(w.t, size, weight, ls) : 0));
  const firstG = words.findIndex((w) => w.grad);
  let acc = 0; const offs = words.map((w, i) => { if (!w.grad) return 0; const o = acc; acc += gw[i] + gap; return o; });
  const total = Math.max(1, acc - gap);
  const P = firstG >= 0 ? k(g, off(words[firstG].at, 0.15), 0.75, MOVE) * total : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: center ? 1920 : undefined, display: "flex", justifyContent: center ? "center" : "flex-start",
      gap, whiteSpace: "nowrap", transform: `translate(${x}px, ${y}px)`, fontFamily: C.font, fontWeight: weight, fontSize: size, lineHeight: 1.12,
      letterSpacing: `${ls}em`, color }}>
      {words.map((w, i) => {
        const kk = k(g, w.at, 0.45);
        const o = out ? k(g, off(out, i * 0.03), 0.32, DEPART) : 0;
        if (kk <= 0) return <span key={i} style={{ opacity: 0 }}>{w.t}</span>;
        const fill: React.CSSProperties = w.grad ? { backgroundImage: `linear-gradient(100deg, ${GRADTXT})`, backgroundSize: `${total}px 100%`,
          backgroundPosition: `${-offs[i]}px 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" } : { color: w.color };
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: Math.min(1, kk * 1.6) * (1 - o),
            transform: `translateY(${((1 - kk) * 0.35 - o * 0.35) * size}px)`, filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 8 + o * 8}px)` : undefined }}>
            <span style={fill}>{w.t}</span>
            {w.grad && under && <span style={{ position: "absolute", left: 0, bottom: -size * 0.06, width: gw[i], height: Math.max(6, size * 0.07), borderRadius: 9,
              background: `linear-gradient(90deg, ${C.orange}, ${C.red})`, backgroundSize: `${total}px 100%`, backgroundPosition: `${-offs[i]}px 0`,
              transformOrigin: "0 50%", transform: `scaleX(${clamp01((P - offs[i]) / gw[i])})` }} />}
          </span>
        );
      })}
    </div>
  );
};

/** A photo filling its window or card, with a slow push and pan. */
const Shot: React.FC<{ src: string; w: number | string; h: number | string; pos: string; zoom: number; px?: number; py?: number; r?: number; o?: number; style?: React.CSSProperties }> = ({
  src, w, h, pos, zoom, px = 0, py = 0, r = 18, o = 1, style }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: r, overflow: "hidden", opacity: o, ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `translate(${px}px, ${py}px) scale(${zoom})` }} />
  </div>
);

/** The site's location label: pin, place, country code, coordinates. */
const Loc: React.FC<{ name: string; cc: string; coord?: string; size?: number; pin?: number; style?: React.CSSProperties }> = ({ name, cc, coord, size = 26, pin = 1, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.42}px ${size * 0.75}px`, borderRadius: size * 2, whiteSpace: "nowrap",
    background: "rgba(255,255,255,0.95)", boxShadow: "0 10px 26px rgba(7,27,64,0.12)", fontFamily: C.font, ...style }}>
    <div style={{ transform: `translateY(${(1 - pin) * -26}px) scale(${0.6 + 0.4 * pin})`, opacity: pin }}><Icon name="pin" size={size * 1.15} color={C.orange} sw={2.6} /></div>
    <span style={{ fontWeight: 800, fontSize: size, color: C.navy }}>{name}</span>
    <span style={{ fontWeight: 800, fontSize: size * 0.62, color: "#FFFFFF", background: C.navy, borderRadius: 7, padding: `${size * 0.12}px ${size * 0.28}px`, letterSpacing: "0.06em" }}>{cc}</span>
    {coord && <span style={{ fontWeight: 600, fontSize: size * 0.72, color: C.muted }}>{coord}</span>}
  </div>
);

/** A network node: a frosted disc with a monoline icon. */
const Node: React.FC<{ x: number; y: number; s?: number; o?: number; icon: string; size?: number; tone?: string }> = ({ x, y, s = 1, o = 1, icon, size = 80, tone = C.navy }) =>
  o <= 0.01 ? null : (
    <Box x={x} y={y} w={size} h={size} r={size} s={s} o={o} style={{ ...glass(tone), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.5} color={tone} sw={2.4} />
    </Box>
  );

/** The hexagon mark on a frosted tile; `face` turns it into Rienk's portrait, `bare` drops the tile. */
const MarkTile: React.FC<{ x: number; y: number; size: number; o?: number; s?: number; blur?: number; face?: number; bare?: number }> = ({ x, y, size, o = 1, s = 1, blur = 0, face = 0, bare = 0 }) => {
  if (o <= 0.01) return null;
  const mh = size * 0.72, mw = (mh * 422) / 496;
  return (
    <Box x={x} y={y} w={size} h={size} r={mix(size * 0.27, size / 2, face)} s={s} o={o} blur={blur} style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", ...glass(C.orange), opacity: 1 - bare }} />
      <Img src={staticFile("img/mark.png")} style={{ position: "absolute", left: (size - mw) / 2, top: (size - mh) / 2, width: mw, height: mh, opacity: 1 - face }} />
      {face > 0 && <Img src={staticFile("img/rienk.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: face,
        transform: `scale(${1.15 - 0.15 * face})` }} />}
    </Box>
  );
};

/* ---------- 1–3 · two worlds, the distance, and Costa Connect closing it ---------- */
const SP = { x: 660, y: 690, w: 780, h: 470 }, NL = { x: 1440, y: 650, w: 500, h: 580 };
const worlds = (g: number) => {
  const a = k(g, "q", 0.9, MOVE);                       // apart: the distance opens
  const c = k(g, "w:dichtbij-0.05", 0.9, MOVE);         // closer
  const e = k(g, "w:van-0.1", 0.55, MOVE);              // both fold into the hub
  const s = mix(mix(1, 0.62, a), 0.15, e);
  return {
    a, c, e, s,
    sx: mix(mix(mix(SP.x, 360, a), 540, c), 960, e), sy: mix(mix(SP.y, 690, a), 640, e),
    nx: mix(mix(mix(NL.x, 1473, a), 1293, c), 960, e), ny: mix(mix(NL.y, 690, a), 640, e),
  };
};
const SPN = [{ dx: -230, dy: -250, i: "users" }, { dx: -130, dy: 250, i: "building" }];
const NLN = [{ dx: 250, dy: -240, i: "users" }, { dx: 330, dy: 40, i: "chat" }, { dx: 180, dy: 270, i: "building" }];
const Worlds: React.FC<{ g: number }> = ({ g }) => {
  if (g > f("w:van+0.6")) return null;
  const W = worlds(g);
  const sp = k(g, "w:ondernemen", 0.7), nl = k(g, "w:kansen-0.05", 0.7);
  const spR = W.sx + (SP.w * W.s) / 2, nlL = W.nx - (NL.w * W.s) / 2;
  const gapK = k(g, "w:afstand", 0.8, MOVE) * 0.55 + k(g, "w:costa+0.1", 0.6, MOVE) * 0.45;
  const net = (i: number) => k(g, off("w:netwerk", i * 0.08), 0.45, SMALLPOP);
  const fade = 1 - W.e;
  return (
    <AbsoluteFill>
      {/* the headline of the two worlds */}
      <Words g={g} x={140} y={118} size={92} out="q-0.05" words={[{ t: "Ondernemen", at: "w:ondernemen" }, { t: "vanuit", at: "w:vanuit" }, { t: "Spanje.", at: "w:spanje", grad: true }]} />
      <Words g={g} x={140} y={230} size={92} out="q" words={[{ t: "Kansen", at: "w:kansen" }, { t: "in", at: "w:in" }, { t: "Nederland.", at: "w:nederland", grad: true }]} />
      {/* the question, then the answer */}
      <Words g={g} y={170} size={96} center out="cc-0.05" words={[{ t: "Waarom", at: "w:waarom" }, { t: "zou", at: "w:zou" }, { t: "afstand", at: "w:afstand", grad: true }]} />
      <Words g={g} y={282} size={96} center out="cc" words={[{ t: "daartussen", at: "w:daartussen" }, { t: "staan?", at: "w:staan" }]} />
      <Words g={g} y={170} size={92} center out="svc-0.05" words={[{ t: "Met", at: "w:met" }, { t: "Costa", at: "w:costa" }, { t: "Connect", at: "w:connect" }, { t: "blijft", at: "w:blijft" }]} />
      <Words g={g} y={282} size={92} center out="svc" words={[{ t: "jouw", at: "w:jouw" }, { t: "netwerk", at: "w:netwerk", grad: true }, { t: "dichtbij.", at: "w:dichtbij", grad: true }]} />
      {/* the network around each side */}
      {SPN.map((n, i) => <Cable key={`sc${i}`} id={`sc${i}`} d={`M ${W.sx} ${W.sy} L ${W.sx + n.dx} ${W.sy + n.dy}`} k={net(i)} w={3} c0={C.orange} c1={C.rust} o={fade} />)}
      {NLN.map((n, i) => <Cable key={`nc${i}`} id={`nc${i}`} d={`M ${W.nx} ${W.ny} L ${W.nx + n.dx} ${W.ny + n.dy}`} k={net(i + 2)} w={3} c0={C.slate} c1={C.navy} o={fade} />)}
      {SPN.map((n, i) => <Node key={`sn${i}`} x={W.sx + n.dx} y={W.sy + n.dy} s={net(i)} o={Math.min(1, net(i)) * fade} icon={n.i} size={76} tone={C.rust} />)}
      {NLN.map((n, i) => <Node key={`nn${i}`} x={W.nx + n.dx} y={W.ny + n.dy} s={net(i + 2)} o={Math.min(1, net(i + 2)) * fade} icon={n.i} size={76} />)}
      {/* the line between them: it stalls in the gap, and Costa Connect closes it */}
      <Cable id="gapL" d={`M ${spR - 4} 690 L ${960 - 100} 690`} k={gapK} w={6} c0={C.orange} c1={C.rust} o={fade}
        orb={g > f("w:connect+0.3") ? loop(g, "w:connect+0.3", 34) : undefined} />
      <Cable id="gapR" d={`M ${nlL + 4} 690 L ${960 + 100} 690`} k={gapK} w={6} c0={C.navy} c1={C.slate} o={fade}
        orb={g > f("w:connect+0.3") ? loop(g, "w:connect+0.3", 34, 0.5) : undefined} />
      {/* Spain */}
      <Win x={W.sx} y={W.sy + (1 - sp) * 70} w={SP.w} h={SP.h} s={W.s * (0.94 + 0.06 * sp)} o={sp * fade} blur={(1 - sp) * 10} glow={C.orange} title="Costa del Sol">
        <Shot src="img/nerja.jpg" w={SP.w - 32} h={SP.h - 72} pos="50% 60%" zoom={1.12 + drift(g, 0, 0.022)} px={-drift(g, 0, 7)} r={16} style={{ left: 16, top: 56 }} />
        <div style={{ position: "absolute", left: 34, bottom: 34 }}><Loc name="Costa del Sol" cc="ES" coord="36°45′ N · 3°52′ W" size={24} pin={k(g, "w:spanje", 0.5)} /></div>
      </Win>
      {/* the Netherlands */}
      <Win x={W.nx} y={W.ny + (1 - nl) * 70} w={NL.w} h={NL.h} s={W.s * (0.94 + 0.06 * nl)} o={nl * fade} blur={(1 - nl) * 10} glow={C.blue} title="Amsterdam">
        <Shot src="img/amsterdam.jpg" w={NL.w - 32} h={NL.h - 72} pos="50% 35%" zoom={1.1 + drift(g, "w:kansen", 0.025)} py={-drift(g, "w:kansen", 6)} r={16} style={{ left: 16, top: 56 }} />
        <div style={{ position: "absolute", left: 30, bottom: 30 }}><Loc name="Amsterdam" cc="NL" size={24} pin={k(g, "w:nederland", 0.5)} /></div>
      </Win>
    </AbsoluteFill>
  );
};

/* ---------- the hub (the mark), from the gap to Rienk's face to the chat header ---------- */
const hub1 = (g: number) => {
  const p = k(g, "w:costa-0.1", 0.6);
  const m1 = k(g, "w:van-0.1", 0.7, MOVE), m2 = k(g, "face", 0.75, MOVE), m3 = k(g, "tell", 0.7, MOVE);
  const x = mix(mix(mix(960, 960, m1), 390, m2), 300, m3), y = mix(mix(mix(690, 560, m1), 668, m2), 352, m3);
  const size = mix(mix(mix(230, 250, m1), 200, m2), 82, m3);
  const out = k(g, "geen-0.12", 0.5, DEPART);
  return { x, y: y + out * 520, size, o: Math.min(1, p * 1.4) * (1 - out), s: 1.25 - 0.25 * p, blur: (1 - p) * 10, face: k(g, "w:gezicht-0.2", 0.5, MOVE) };
};
const Hub1: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:costa-0.2") || g > f("geen+0.6")) return null;
  const h = hub1(g);
  return <MarkTile x={h.x} y={h.y} size={h.size} o={h.o} s={h.s} blur={h.blur} face={h.face} />;
};

/* ---------- 4 · the services branch out of the hub ---------- */
const SVC = [
  { t: "Gesprekken", i: "chat", at: "w:gesprekken", x: 430, y: 300, sx: -1, sy: -1 },
  { t: "Nieuwe connecties", i: "link", at: "w:connecties", x: 430, y: 820, sx: -1, sy: 1 },
  { t: "Relatiebeheer", i: "users", at: "w:relatiebeheer", x: 1490, y: 300, sx: 1, sy: -1 },
  { t: "Praktische zaken", i: "briefcase", at: "w:praktische", x: 1490, y: 820, sx: 1, sy: 1 },
];
const Services: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("svc") || g > f("face+0.7")) return null;
  const r = k(g, "face", 0.5, MOVE);
  return (
    <AbsoluteFill>
      {SVC.map((s, i) => {
        const cab = k(g, off(s.at, -0.2), 0.5, MOVE), t = k(g, off(s.at, 0.08), 0.5);
        const tx = mix(s.x + s.sx * drift(g, s.at, 9), 960, r), ty = mix(s.y + s.sy * drift(g, s.at, 5), 560, r);
        const hx = 960 + s.sx * 125, ex = tx - s.sx * 270, mid = (hx + ex) / 2;
        return (
          <React.Fragment key={i}>
            <Cable id={`sv${i}`} d={`M ${hx} 560 C ${mid} 560, ${mid} ${ty}, ${ex} ${ty}`} k={cab * (1 - r)} w={4} c0={C.navy} c1={C.orange}
              orb={cab >= 1 && r === 0 ? loop(g, off(s.at, 0.3), 42, i * 0.27) : undefined} />
            <Box x={tx} y={ty + (1 - t) * 30} w={540} h={140} r={34} s={(0.88 + 0.12 * t) * (1 - 0.6 * r)} o={t * (1 - r)} blur={(1 - t) * 8 + r * 6} style={glass(C.orange)}>
              <div style={{ position: "absolute", left: 28, top: 28, width: 84, height: 84, borderRadius: 24, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.i} size={46} color="#FFFFFF" sw={2.6} />
              </div>
              <div style={{ position: "absolute", left: 136, top: 46, fontFamily: C.font, fontWeight: 800, fontSize: 40, color: C.navy, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>{s.t}</div>
            </Box>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 5 · your face on location: the hub becomes Rienk, on a card, over Amsterdam ---------- */
// the Amsterdam window that follows: in view (5), a node beside the chat (6), then the table (7)
const awin = (g: number) => {
  const p = k(g, "w:jouw2-0.1", 0.7), m = k(g, "tell", 0.7, MOVE), t = k(g, "table", 0.8, MOVE), out = k(g, "geen-0.08", 0.55, DEPART);
  return {
    p, t, out,
    x: mix(mix(mix(1520, 1400, p), 1500, m), 1430, t), y: mix(mix(600, 560, m), 560, t) + out * 560,
    w: mix(700, 840, t), h: mix(640, 600, t), s: mix(mix(0.92 + 0.08 * p, 0.5, m), 1, t),
  };
};
const Face: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("face") || g > f("geen+0.7")) return null;
  const A = awin(g);
  const card = k(g, "w:zijn", 0.6), m = k(g, "tell", 0.7, MOVE);
  const pin = k(g, "w:locatie-0.05", 0.45, SMALLPOP);
  const lk = k(g, "w:locatie", 0.6, MOVE);
  const z = 1.08 + drift(g, "face", 0.03);
  return (
    <AbsoluteFill>
      <Words g={g} x={140} y={118} size={92} out="tell-0.05" words={[{ t: "Jouw", at: "w:jouw2" }, { t: "gezicht", at: "w:gezicht" }, { t: "op", at: "w:op", grad: true }, { t: "locatie.", at: "w:locatie", grad: true }]} />
      <Win x={A.x} y={A.y} w={A.w} h={A.h} s={A.s} o={A.p * (1 - A.out)} blur={(1 - A.p) * 10} glow={C.blue} title={A.t > 0.5 ? "Jij op afstand. Wij aan tafel." : "Amsterdam"}>
        <Shot src="img/amsterdam.jpg" w={A.w - 32} h={A.h - 72} pos="50% 40%" zoom={z} py={-drift(g, "face", 8)} r={16} o={1 - A.t} style={{ left: 16, top: 56 }} />
        <Shot src="img/meeting.jpg" w={A.w - 32} h={A.h - 72} pos="50% 55%" zoom={1.08 + drift(g, "table", 0.04)} px={-drift(g, "table", 10)} r={16} o={A.t} style={{ left: 16, top: 56 }} />
        {/* the pin lands on location */}
        <div style={{ position: "absolute", left: A.w / 2 - 40, top: A.h / 2 - 90, opacity: pin * (1 - A.t), transform: `translateY(${(1 - pin) * -60}px) scale(${pin})` }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(239,105,37,0.4)", border: "4px solid #FFFFFF" }}>
            <Icon name="pin" size={44} color="#FFFFFF" sw={3} />
          </div>
        </div>
      </Win>
      {/* the line from you (the card) to the pin on location */}
      <Cable id="loc" d={`M 1030 668 C 1150 668, 1220 ${A.y - 50}, ${A.x - 34} ${A.y - 50}`} k={lk * (1 - m)} w={5} c0={C.orange} c1={C.navy} o={1 - m}
        orb={lk >= 1 ? loop(g, "w:locatie+0.6", 30) : undefined} />
      {/* the representative's card, which grows into the chat */}
      <Box x={mix(640, 600, m)} y={mix(668, 560, m) + k(g, "geen-0.12", 0.5, DEPART) * 520} w={780} h={mix(320, 640, m)} r={30} s={0.94 + 0.06 * card} o={card * (1 - k(g, "geen-0.12", 0.5, DEPART))}
        blur={(1 - card) * 8} style={{ ...glass(C.orange), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 280, top: 70, opacity: 1 - m * 2.5 }}>
          <Eyebrow text="Jouw vertegenwoordiger" size={19} style={{ color: C.orange }} />
          <div style={{ fontFamily: C.font, fontWeight: 800, fontSize: 54, color: C.navy, marginTop: 10, letterSpacing: "-0.02em" }}>Rienk Franken</div>
          <div style={{ marginTop: 22 }}><Loc name="Amsterdam" cc="NL" size={24} pin={pin} /></div>
        </div>
        <Chat g={g} m={m} />
      </Box>
    </AbsoluteFill>
  );
};

/* ---------- 6–7 · you tell, we connect, sit at the table, and keep you posted ---------- */
const Bubble: React.FC<{ me?: boolean; k: number; children: React.ReactNode; top: number; tone?: string }> = ({ me, k: kk, children, top, tone }) =>
  kk <= 0 ? null : (
    <div style={{ position: "absolute", top, [me ? "right" : "left"]: 36, transformOrigin: me ? "100% 100%" : "0% 100%", transform: `scale(${0.85 + 0.15 * kk}) translateY(${(1 - kk) * 20}px)`,
      opacity: Math.min(1, kk * 1.5), maxWidth: 560, padding: "20px 28px", borderRadius: 30, [me ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 8,
      background: me ? C.orange : tone ?? "#FFFFFF", color: me ? "#FFFFFF" : C.navy, border: me ? "none" : `1.5px solid ${C.line}`,
      boxShadow: "0 10px 24px rgba(7,27,64,0.08)", fontFamily: C.font, fontWeight: 700, fontSize: 32, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14 } as React.CSSProperties}>
      {children}
    </div>
  );
const Chat: React.FC<{ g: number; m: number }> = ({ g, m }) => {
  if (m <= 0) return null;
  const o = clamp01(m * 2 - 1);
  const t1 = typed(g, "w:vertelt-0.05", "Een belangrijk gesprek", 30);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 22, top: 20, display: "flex", gap: 9 }}>{[0, 1, 2].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: "#E3E6EC" }} />)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 15, textAlign: "center", fontFamily: C.font, fontWeight: 600, fontSize: 18, color: C.muted }}>Rechtstreeks met Rienk</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 52, height: 1, background: "rgba(7,27,64,0.06)" }} />
      <div style={{ position: "absolute", left: 150, top: 76, fontFamily: C.font, fontWeight: 800, fontSize: 30, color: C.navy }}>Rienk Franken</div>
      <div style={{ position: "absolute", left: 150, top: 114, fontFamily: C.font, fontWeight: 600, fontSize: 21, color: C.muted }}>Costa Connect · Amsterdam</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 1, background: "rgba(7,27,64,0.06)" }} />
      <Bubble me top={190} k={k(g, "w:vertelt-0.15", 0.35)}>{t1}{t1.length < 22 && <span style={{ width: 3, height: 34, background: "#FFFFFF", opacity: Math.floor(g / 7) % 2 ? 1 : 0.3 }} />}</Bubble>
      <Bubble me top={282} k={k(g, "w:speelt", 0.4, SMALLPOP)}>Iets praktisch regelen</Bubble>
      <Bubble top={386} k={k(g, "w:contact-0.1", 0.4, SMALLPOP)}><Icon name="link" size={34} color={C.orange} sw={3} />Contact gelegd</Bubble>
      <Bubble top={478} k={k(g, "w:houden+0.62", 0.45, SMALLPOP)} tone="#F3F5FA"><Icon name="check" size={34} color={C.orange} sw={3.4} />Update over de voortgang</Bubble>
    </div>
  );
};
// the contact: a line out of the chat to the people on location, and the update travelling back along it
const CON = [{ dx: 250, dy: -210, i: "users" }, { dx: 290, dy: 60, i: "building" }, { dx: 150, dy: 250, i: "chat" }];
const Contact: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("contact-0.2") || g > f("geen+0.6")) return null;
  const A = awin(g);
  const out = k(g, "geen-0.08", 0.5, DEPART);
  const l = k(g, "contact", 0.55, MOVE);
  const ax = A.x - (A.w * A.s) / 2 + 10;
  const d = `M 990 520 C 1080 520, ${ax - 90} ${A.y}, ${ax} ${A.y}`;
  const back = k(g, "w:houden", 0.7, MOVE);
  const t = k(g, "table", 0.6, MOVE);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Cable id="con" d={d} k={l} w={5} c0={C.orange} c1={C.navy} o={1 - t} orb={l >= 1 && back === 0 ? loop(g, "contact+0.55", 28) : undefined} />
      {CON.map((n, i) => {
        const p = k(g, off("w:contact", i * 0.1), 0.45, SMALLPOP) * (1 - t);
        return (
          <React.Fragment key={i}>
            <Cable id={`cn${i}`} d={`M ${A.x} ${A.y} L ${A.x + n.dx} ${A.y + n.dy}`} k={Math.min(1, p)} w={3} c0={C.slate} c1={C.navy} o={1 - t} />
            <Node x={mix(A.x + n.dx, A.x, t)} y={mix(A.y + n.dy, A.y, t)} s={p} o={Math.min(1, p)} icon={n.i} size={78} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// the update leaves the table and flies across to your chat, where it lands as the last message
const Update: React.FC<{ g: number }> = ({ g }) => {
  const back = k(g, "w:houden", 0.7, MOVE);
  if (back <= 0 || back >= 1) return null;
  const q = pointAt("M 1430 470 C 1250 300, 760 560, 420 760", back);
  return (
    <Box x={q.x} y={q.y} w={92} h={92} r={46} s={1 - 0.3 * back} style={{ background: C.orange, border: "4px solid #FFFFFF", boxShadow: "0 12px 26px rgba(239,105,37,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="check" size={46} color="#FFFFFF" sw={3.4} />
    </Box>
  );
};

/* ---------- 8 · no extra office, no missed chances ---------- */
const Geen: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("geen-0.1") || g > f("korte+0.8")) return null;
  const b = k(g, "w:extrakantoor-0.05", 0.5), st = k(g, "w:extrakantoor+0.4", 0.35, MOVE), drop = k(g, "w:geen2-0.15", 0.45, DEPART);
  const out = k(g, "korte-0.05", 0.45, DEPART);
  const chips = [{ t: "Gesprek", i: "chat" }, { t: "Bezoek", i: "pin" }, { t: "Afspraak", i: "users" }];
  return (
    <AbsoluteFill>
      <Words g={g} y={230} size={112} center out="korte-0.12" words={[{ t: "Geen", at: "w:geen" }, { t: "extra", at: "w:extrakantoor" }, { t: "kantoor.", at: "w:extrakantoor+0.12" }]} />
      <Words g={g} y={366} size={112} center out="korte-0.06" words={[{ t: "Geen", at: "w:geen2" }, { t: "gemiste", at: "w:gemiste", grad: true }, { t: "kansen.", at: "w:kansen2", grad: true }]} />
      {/* the office that isn't needed: struck through, and gone */}
      <Box x={960} y={720 + drop * 80} w={250} h={250} r={56} s={(0.85 + 0.15 * b) * (1 - 0.2 * drop)} o={b * (1 - drop)} blur={(1 - b) * 8 + drop * 6} style={glass(C.blue)}>
        <div style={{ position: "absolute", left: 55, top: 55 }}><Icon name="building" size={140} color={C.navy} sw={2.2} /></div>
        <svg width={250} height={250} style={{ position: "absolute", left: 0, top: 0 }}><line x1={36} y1={214} x2={214} y2={36} stroke={C.orange} strokeWidth={12} strokeLinecap="round"
          pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - st} opacity={st > 0 ? 1 : 0} /></svg>
      </Box>
      {/* nothing slips: each one is followed up */}
      {chips.map((c, i) => {
        const a = k(g, off("w:gemiste", i * 0.09), 0.45), on = k(g, off("w:kansen2", 0.05 + i * 0.12), 0.35, SMALLPOP);
        return (
          <Box key={i} x={560 + i * 400 + drift(g, "w:gemiste", 6) * (i - 1)} y={740 + (1 - a) * 40 - out * 60} w={340} h={110} r={55} o={a * (1 - out)} blur={(1 - a) * 8 + out * 8}
            style={{ background: on > 0.5 ? C.navy : "rgba(255,255,255,0.95)", border: `1.5px solid ${on > 0.5 ? C.navy : C.line}`, boxShadow: "0 12px 28px rgba(7,27,64,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: C.font, fontWeight: 800, fontSize: 36, color: on > 0.5 ? "#FFFFFF" : C.navy }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: on > 0.5 ? C.orange : "#F1F3F7", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * on})` }}>
              <Icon name={on > 0.5 ? "check" : c.i} size={32} color={on > 0.5 ? "#FFFFFF" : C.navy} sw={3} />
            </div>
            {c.t}
          </Box>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 9–12 · the network: short lines, strong relations, new possibilities; two countries, one network; the sign-off ---------- */
const HUB = { x: 1490, y: 560 };
const R1 = ["users", "building", "chat", "briefcase", "link"];
// the logo: the mark (left) and the wordmark, placed from the mark's centre and height (logo.jpg geometry)
const wordmark = (mx: number, my: number, mh: number) => { const u = mh / 496; return { x: mx - 211 * u + 500 * u, y: my - 248 * u + 97 * u, w: 702 * u, h: 251 * u }; };
const hub2 = (g: number) => {
  const p = k(g, "korte-0.1", 0.6), m1 = k(g, "twee-0.05", 0.8, MOVE), m2 = k(g, "sign", 0.85, MOVE), m3 = k(g, "cta", 0.8, MOVE);
  return {
    p, m2,
    x: mix(mix(mix(HUB.x, 960, m1), 739.8, m2), 839, m3), y: mix(mix(mix(HUB.y, 700, m1), 400, m2), 196, m3),
    size: mix(mix(mix(170, 150, m1), 389, m2), 214, m3),
  };
};
const Network: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("korte-0.2")) return null;
  const H = hub2(g);
  const short = k(g, "w:lijnen-0.05", 0.8, MOVE), strong = k(g, "w:sterke", 0.6, MOVE), col = k(g, "twee-0.05", 0.6, MOVE);
  const rot = (drift(g, "korte", 5) * Math.PI) / 180;
  const R = mix(345, 215, short) * (1 - col);
  const ring1 = R1.map((icon, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + rot, p = k(g, off("korte", 0.06 + i * 0.06), 0.5, SMALLPOP);
    return { icon, p, x: H.x + Math.cos(a) * R, y: H.y + Math.sin(a) * R, a };
  });
  const R2 = 380 * (1 - col);
  const ring2 = R1.map((_, i) => {
    const a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 5 + rot, p = k(g, off("w:nieuwe2", i * 0.09), 0.5, SMALLPOP);
    return { p, x: H.x + Math.cos(a) * R2, y: H.y + Math.sin(a) * R2 };
  });
  const cw = mix(3, 8, strong), cc = mixHex(C.slate, C.orange, strong);
  const live = g < f("twee+0.8");
  return (
    <AbsoluteFill>
      {live && <>
        <Words g={g} x={140} y={290} size={80} out="twee-0.1" words={[{ t: "Korte", at: "w:korte" }, { t: "lijnen.", at: "w:lijnen" }]} />
        <Words g={g} x={140} y={410} size={80} out="twee-0.05" words={[{ t: "Sterke", at: "w:sterke" }, { t: "relaties.", at: "w:relaties" }]} />
        <Words g={g} x={140} y={530} size={80} out="twee" words={[{ t: "Nieuwe", at: "w:nieuwe2", grad: true }, { t: "mogelijkheden.", at: "w:mogelijkheden", grad: true }]} />
        {ring1.map((n, i) => <Cable key={`r1${i}`} id={`r1${i}`} d={`M ${H.x} ${H.y} L ${n.x} ${n.y}`} k={Math.min(1, n.p)} w={cw} c0={C.navy} c1={cc} o={1 - col}
          orb={n.p >= 1 && col === 0 ? loop(g, off("korte", 0.6), 40, i * 0.2) : undefined} />)}
        {ring2.map((n, i) => <Cable key={`r2${i}`} id={`r2${i}`} d={`M ${ring1[i].x} ${ring1[i].y} L ${n.x} ${n.y}`} k={Math.min(1, n.p)} w={3} c0={cc} c1={C.orange} o={1 - col} />)}
        {ring2.map((n, i) => <Cable key={`r3${i}`} id={`r3${i}`} d={`M ${ring1[(i + 1) % 5].x} ${ring1[(i + 1) % 5].y} L ${n.x} ${n.y}`} k={Math.min(1, n.p)} w={3} c0={cc} c1={C.orange} o={1 - col} />)}
        {ring1.map((n, i) => <Node key={`n1${i}`} x={n.x} y={n.y} s={n.p * (1 - 0.5 * col)} o={Math.min(1, n.p) * (1 - col)} icon={n.icon} size={88} />)}
        {ring2.map((n, i) => <Node key={`n2${i}`} x={n.x} y={n.y} s={n.p * (1 - 0.5 * col)} o={Math.min(1, n.p) * (1 - col)} icon="spark" size={66} tone={C.orange} />)}
      </>}
      <Countries g={g} />
      <MarkTile x={H.x} y={H.y} size={H.size} o={Math.min(1, H.p * 1.4)} s={1.2 - 0.2 * H.p} blur={(1 - H.p) * 8} bare={H.m2} />
      <SignOff g={g} />
    </AbsoluteFill>
  );
};

/* ---------- 10 · two countries, one network (the site's own two location cards) ---------- */
const Country: React.FC<{ x: number; y: number; s: number; o: number; blur: number; src: string; pos: string; eyebrow: string; name: string; cc: string; coord: string; z: number }> = ({
  x, y, s, o, blur, src, pos, eyebrow, name, cc, coord, z }) => (
  <Box x={x} y={y} w={600} h={300} r={30} s={s} o={o} blur={blur} style={{ ...glass(cc === "ES" ? C.orange : C.blue), overflow: "hidden" }}>
    <Shot src={src} w={220} h={260} pos={pos} zoom={z} r={20} style={{ left: 20, top: 20 }} />
    <div style={{ position: "absolute", left: 270, top: 46 }}>
      <Eyebrow text={eyebrow} size={17} style={{ color: cc === "ES" ? C.orange : C.blue }} />
      <div style={{ fontFamily: C.font, fontWeight: 800, fontSize: 46, color: C.navy, marginTop: 12, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
        <span style={{ fontFamily: C.font, fontWeight: 800, fontSize: 18, color: "#FFFFFF", background: C.navy, borderRadius: 7, padding: "4px 9px", letterSpacing: "0.06em" }}>{cc}</span>
        <span style={{ fontFamily: C.font, fontWeight: 600, fontSize: 21, color: C.muted, whiteSpace: "nowrap" }}>{coord}</span>
      </div>
    </div>
  </Box>
);
const countries = (g: number) => {
  const a = k(g, "w:twee", 0.6), b = k(g, "w:landen-0.05", 0.6), m = k(g, "sign", 0.85, MOVE);
  return { a, b, m, ax: mix(450, 300, m), bx: mix(1470, 1620, m), y: mix(720, 905, m), s: mix(1, 0.55, m) };
};
const Countries: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("twee-0.1")) return null;
  const P = countries(g);
  const ar = P.ax + 300 * P.s - 6, bl = P.bx - 300 * P.s + 6;
  const one = k(g, "w:één-0.05", 0.65, MOVE);
  const re = k(g, "w:connecten+0.15", 0.6, MOVE);       // the line re-routes into the button
  const z = 1.1 + drift(g, "twee", 0.03);
  const dOne = `M ${ar} ${P.y} C ${mix(ar, bl, 0.3)} ${P.y - 40 * P.m}, ${mix(ar, bl, 0.7)} ${P.y - 40 * P.m}, ${bl} ${P.y}`;
  const dBack = `M ${bl} ${P.y} C ${mix(ar, bl, 0.7)} ${P.y - 40 * P.m}, ${mix(ar, bl, 0.3)} ${P.y - 40 * P.m}, ${ar} ${P.y}`;
  return (
    <AbsoluteFill>
      <Words g={g} y={150} size={124} center out="sign-0.1" words={[{ t: "Twee", at: "w:twee" }, { t: "landen.", at: "w:landen" }]} />
      <Words g={g} y={292} size={124} center out="sign-0.04" words={[{ t: "Eén", at: "w:één", grad: true }, { t: "netwerk.", at: "w:netwerk2", grad: true }]} />
      <Cable id="one" d={dOne} k={one} w={6} c0={C.orange} c1={C.navy} o={1 - re} orb={one >= 1 ? loop(g, "w:netwerk2+0.3", 40) : undefined} />
      <Cable id="oneb" d={dBack} k={one} w={6} c0={C.navy} c1={C.orange} o={1 - re} orb={one >= 1 ? loop(g, "w:netwerk2+0.3", 40, 0.5) : undefined} />
      {/* the call to action: both countries run into the button */}
      <Cable id="ctaL" d={`M ${ar} ${P.y} C ${ar + 150} ${P.y}, 540 650, 612 650`} k={re} w={6} c0={C.orange} c1={C.rust} orb={re >= 1 ? loop(g, "w:connecten+0.75", 32) : undefined} />
      <Cable id="ctaR" d={`M ${bl} ${P.y} C ${bl - 150} ${P.y}, 1380 650, 1308 650`} k={re} w={6} c0={C.navy} c1={C.slate} orb={re >= 1 ? loop(g, "w:connecten+0.75", 32, 0.5) : undefined} />
      <Country x={P.ax} y={P.y + (1 - P.a) * 60} s={P.s * (0.94 + 0.06 * P.a)} o={P.a} blur={(1 - P.a) * 8} src="img/nerja.jpg" pos="40% 60%" z={z} eyebrow="Jouw thuisbasis" name="Costa del Sol" cc="ES" coord="36°45′ N · 3°52′ W" />
      <Country x={P.bx} y={P.y + (1 - P.b) * 60} s={P.s * (0.94 + 0.06 * P.b)} o={P.b} blur={(1 - P.b) * 8} src="img/amsterdam.jpg" pos="50% 30%" z={z} eyebrow="Jouw aanwezigheid" name="Amsterdam" cc="NL" coord="52°22′ N · 4°54′ E" />
    </AbsoluteFill>
  );
};

/* ---------- 11–12 · Costa Connect, stay connected; ready to connect? ---------- */
const SignOff: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sign")) return null;
  const H = hub2(g);
  const mh = H.size * 0.72, wm = wordmark(H.x, H.y, mh);
  const wipe = k(g, "w:costa2-0.05", 0.7, MOVE);
  const btn = k(g, "w:connecten+0.2", 0.55), mail = k(g, "w:connecten+0.5", 0.5);
  // the cursor comes in and presses the button
  const cur = k(g, "w:connecten+1.0", 0.9, MOVE), press = g >= f("w:connecten+1.95") && g < f("w:connecten+2.15") ? 1 : 0;
  const ring = clamp01((g - f("w:connecten+1.95")) / 18);
  const hover = k(g, "w:connecten+1.7", 0.3);
  const cx = mix(1560, 1160, cur), cy = mix(1010, 668, cur);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: wm.w, height: wm.h, transform: `translate(${wm.x}px, ${wm.y}px)`, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
        <Img src={staticFile("img/wordmark.png")} style={{ width: "100%", height: "100%", transform: `translateX(${(1 - wipe) * -40}px)` }} />
      </div>
      <Words g={g} y={618} size={70} center out="cta-0.1" words={[{ t: "Blijf", at: "w:blijf" }, { t: "verbonden,", at: "w:verbonden", grad: true }, { t: "waar", at: "w:waar" }, { t: "je", at: "w:je2" }, { t: "ook", at: "w:ook" }, { t: "onderneemt.", at: "w:onderneemt" }]} />
      <Words g={g} y={330} size={124} center words={[{ t: "Klaar", at: "w:klaar" }, { t: "om", at: "w:om" }, { t: "te", at: "w:te" }, { t: "connecten?", at: "w:connecten", grad: true }]} />
      {/* the site's call to action */}
      <Box x={960} y={650 + (1 - btn) * 40} w={700} h={124} r={62} s={(0.9 + 0.1 * btn) * (1 - press * 0.035)} o={btn} blur={(1 - btn) * 8}
        style={{ background: C.navy, boxShadow: "0 24px 50px -18px rgba(7,27,64,0.55)", display: "flex", alignItems: "center", gap: 26, paddingLeft: 56, boxSizing: "border-box" }}>
        <span style={{ fontFamily: C.font, fontWeight: 800, fontSize: 42, color: "#FFFFFF", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>Laten we kennismaken</span>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${hover * 8}px)` }}>
          <Icon name="arrow" size={44} color="#FFFFFF" sw={3.4} />
        </div>
      </Box>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${760 + (1 - mail) * 20}px)`, opacity: mail,
        fontFamily: C.font, fontWeight: 700, fontSize: 32, color: C.muted }}>rienk@costa-connect.nl</div>
      {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 160, height: 160, borderRadius: 80, border: `4px solid ${C.orange}`,
        transform: `translate(${cx - 80}px, ${cy - 80}px) scale(${0.2 + ring})`, opacity: 1 - ring }} />}
      {cur > 0 && (
        <svg width={56} height={64} viewBox="0 0 28 32" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx - 6}px, ${cy - 4}px) scale(${1 - press * 0.12})`, opacity: Math.min(1, cur * 3), overflow: "visible" }}>
          <path d="M2 2 L2 26 L8.5 20 L13 30 L17.5 28 L13 18.5 L22 18.5 Z" fill={C.navy} stroke="#FFFFFF" strokeWidth={2} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "cta", 0.035);
  // the canvas leans warm in Spain, cool in the Netherlands, and settles warm for the call
  const tint = clamp01(k(g, "w:kansen", 1.2, MOVE) * (1 - k(g, "svc", 1.5, MOVE)) + k(g, "face", 1.5, MOVE) * (1 - k(g, "geen", 1.5, MOVE)) + k(g, "twee", 1.5, MOVE) * 0.5);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Mesh g={g} tint={tint} />
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%" }}>
        <Worlds g={g} />
        <Services g={g} />
        <Contact g={g} />
        <Face g={g} />
        <Hub1 g={g} />
        <Update g={g} />
        <Geen g={g} />
        <Network g={g} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
