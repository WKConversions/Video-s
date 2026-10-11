// The film on one stage. Every object persists and changes state on its word; colour fields grow out of objects;
// the holds keep working (a call ringing, a voice talking, a clock rolling, the practice at work). Nothing drifts for
// the sake of moving, and nothing with text on it slides across the frame: things appear where they live, on their
// word, and the two scene changes that travel (the whips) move both scenes on one curve, like one camera pan.
import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, F, MOVE, SHADOW, SOFT, at, clamp01, k, lerp, life, mix, rgba, sec } from "./lib";
import { track } from "./kinetic";
import { AG, Agenda, Appt, Avatar, Bubble, Button, CallCard, CallState, Chip, Icon, Note, Phone, Rings, Wave, Wordmark, cell } from "./ui";

type P = [number, number];
/** Where each use of the dentist clip starts (clip frames, 30 fps): the hook (both hands busy, the call missed), and the
 *  practice at work while VoxFlow takes the calls (5–6). Mixkit 12146, Mixkit Stock Video Free License. */
const DENTIST = { hook: 0, work: 140 };
const s = (pos: string) => T.s(pos);
/** A transform-only placement by top-left corner (left/top would snap to whole pixels under the camera). */
const tl = (x: number, y: number, extra = ""): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) ${extra}` });
/** An arrival in place: a short rise out of a blur, no travel across the frame. */
const rise = (u: number, d = 26): React.CSSProperties => ({ opacity: clamp01(u * 1.7), transform: `translateY(${(1 - u) * d}px)`, filter: u < 1 ? `blur(${(1 - u) * 7}px)` : undefined });
/** Masked caller numbers: every card a different caller, none a real-looking number. */
const CALLERS = ["06 •• •• 56 78", "06 •• •• 31 72", "010 ••• 62 09", "06 •• •• 48 15", "020 ••• 93 60", "06 •• •• 27 84"];

// ---------------------------------------------------------------- fields (colour grown out of an object)
/** A full-frame colour field revealed by a feathered circle growing from (x, y). */
const Field: React.FC<{ g: number; from: string; x: number; y: number; color: string; dur?: number; children?: React.ReactNode }> = ({ g, from, x, y, color, dur = 0.75, children }) => {
  const u = k(g, from, dur, SOFT);
  if (u <= 0) return null;
  const r = lerp(0, 2500, u), fe = 180;
  const m = u >= 1 ? undefined : `radial-gradient(circle at ${x}px ${y}px, #000 ${Math.max(0, r - fe)}px, transparent ${r}px)`;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: color, WebkitMaskImage: m, maskImage: m }}>{children}</div>;
};

// ---------------------------------------------------------------- the footage of the practice
const Practice: React.FC<{ start: number; from: number; blur?: number; zoom?: number; fade?: number }> = ({ start, from, blur = 0, zoom = 1, fade = 1 }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: fade }}>
    <Sequence from={start} layout="none">
      <OffthreadVideo src={staticFile("footage/dentist.mp4")} startFrom={from} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }} />
    </Sequence>
  </div>
);

// ---------------------------------------------------------------- the lead call: from the flip to the night call
const leadFace = (g: number): { a: CallState; b?: CallState; k: number; ring: number; press: number } => {
  const t = sec(g);
  if (t < s("talk")) return { a: "answered", k: 0, ring: 0, press: 0 };
  if (t < s("ring2")) return { a: "answered", b: "talk", k: k(g, "talk", 0.4, MOVE), ring: 0, press: 0 };
  if (t < s("picked")) return { a: "talk", b: "night", k: k(g, "ring2", 0.4, MOVE), ring: 1, press: clamp01((t - s("accept")) / 0.3) };
  return { a: "night", b: "picked", k: k(g, "picked", 0.4, MOVE), ring: 0, press: 0 };
};
/** The edge-on flip (missed → answered) for the stacked cards, on "staat". */
const flip = (g: number, i: number) => {
  const u = k(g, T.s("flip") + Math.max(0, i) * 0.08, 0.36, MOVE);
  return { sy: Math.abs(Math.cos(u * Math.PI)), b: u > 0.5 };
};

// ---------------------------------------------------------------- the stage
export const Scenes: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  const els: React.ReactNode[] = [];   // 1–3, under the white field
  const b4: React.ReactNode[] = [];    // 4, above it (whips out with the first whip)
  const b5: React.ReactNode[] = [];    // 5–6 (whips in)

  // ===== the window on the practice (1) that becomes the receptionist's square (2); she stays there through 3
  const [wx, wy, ww, wh, wr] = track(g, [
    ["open", 1370, 395, 940, 529, 30], ["square", 1370, 395, 940, 529, 30], ["square+0.75", 1380, 520, 560, 640, 34, MOVE],
  ]);
  const win = life(g, "open", undefined, 0.6);
  const teal = k(g, "square+0.35", 0.8, SOFT);               // the footage gives way to the pale teal of the site's portrait
  const nightK = k(g, "night", 0.75, SOFT) * (1 - k(g, "white", 0.5));
  if (t < s("white") + 0.8) els.push(
    <div key="win" style={{ ...at(wx, wy, lerp(0.94, 1, win.u), win.o), width: ww, height: wh, borderRadius: wr, overflow: "hidden", background: C.tealSoft, boxShadow: teal < 1 ? SHADOW : undefined }}>
      {t < s("square") + 1.2 && <Practice start={0} from={DENTIST.hook} fade={1 - teal} zoom={1.0 + 0.03 * clamp01(t / 4.4)} />}
    </div>,
  );
  // the receptionist rises out of the square on "iemand"
  const up = k(g, "rise", 0.7);
  if (up > 0 && t < s("white") + 0.8) {
    const aw = 600, ah = aw * (1152 / 928);
    els.push(
      <div key="assistant" style={{ ...tl(wx - ww / 2 - 120, wy - wh / 2 - 220), width: ww + 240, height: wh + 220, overflow: "hidden", clipPath: "inset(0 0 0 0 round 0 0 34px 34px)" }}>
        <Img src={staticFile("img/assistant.png")} style={{ position: "absolute", width: aw, height: ah, left: (ww + 240) / 2 - aw / 2 + 10, top: wh + 220 - ah + 6 + (1 - up) * 150, opacity: clamp01(up * 1.6) }} />
      </div>,
    );
  }

  // ===== 1 the hook: the words on the left
  if (t < s("turn") + 0.4) {
    const lines: [string, string, string?][][] = [
      [["Mis", "w:mis"], ["geen", "w:geen"], ["enkel", "w:enkel"]],
      [["telefoontje", "w:telefoontje", C.teal]],
      [["meer.", "w:meer"]],
    ];
    lines.forEach((ln, li) => els.push(
      <div key={`h${li}`} style={{ ...tl(130, 292 + li * 112), display: "flex", gap: 26, fontFamily: F.display, fontWeight: 800, fontSize: 100, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap" }}>
        {ln.map(([w, lab, col], wi) => {
          const u = k(g, `${lab}-0.12`, 0.45);
          const o = k(g, `turn+${(li * 3 + wi) * 0.025}`, 0.32, DEPART);
          return <span key={wi} style={{ display: "inline-block", color: col ?? C.ink, opacity: clamp01(u * 1.7) * (1 - o),
            transform: `translateY(${((1 - u) * 0.3 - o * 0.35) * 100}px)`, filter: u < 1 || o > 0 ? `blur(${(1 - u) * 8 + o * 8}px)` : undefined }}>{w}</span>;
        })}
      </div>,
    ));
  }

  // ===== 2 the turn: the wordmark and "always reachable" (they leave before the words of 3 take their place)
  const mk = life(g, "turn+0.25", "talk", 0.6, 0.35);
  if (mk.on) {
    els.push(<div key="wm" style={{ ...at(470, 430 - 30 * mk.e, 1, 1 - mk.e), filter: mk.e > 0 ? `blur(${mk.e * 6}px)` : undefined }}><Wordmark h={150} k={k(g, "turn+0.25", 0.65, MOVE)} /></div>);
    const ch = life(g, "always", "talk", 0.45, 0.35);
    if (ch.on) els.push(<div key="chip" style={{ ...tl(318, 560 + (1 - ch.u) * 24 - ch.e * 30), opacity: ch.o }}><Chip text="Altijd bereikbaar" size={26} live={0.5 + 0.5 * Math.sin(t * 5)} /></div>);
  }

  // ===== the calls (1–2): the first call rings where it lands and is missed; then the missed calls keep coming in at the
  // top of the list and push the older ones down (the day goes by); on "staat" they flip to answered and fold into one.
  const fold = k(g, "fold", 0.5, MOVE);
  const LEAD: P = [1060, 640], PITCH = 132;
  const leadPos = track(g, [["open", LEAD[0], LEAD[1]], ["fold", LEAD[0], LEAD[1]], ["fold+0.5", 1320, 840, MOVE]]);
  const CALLS1: [string, string][] = [["09:12", CALLERS[1]], ["10:05", CALLERS[2]], ["11:20", CALLERS[3]], ["12:40", CALLERS[4]], ["14:03", CALLERS[0]]];
  const feed = k(g, "w:telefoontje-0.15", 1.45, MOVE) * (CALLS1.length - 1);
  if (t < s("fold") + 0.5) CALLS1.forEach(([time, caller], j) => {
    if (j === CALLS1.length - 1 && t >= s("flip")) return;          // from the flip on, the top call is the lead card
    const slot = feed - j;
    const u = j === 0 ? k(g, "ring", 0.5) : clamp01(slot + 1);
    if (u <= 0 || slot > 3.6) return;
    const fl = flip(g, Math.round(slot));
    const y0 = LEAD[1] + Math.max(slot, -1) * PITCH;
    const x = lerp(LEAD[0], 1320, fold), y = lerp(y0, 840, fold);
    const face: CallState = t >= s("flip") ? (fl.b ? "answered" : "missed") : "missed";
    els.push(<div key={`st${j}`} style={{ ...at(x, y, lerp(0.94, 1, u), (j === 0 ? clamp01(u * 1.6) : clamp01(u * 1.6 - 0.25)) * (1 - fold)) }}>
      <div style={{ transform: `scaleY(${t >= s("flip") ? fl.sy : 1})` }}>
        {j === 0 && t < s("flip") ? <CallCard a="incoming" b="missed" k={k(g, "missed", 0.4, MOVE)} t={t} time={time} caller={caller} ring={1 - k(g, "missed", 0.3)} />
          : <CallCard a={face} t={t} time={time} caller={caller} />}
      </div>
    </div>);
  });

  // ===== 3 the words on the left: "Onze slimme AI-receptionist"; then 24/7 while the hours roll into the night
  if (t > s("words3") && t < s("h247")) {
    const out = k(g, "h247-0.45", 0.3, MOVE);
    const W3: [string, string, number, number][] = [["Onze", "w:onze", 140, 340], ["slimme", "w:slimme", 380, 340], ["AI-receptionist", "w:ai", 140, 452]];
    W3.forEach(([w, lab, x, y], i) => {
      const u = k(g, `${lab}-0.12`, 0.45);
      const ai = i === 2;
      els.push(<div key={`w3${i}`} style={{ ...tl(x, y), fontFamily: F.display, fontWeight: 800, fontSize: ai ? 100 : 90, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap",
        color: ai ? C.teal : C.ink, opacity: clamp01(u * 1.7) * (1 - out) }}>
        <div style={{ transform: `translateY(${(1 - u) * 28}px)`, filter: u < 1 ? `blur(${(1 - u) * 8}px)` : undefined }}>{w}</div>
        {ai && <div style={{ position: "absolute", left: 4, right: 4, bottom: -18, height: 8, borderRadius: 8, background: C.teal, transformOrigin: "0 50%", transform: `scaleX(${k(g, "w:receptionist", 0.5, MOVE)})` }} />}
      </div>);
    });
  }
  if (t > s("h247") && t < s("white") + 0.8) {
    const u = k(g, "h247", 0.55), u7 = k(g, "w:zeven-0.12", 0.4);
    els.push(<div key="247" style={{ ...tl(130, 236), fontFamily: F.display, fontWeight: 800, fontSize: 300, letterSpacing: "-0.05em", lineHeight: 1, color: mix(C.teal, "#BFE0DB", nightK) }}>
      <span style={{ display: "inline-block", ...rise(u, 60) }}>24</span><span style={{ display: "inline-block", ...rise(u7, 50) }}>/7</span>
    </div>);
    // the hours roll in two steps, morning to late evening to 03:20; the frame goes dark with them
    const HRS = ["08:00", "23:40", "03:20"];
    const st = [k(g, "night", 0.32, MOVE), k(g, "night+0.36", 0.32, MOVE)];
    const pos = st[0] + st[1], hi = Math.min(1, Math.floor(pos)), hf = pos - hi;
    const dial = (txt: string, dy: number) => <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${dy}px)`, fontVariantNumeric: "tabular-nums" }}>{txt}</div>;
    const du = k(g, "h247+0.15", 0.5);
    els.push(<div key="dial" style={{ ...tl(150, 600 + (1 - du) * 20), display: "flex", alignItems: "center", gap: 26, opacity: clamp01(du * 1.5) }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: mix(C.white, "#1C4E4A", nightK), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px " + rgba(C.teal, 0.25) }}>
        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={mix(C.teal, "#BFE0DB", nightK)} strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="9" /><path d={`M12 12 L${12 + 5.5 * Math.sin(pos * 3.1)} ${12 - 5.5 * Math.cos(pos * 3.1)}`} /><path d={`M12 12 L${12 + 3.6 * Math.sin(pos * 0.9 + 4.2)} ${12 - 3.6 * Math.cos(pos * 0.9 + 4.2)}`} />
        </svg>
      </div>
      <div style={{ position: "relative", width: 270, height: 96, overflow: "hidden", fontFamily: F.ui, fontWeight: 700, fontSize: 88, color: mix(C.ink, "#F4F2EB", nightK), letterSpacing: "-0.02em", lineHeight: "96px" }}>
        {dial(HRS[hi], -hf * 96)}{hi + 1 < HRS.length && dial(HRS[hi + 1], (1 - hf) * 96)}
      </div>
    </div>);
  }

  // ===== the lead call (2–3): answered, in conversation, then at 03:20 a new call is taken within 3 seconds; it fades when
  // the caller herself appears (4)
  const leadOut = k(g, "ask-0.3", 0.3, MOVE);
  if (t >= s("flip") && leadOut < 1) {
    const lf = leadFace(g);
    const inner = t < s("flip") + 0.4
      ? (() => { const fl = flip(g, 0); return <div style={{ transform: `scaleY(${fl.sy})` }}><CallCard a={fl.b ? "answered" : "missed"} t={t} time="14:03" caller={CALLERS[0]} /></div>; })()
      : <CallCard a={lf.a} b={lf.b} k={lf.k} t={t} ring={lf.ring} press={lf.press} caller={CALLERS[0]} />;
    b4.push(<div key="lead" style={{ ...at(leadPos[0], leadPos[1], 1, 1 - leadOut) }}>{inner}</div>);
  }

  // ===== 4 the caller asks (Mixkit 49933, Free licence); the receptionist answers; the agenda appears; "10:00" lifts out of
  // the answer and lands on tomorrow, Tuesday 10:00 (today is Monday: the "ma" pill)
  if (t > s("ask") - 0.25) {
    const cw = k(g, "ask-0.2", 0.55), q = k(g, "ask", 0.5);
    b4.push(<div key="caller" style={{ ...at(420, 560, lerp(0.94, 1, cw), clamp01(cw * 1.6)), width: 560, height: 640, borderRadius: 34, overflow: "hidden", boxShadow: SHADOW, background: C.beige }}>
      <Sequence from={T.f("ask-0.2")} layout="none"><OffthreadVideo src={staticFile("footage/caller.mp4")} muted style={{ position: "absolute", height: "100%", left: -150, top: 0, transform: `scale(${1.04 + 0.05 * clamp01((t - s("ask")) / 3.3)})` }} /></Sequence>
      <div style={{ position: "absolute", left: 24, top: 24, padding: "8px 18px", borderRadius: 99, background: "rgba(255,255,255,0.94)", fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.ink, opacity: q }}>Beller</div>
    </div>);
    b4.push(<div key="q" style={tl(760, 230)}><div style={rise(q, 34)}><Bubble who="caller" text="Hebben jullie morgen nog plek?" size={46} /></div></div>);
    const A = "Ja, morgen om 10:00 is er nog plek.";
    const a = k(g, "answer", 0.45), n = clamp01((t - s("answer") - 0.1) / 0.6) * A.length;
    b4.push(<div key="a" style={{ position: "absolute", right: 1920 - 1760, top: 0, transform: "translate3d(0px, 360px, 0)" }}><div style={rise(a, 34)}><Bubble who="ai" text={A} n={n} size={46} /></div></div>);
  }
  const AGC: P = [1270, 760], AGS = 0.78;
  const ag = k(g, "agenda", 0.5);
  const [cx1, cy1] = cell(1, 1);
  const landAt = s("fly") + 0.55, landed = clamp01((t - landAt) / 0.12);
  if (ag > 0) {
    b4.push(<div key="ag" style={{ ...at(AGC[0], AGC[1], AGS * lerp(0.95, 1, ag), clamp01(ag * 1.6)) }}>
      <Agenda>
        {landed > 0 && <div style={{ position: "absolute", left: cx1, top: cy1, transform: "translate(-50%, -50%)" }}>
          <Appt time="10:00" glow={Math.sin(Math.PI * clamp01((t - landAt) / 0.7))} />
          {t > s("check") && <div style={{ position: "absolute", right: -18, top: -18, width: 48, height: 48, borderRadius: "50%", background: C.white, boxShadow: SHADOW,
            display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, "check", 0.4)})` }}><Icon name="check" size={28} color={C.teal} stroke={3.2} /></div>}
        </div>}
      </Agenda>
    </div>);
    // the token: from the answer's "10:00" to Tuesday 10:00, on an arc; it becomes the appointment where it lands
    const fl = k(g, "fly", 0.55, MOVE);
    if (fl > 0 && landed < 1) {
      const [sx, sy] = [1204, 411];
      const ex = AGC[0] + (cx1 - AG.w / 2) * AGS, ey = AGC[1] + (cy1 - AG.h / 2) * AGS;
      const x = lerp(sx, ex, fl), y = lerp(sy, ey, fl) - Math.sin(fl * Math.PI) * 120;
      b4.push(<div key="tok" style={{ ...at(x, y, lerp(1, 1.0, fl), 1 - landed), padding: "8px 18px", borderRadius: 14, background: C.teal, color: "#fff", fontFamily: F.ui,
        fontWeight: 700, fontSize: 34, boxShadow: "0 18px 30px -16px rgba(10,79,74,0.7)", fontVariantNumeric: "tabular-nums" }}>10:00</div>);
    }
  }

  // ===== 5–6 the practice keeps working while the phone handles the calls; then the phone goes and the practice is in focus
  const PW = 440, PHH = 900;
  const w1 = k(g, "whip1", 0.6, MOVE);
  if (w1 > 0 && t < s("teal") + 0.8) {
    const open = k(g, "open6", 0.8, MOVE);
    const [fx, fy, fw, fh] = [lerp(745, 960, open), lerp(500, 540, open), lerp(1230, 1680, open), lerp(692, 945, open)];
    const focus = k(g, "focus", 0.7, MOVE), pill = k(g, "pill", 0.5);
    const n = t < s("pill") + 0.35 ? 5 : t < s("pill") + 0.7 ? 6 : 7;
    const tealIn = k(g, "teal", 0.75, SOFT);
    b5.push(<div key="prac" style={{ ...at(fx, fy), width: fw, height: fh, borderRadius: 32, overflow: "hidden", boxShadow: SHADOW, background: C.page }}>
      <Practice start={T.f("whip1")} from={DENTIST.work} blur={lerp(3, 0, focus)} zoom={1.02 + 0.04 * clamp01((t - s("whip1")) / 5.5)} />
      {pill > 0 && <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 16, padding: "14px 16px 14px 14px", borderRadius: 999, background: C.white, boxShadow: SHADOW,
        opacity: clamp01(pill * 1.6) * (1 - tealIn), transform: `translateY(${(1 - pill) * 30}px)`, fontFamily: F.ui }}>
        <Avatar size={56} />
        <div style={{ fontWeight: 600, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>Gesprekken afgehandeld</div>
        <div style={{ minWidth: 56, height: 56, borderRadius: 28, background: C.teal, color: "#fff", fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      </div>}
    </div>);
    const gone = k(g, "w:en2", 0.6, DEPART);
    const dim = k(g, "dim", 0.6, SOFT);
    const NOTES: [string, string][] = [["VoxFlow", "Afspraak di 10:00"], ["VoxFlow", "Vraag beantwoord"], ["VoxFlow", "Terugbelverzoek"]];
    const bn = k(g, "banner", 0.45), bk = k(g, "banner+0.42", 0.4, MOVE);
    // new notifications arrive at the top and push the older ones down, the way a lock screen does
    const pushed = (i: number) => NOTES.reduce((acc, _, j) => acc + (j > i ? k(g, `notes+${j * 0.26}`, 0.36, MOVE) : 0), 0);
    if (gone < 1) b5.push(<div key="phone" style={{ ...at(1540, 560 + gone * 760) }}>
      <Phone w={PW} h={PHH}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 176, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 100, color: C.ink, letterSpacing: "-0.03em" }}>10:24</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 296, textAlign: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 26, color: C.txt2 }}>maandag 12 oktober</div>
        {NOTES.map(([a2, b2], i) => {
          const u = k(g, `notes+${i * 0.26 + 0.1}`, 0.4);
          if (u <= 0) return null;
          return <div key={i} style={{ position: "absolute", left: 16, top: 0, transform: `translate3d(0px, ${360 + pushed(i) * 116 + (1 - u) * -26}px, 0) scale(${lerp(0.92, 1, u)})`, opacity: clamp01(u * 2.2 - 0.2) }}>
            <Note title={a2} sub={b2} w={PW * 0.93 - 32} /></div>;
        })}
        {bn > 0 && <div style={{ position: "absolute", left: 14, right: 14, top: 0, transform: `translate3d(0px, ${62 + (1 - bn) * -160}px, 0)`, height: 104, borderRadius: 30, background: C.tealDeep, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${-bk * 104}px)` }}>
            {[0, 1].map((f) => (
              <div key={f} style={{ height: 104, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", fontFamily: F.ui, color: "#fff" }}>
                {f === 0 ? <div style={{ position: "relative" }}><Rings t={t} r={24} color="#BFE0DB" /><div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="phone" size={24} color="#fff" /></div></div>
                  : <Avatar size={48} ring="rgba(255,255,255,0.3)" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 24, opacity: 0.85 }}>{f === 0 ? "Inkomend gesprek" : "VoxFlow neemt op"}</div>
                  <div style={{ fontWeight: 700, fontSize: 27, fontVariantNumeric: "tabular-nums" }}>{CALLERS[5]}</div>
                </div>
                {f === 1 && <Wave t={t} h={30} w={4} n={6} color="#BFE0DB" />}
              </div>
            ))}
          </div>
        </div>}
        <div style={{ position: "absolute", inset: 0, background: `rgba(22,34,31,${0.4 * dim})` }} />
      </Phone>
    </div>);
  }

  // ===== 7 on the pale-teal field: "VoxFlow werkt" + the word in the slot, each with its picture under it
  const PILL_FACE: P = [960 - 840 + 40 + 14 + 28, 540 + 472 - 40 - 42];
  const field7 = (
    <Field key="f7" g={g} from="teal" x={PILL_FACE[0]} y={PILL_FACE[1]} color={C.tealSoft}>
      {(() => {
        const kids: React.ReactNode[] = [];
        const out7 = k(g, "cream", 0.35, DEPART);
        kids.push(<div key="wm7" style={{ ...tl(160, 214), opacity: 1 - out7 }}><Wordmark h={124} k={k(g, "werkt", 0.6, MOVE)} /></div>);
        const wk = k(g, "w:werkt-0.12", 0.45);
        kids.push(<div key="werkt" style={{ ...tl(452, 244), fontFamily: F.display, fontWeight: 800, fontSize: 104, letterSpacing: "-0.035em", lineHeight: 1, color: C.ink, opacity: 1 - out7 }}>
          <div style={rise(wk, 28)}>werkt</div></div>);
        // the slot: one word at a time; the old one fades where it is, the new one lands with a short drop
        const SLOT: [string, string][] = [["professioneel,", "prof"], ["snel,", "snel"], ["zonder pauzes.", "zonder"]];
        const inn = (i: number) => k(g, `${SLOT[i][1]}-0.02`, 0.38, ARRIVE);
        const gone = (i: number) => (i + 1 < SLOT.length ? k(g, `${SLOT[i + 1][1]}-0.2`, 0.18, MOVE) : 0);
        SLOT.forEach(([w], i) => {
          const u = inn(i), o = gone(i);
          if (u <= 0 || o >= 1) return;
          kids.push(<div key={`sl${i}`} style={{ ...tl(160, 414), fontFamily: F.display, fontWeight: 800, fontSize: 130, letterSpacing: "-0.04em", lineHeight: 1, color: C.teal, whiteSpace: "nowrap",
            opacity: clamp01(u * 1.8) * (1 - o) * (1 - out7) }}>
            <div style={{ transform: `translateY(${(1 - u) * -30}px)`, filter: u < 1 ? `blur(${(1 - u) * 6}px)` : undefined }}>
              {i === 2 ? <>zonder <span style={{ position: "relative", color: C.tealDeep }}>pauzes.
                <span style={{ position: "absolute", left: -6, right: -6, top: "54%", height: 12, borderRadius: 9, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${k(g, "strike", 0.35, MOVE)}) rotate(-2deg)` }} /></span></> : w}
            </div>
          </div>);
        });
        // the customer on the other end (the caller of 4, Mixkit 49920, Free licence): she is helped, at ease
        const cu = k(g, "werkt+0.15", 0.6);
        if (cu > 0) kids.push(<div key="cust" style={{ ...at(1560, 540, lerp(0.95, 1, cu), clamp01(cu * 1.6) * (1 - out7)), width: 480, height: 600, borderRadius: 34, overflow: "hidden", boxShadow: SHADOW, background: C.beige }}>
          <Sequence from={T.f("werkt")} layout="none"><OffthreadVideo src={staticFile("footage/customer.mp4")} muted style={{ position: "absolute", height: 600, left: -347, top: 0, transform: `scale(${1.03 + 0.05 * clamp01((t - s("werkt")) / 3.7)})` }} /></Sequence>
          <div style={{ position: "absolute", left: 22, top: 22, padding: "8px 18px", borderRadius: 99, background: "rgba(255,255,255,0.94)", fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.ink }}>Beller</div>
        </div>);
        // the pictures, under the word: the receptionist greets as soon as "VoxFlow werkt" is said
        const PICS: [string, string | null][] = [["greet", "snel"], ["snel+0.05", "zonder"], ["zonder+0.05", null]];
        const PIC = (i: number, node: React.ReactNode) => {
          const u = k(g, PICS[i][0], 0.42), o = PICS[i][1] ? k(g, `${PICS[i][1]}-0.2`, 0.18, MOVE) : 0;
          if (u <= 0 || o >= 1) return;
          kids.push(<div key={`pic${i}`} style={{ ...tl(170, 640), opacity: (1 - o) * (1 - out7) }}><div style={rise(u, 30)}>{node}</div></div>);
        };
        const G = "Goedemiddag, waarmee kan ik je helpen?";
        const gn = clamp01((t - s("greet") - 0.12) / 0.7) * G.length;
        PIC(0, <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <Avatar size={82} />
          <div style={{ width: 560, height: 158, boxSizing: "border-box", padding: "28px 34px", borderRadius: 36, borderBottomLeftRadius: 8, background: C.teal, color: "#fff", fontFamily: F.ui, fontWeight: 500, fontSize: 40, lineHeight: 1.25 }}>
            {G.slice(0, Math.floor(gn))}{gn < G.length && <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 0.9 : 0.2 }}>|</span>}</div>
        </div>);
        const ring = k(g, "snel+0.1", 0.7, MOVE);
        PIC(1, <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ position: "relative", width: 250, height: 250 }}>
            <svg width={250} height={250} viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#C5DDD9" strokeWidth="2.6" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={C.teal} strokeWidth="2.6" strokeLinecap="round" strokeDasharray={`${94.2 * ring} 94.2`} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 800, color: C.teal, letterSpacing: "-0.04em" }}>
              <span style={{ fontSize: 82 }}>&lt;3</span><span style={{ fontSize: 30, marginLeft: 4, marginTop: 30 }}>sec</span></div>
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 38, color: C.tealDeep, whiteSpace: "nowrap" }}>binnen 3 seconden opgenomen</div>
        </div>);
        PIC(2, <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22, paddingTop: 50 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d, i) => {
              const on = k(g, `zonder+${0.12 + i * 0.07}`, 0.25);
              return <div key={d} style={{ width: 62, height: 62, borderRadius: "50%", background: mix("#FFFFFF", C.teal, on), color: mix(C.teal, "#FFFFFF", on), boxShadow: `0 0 0 2px ${rgba(C.teal, 0.3)}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 24 }}>{d}</div>;
            })}
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 38, color: C.tealDeep }}>7 dagen per week, ook ’s nachts</div>
        </div>);
        return kids;
      })()}
    </Field>
  );

  // ===== 8 cream grows back out of "zo": five calls at once, all answered on "direct"; the middle one opens into the
  // customer's phone (the site's photo); 9 the week fills up, then next week; 10 an appointment becomes the button
  const ZO: P = [170 + 6 * 74 + 31, 640 + 50 + 31];
  const CALLS: P[] = [[560, 236], [790, 386], [1020, 536], [1250, 686], [1480, 836]];
  const field8 = (
    <Field key="f8" g={g} from="cream" x={ZO[0]} y={ZO[1]} color={C.page}>
      {(() => {
        const kids: React.ReactNode[] = [];
        const ph8 = k(g, "photo", 0.75, MOVE);
        const w2 = k(g, "whip2", 0.6, MOVE);
        const g8: React.ReactNode[] = [];
        const card = (i: number) => {
          const [x, y] = CALLS[i];
          const u = k(g, `calls+${i * 0.15}`, 0.45);
          if (u <= 0) return;
          const fl = k(g, `direct+${i * 0.03}`, 0.3, MOVE);
          const o = clamp01(u * 1.7) * (i === 2 ? 1 - k(g, "photo+0.35", 0.4) : 1 - k(g, "photo", 0.3));
          if (o <= 0.001) return;
          g8.push(<div key={`c${i}`} style={{ ...at(x, y, lerp(0.94, 1, u), o) }}>
            <div style={{ transform: `scaleY(${Math.abs(Math.cos(fl * Math.PI))})` }}><CallCard a={fl > 0.5 ? "talk" : "incoming"} t={t + i * 0.37} ring={1} caller={CALLERS[(i + 1) % CALLERS.length]} /></div>
          </div>);
        };
        [0, 1, 3, 4].forEach(card);                                  // the others recede under the photo
        if (ph8 > 0) {
          const [x, y] = CALLS[2];
          const cx = lerp(x, 960, ph8), cy = lerp(y, 540, ph8);
          const ww8 = lerp(600, 1240, ph8), hh8 = lerp(116, 832, ph8);
          const chip = k(g, "sms", 0.5);
          g8.push(<div key="photo" style={{ ...at(cx, cy), width: ww8, height: hh8, borderRadius: lerp(26, 34, ph8), overflow: "hidden", boxShadow: SHADOW, background: C.white }}>
            <Img src={staticFile("img/control-followup-sms-photo.png")} style={{ position: "absolute", width: 1240, height: 832, left: (ww8 - 1240) / 2, top: (hh8 - 832) / 2,
              transform: `scale(${1.0 + 0.06 * clamp01((t - s("photo")) / 1.6)})`, opacity: clamp01(ph8 * 1.5) }} />
            {chip > 0 && <div style={{ position: "absolute", left: 36, bottom: 36, display: "flex", alignItems: "center", gap: 14, padding: "14px 26px 14px 14px", borderRadius: 999, background: C.white,
              boxShadow: SHADOW, ...rise(chip, 30), fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={26} color="#fff" stroke={3} /></div>
              Afspraakbevestiging verstuurd</div>}
          </div>);
        }
        card(2);                                                     // the middle call stays on top while its window grows
        if (w2 < 1) kids.push(<div key="g8" style={{ position: "absolute", inset: 0, transform: `translate3d(${-2100 * w2}px, 0, 0)` }}>{g8}</div>);

        if (w2 > 0) {
          const back = k(g, "cta", 0.7, MOVE);
          const CELLS1: [number, number][] = [[0, 4], [4, 1], [3, 2], [1, 3], [2, 3], [4, 0]];
          const CELLS2: [number, number][] = [[1, 0], [3, 1], [0, 2], [2, 3], [4, 2]];
          const HR = ["09:00", "10:00", "11:00", "12:00", "13:00"];
          const W1 = CELLS1.map(([d, h], i) => [d, h, HR[h], s("w:meer2") - 0.1 + i * 0.11] as [number, number, string, number]);
          const W2 = CELLS2.map(([d, h], i) => [d, h, HR[h], s("w:ieder") + 0.42 + i * 0.1] as [number, number, string, number]);
          const BUSY2: [number, number][] = [[0, 0], [2, 1], [4, 0], [1, 2], [3, 3]];
          const turn = k(g, "w:ieder-0.04", 0.46, MOVE);
          const LIFT = 3;                                            // next week's Wednesday 12:00 becomes the button
          const appts = (list: [number, number, string, number][], second: boolean, extra?: [number, number, string, number]) =>
            [...(extra ? [extra] : []), ...list].map(([d, h, tm, at0], i) => {
              const u = at0 >= 0 ? k(g, at0, 0.42) : 1;
              if (u <= 0 || (second && i === LIFT && t > s("cta"))) return null;
              const [cx, cy] = cell(d, h);
              return <div key={i} style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%) translateY(${(1 - u) * -90}px) scale(${lerp(1.12, 1, u)})`, opacity: clamp01(u * 1.7), filter: u < 1 ? `blur(${(1 - u) * 6}px)` : undefined }}>
                <Appt time={tm} glow={at0 >= 0 ? Math.sin(Math.PI * clamp01((t - at0) / 0.6)) : 0} /></div>;
            });
          kids.push(<div key="ag9" style={{ ...at(960 + 2100 * (1 - w2), 560, lerp(1, 0.92, back), 1 - back), width: AG.w, height: AG.h, borderRadius: 34, overflow: "hidden", boxShadow: SHADOW,
            filter: back > 0 ? `blur(${back * 8}px)` : undefined }}>
            <div style={{ display: "flex", gap: 60, transform: `translateX(${-turn * (AG.w + 60)}px)` }}>
              <Agenda flat>{appts(W1, false, [1, 1, "10:00", -1])}</Agenda>
              <Agenda flat label="volgende week" hilite={-1} busy={BUSY2}>{appts(W2, true)}</Agenda>
            </div>
          </div>);
          // the lifted appointment travels to the centre and becomes "Start gratis"
          if (t > s("cta")) {
            const [cx, cy] = cell(W2[LIFT][0], W2[LIFT][1]);
            const sx = 960 + (cx - AG.w / 2), sy = 560 + (cy - AG.h / 2);
            const mv = k(g, "cta+0.15", 0.8, MOVE), mo = k(g, "cta+0.35", 0.5, MOVE);
            const press = clamp01((t - s("press")) / 0.3);
            kids.push(<div key="btn" style={{ ...at(lerp(sx, 960, mv), lerp(sy, 700, mv) - Math.sin(mv * Math.PI) * 40, 1) }}>
              <div style={{ position: "relative" }}>
                <div style={{ opacity: 1 - mo, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}><Appt time="12:00" /></div>
                <div style={{ opacity: mo, transform: `scale(${lerp(0.55, 1, mo)})` }}><Button size={44} press={press} /></div>
              </div>
            </div>);
            const mk2 = k(g, "mark", 0.5, MOVE);
            if (mk2 > 0) kids.push(<div key="wm10" style={{ ...at(960, 400, 1, clamp01(mk2 * 4)) }}><Wordmark h={150} k={Math.min(1, mk2 * 1.15)} /></div>);
            const TAG: [string, boolean][] = [["De", false], ["AI-receptionist", true], ["die", false], ["nooit", false], ["een", false], ["oproep", false], ["mist.", false]];
            kids.push(<div key="tag" style={{ ...tl(0, 528), width: 1920, display: "flex", justifyContent: "center", gap: 16, fontFamily: F.display, fontWeight: 800, fontSize: 58, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
              {TAG.map(([w, acc], i) => <span key={i} style={{ display: "inline-block", color: acc ? C.teal : C.ink, ...rise(k(g, `tagline+${i * 0.07}`, 0.5), 22) }}>{w}</span>)}
            </div>);
            const url = k(g, "cta+0.9", 0.5);
            kids.push(<div key="url" style={{ ...tl(0, 796), width: 1920, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.txt2 }}><div style={rise(url, 16)}>voxflow.nl</div></div>);
          }
        }
        return kids;
      })()}
    </Field>
  );

  // ===== the layers in story order: 1–3, the white field grown out of the answered call, 4 (whips out) and 5–6 (whips in),
  // the pale-teal field out of the receptionist's face (7), the cream field out of the last day (8–10)
  return (
    <>
      <div style={{ position: "absolute", inset: -200, background: mix(C.page, C.night, nightK * 0.92) }} />
      {els}
      <Field key="fw" g={g} from="white" x={leadPos[0]} y={leadPos[1]} color={C.white} />
      {t < s("whip1") + 0.65 && <div style={{ position: "absolute", inset: 0, transform: `translate3d(${-2100 * w1}px, 0, 0)` }}>{b4}</div>}
      {w1 > 0 && <div style={{ position: "absolute", inset: 0, transform: `translate3d(${2100 * (1 - w1)}px, 0, 0)` }}>{b5}</div>}
      {field7}
      {field8}
    </>
  );
};
