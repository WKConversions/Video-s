// The film on one stage. Every object persists and changes state on its word; colour fields grow out of objects;
// the holds keep working (a call ringing, a voice talking, a clock rolling, the practice at work), nothing drifts for
// the sake of moving.
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

// ---------------------------------------------------------------- the lead call: one card from the first ring to the conversation
const leadFace = (g: number): { a: CallState; b?: CallState; k: number; time?: string; ring: number; press: number } => {
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
  const els: React.ReactNode[] = [];

  // ===== the window on the practice (1) that becomes the receptionist's square (2) and glides left (3)
  const [wx, wy, ww, wh, wr] = track(g, [
    ["open", 1370, 395, 940, 529, 30], ["square", 1370, 395, 940, 529, 30], ["square+0.75", 1380, 520, 560, 640, 34, MOVE],
    ["glide", 1380, 520, 560, 640, 34], ["glide+0.8", 560, 520, 560, 640, 34, MOVE],
  ]);
  const win = life(g, "open", "white+0.5", 0.6, 0.01);
  const teal = k(g, "square+0.35", 0.8, SOFT);               // the footage gives way to the pale teal of the site's portrait
  const nightK = k(g, "night", 0.75, SOFT) * (1 - k(g, "white", 0.5));
  const square = (inner: boolean) => (
    <div style={{ ...at(wx, wy, lerp(0.92, 1, win.u), win.o), width: ww, height: wh, borderRadius: wr, overflow: "hidden", background: C.tealSoft,
      boxShadow: inner ? undefined : teal < 1 ? SHADOW : undefined }}>
      {t < s("square") + 1.2 && <Practice start={0} from={DENTIST.hook} fade={1 - teal} zoom={1.0 + 0.03 * clamp01(t / 4.4)} />}
    </div>
  );
  if (win.on && t < s("white") + 0.8) els.push(<React.Fragment key="win">{square(false)}</React.Fragment>);

  // the receptionist rises out of the square on "iemand", then travels with it
  const rise = k(g, "rise", 0.7);
  if (rise > 0 && t < s("white") + 0.8) {
    const aw = 600, ah = aw * (1152 / 928);
    els.push(
      <div key="assistant" style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${wx - ww / 2 - 120}px, ${wy - wh / 2 - 220}px, 0)`, width: ww + 240, height: wh + 220, overflow: "hidden",
        clipPath: "inset(0 0 0 0 round 0 0 34px 34px)" }}>
        <Img src={staticFile("img/assistant.png")} style={{ position: "absolute", width: aw, height: ah, left: (ww + 240) / 2 - aw / 2 + 10,
          top: wh + 220 - ah + 6 + (1 - rise) * 150, opacity: clamp01(rise * 1.6) }} />
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
      <div key={`h${li}`} style={{ position: "absolute", left: 110, top: 292 + li * 112, display: "flex", gap: 26, fontFamily: F.display, fontWeight: 800, fontSize: 100, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap" }}>
        {ln.map(([w, lab, col], wi) => {
          const u = k(g, `${lab}-0.12`, 0.45);
          const o = k(g, `turn+${(li * 3 + wi) * 0.025}`, 0.32, DEPART);
          return <span key={wi} style={{ display: "inline-block", color: col ?? C.ink, opacity: clamp01(u * 1.7) * (1 - o),
            transform: `translateY(${((1 - u) * 0.3 - o * 0.35) * 100}px)`, filter: u < 1 || o > 0 ? `blur(${(1 - u) * 8 + o * 8}px)` : undefined }}>{w}</span>;
        })}
      </div>,
    ));
  }

  // ===== 2 the turn: the wordmark and "always reachable"
  const mk = life(g, "turn+0.25", "glide-0.15", 0.6, 0.4);
  if (mk.on) {
    els.push(<div key="wm" style={{ ...at(300, 430 - 30 * mk.e, 1, 1 - mk.e), filter: mk.e > 0 ? `blur(${mk.e * 6}px)` : undefined }}><Wordmark h={150} k={k(g, "turn+0.25", 0.65, MOVE)} /></div>);
    const ch = life(g, "always", "glide-0.15", 0.45, 0.4);
    if (ch.on) els.push(<div key="chip" style={{ position: "absolute", left: 140, top: 560, opacity: ch.o, transform: `translateY(${(1 - ch.u) * 24 - ch.e * 30}px)` }}><Chip text="Altijd bereikbaar" size={24} live={0.5 + 0.5 * Math.sin(t * 5)} /></div>);
  }

  // ===== the calls (1–2): the first call rings and is missed; then missed calls keep coming in at the top of the list
  // and push the older ones down (the day goes by); on "staat" the visible ones flip to answered, then fold into one card.
  const fold = k(g, "fold", 0.5, MOVE);
  const LEAD: P = [1050, 640], PITCH = 132;
  const leadPos = track(g, [
    ["open", LEAD[0], LEAD[1], 1], ["fold", LEAD[0], LEAD[1], 1], ["fold+0.5", 1320, 840, 1, MOVE],
    ["glide", 1320, 840, 1], ["glide+0.8", 500, 840, 1, MOVE],
    ["white", 500, 840, 1], ["white+0.7", 960, 140, 0.8, MOVE],
  ]);
  const CALLS1: [number, string][] = [[s("ring"), "09:12"], [0, "10:05"], [0, "11:20"], [0, "12:40"], [0, "14:03"]];
  // the feed scrolls down continuously from "telefoontje" to the end of "meer" (eased in and out as one move)
  const feed = k(g, "w:telefoontje-0.15", 1.45, MOVE) * (CALLS1.length - 1);
  const down = (j: number) => feed - (j === 0 ? 0 : j);
  if (t < s("fold") + 0.5) CALLS1.forEach(([a1, time], j) => {
    const top = j === CALLS1.length - 1;
    if (top && t >= s("flip")) return;                  // from the flip on, the top call is the lead card
    const slot = down(j);
    const u = j === 0 ? k(g, a1, 0.75) : clamp01(slot + 1);
    if (u <= 0 || slot > 3.6) return;
    const fl = flip(g, Math.round(slot));
    const x0 = j === 0 ? lerp(2350, LEAD[0], u) : LEAD[0], y0 = LEAD[1] + Math.max(slot, -1) * PITCH + (j === 0 ? (1 - u) * 360 : 0);
    const x = lerp(x0, 1320, fold), y = lerp(y0, 840, fold);
    const face: CallState = t >= s("flip") ? (fl.b ? "answered" : "missed") : "missed";
    els.push(<div key={`st${j}`} style={{ ...at(x, y, j === 0 ? 1 : lerp(0.94, 1, u), (j === 0 ? clamp01(u * 1.6) : clamp01(u * 1.6 - 0.25)) * (1 - fold)) }}>
      <div style={{ transform: `scaleY(${t >= s("flip") ? fl.sy : 1})` }}>
        {j === 0 && t < s("flip") ? <CallCard a="incoming" b="missed" k={k(g, "missed", 0.4, MOVE)} t={t} time={time} ring={1 - k(g, "missed", 0.3)} />
          : <CallCard a={face} t={t} time={time} />}
      </div>
    </div>);
  });

  // ===== 3 the words: "Onze slimme AI-receptionist", then 24/7 while the hours roll through the night
  if (t > s("words3") && t < s("h247")) {
    const out = k(g, "h247-0.32", 0.3, DEPART);
    const W3: [string, string, number, string][] = [["Onze", "w:onze", 0, C.ink], ["slimme", "w:slimme", 0, C.ink], ["AI-receptionist", "w:ai", 1, C.teal]];
    W3.forEach(([w, lab, line, col], i) => {
      const u = k(g, `${lab}-0.12`, 0.45);
      els.push(<div key={`w3${i}`} style={{ position: "absolute", left: line === 0 ? 1010 + (i === 1 ? 250 : 0) : 1010, top: line === 0 ? 340 : 452, fontFamily: F.display, fontWeight: 800,
        fontSize: line === 0 ? 90 : 94, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap", color: col, opacity: clamp01(u * 1.7) * (1 - out),
        transform: `translateY(${((1 - u) * 0.3 - out * 0.4) * 100}px)`, filter: u < 1 || out > 0 ? `blur(${(1 - u) * 8 + out * 8}px)` : undefined }}>
        {w}
        {line === 1 && <div style={{ position: "absolute", left: 4, right: 4, bottom: -18, height: 8, borderRadius: 8, background: C.teal, transformOrigin: "0 50%", transform: `scaleX(${k(g, "w:receptionist", 0.5, MOVE)})` }} />}
      </div>);
    });
  }
  const t247 = life(g, "h247", "white+0.4", 0.55, 0.01);
  if (t247.on && t < s("white") + 0.8) {
    els.push(<div key="247" style={{ position: "absolute", left: 1000, top: 250, fontFamily: F.display, fontWeight: 800, fontSize: 300, letterSpacing: "-0.05em", lineHeight: 1,
      color: mix(C.teal, "#BFE0DB", nightK), opacity: clamp01(t247.u * 1.6), transform: `translateY(${(1 - t247.u) * 70}px)`, filter: t247.u < 1 ? `blur(${(1 - t247.u) * 10}px)` : undefined }}>
      24<span style={{ display: "inline-block", opacity: clamp01(k(g, "w:zeven-0.12", 0.4) * 1.7), transform: `translateY(${(1 - k(g, "w:zeven-0.12", 0.4)) * 50}px)` }}>/7</span>
    </div>);
    // the hours roll from morning through the night; the frame goes dark with them; at 03:20 a call comes in
    const HRS = ["08:00", "12:30", "17:45", "21:15", "23:40", "03:20"];
    const hk = clamp01((t - (s("night") - 0.05)) / 0.62) * (HRS.length - 1);
    const hi = Math.floor(hk), hf = MOVE(hk - hi);
    const dial = (txt: string, dy: number, o: number) => <div style={{ position: "absolute", left: 0, top: dy, opacity: o, fontVariantNumeric: "tabular-nums" }}>{txt}</div>;
    els.push(<div key="dial" style={{ position: "absolute", left: 1010, top: 600, display: "flex", alignItems: "center", gap: 26, opacity: clamp01(k(g, "h247+0.15", 0.5) * 1.5) }}>
      <div style={{ width: 74, height: 74, borderRadius: "50%", background: mix(C.white, "#1C4E4A", nightK), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 2px " + rgba(C.teal, 0.25) }}>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={mix(C.teal, "#BFE0DB", nightK)} strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="9" /><path d={`M12 12 L${12 + 5.5 * Math.sin(hk * 1.9)} ${12 - 5.5 * Math.cos(hk * 1.9)}`} /><path d={`M12 12 L${12 + 3.6 * Math.sin(hk * 0.16 + 4.2)} ${12 - 3.6 * Math.cos(hk * 0.16 + 4.2)}`} />
        </svg>
      </div>
      <div style={{ position: "relative", width: 260, height: 92, overflow: "hidden", fontFamily: F.ui, fontWeight: 700, fontSize: 84, color: mix(C.ink, "#F4F2EB", nightK), letterSpacing: "-0.02em", lineHeight: "92px" }}>
        {dial(HRS[hi], -hf * 92, 1)}{hi + 1 < HRS.length && dial(HRS[hi + 1], (1 - hf) * 92, 1)}
      </div>
    </div>);
  }

  // ===== 4 the conversation (in a group that steps aside for the agenda, then whips out)
  const aside = k(g, "agenda", 0.7, MOVE);
  const whip1 = k(g, "whip1", 0.36, DEPART);
  const convoT = `translate(${-whip1 * 2300}px, 0px) translate(40px, 120px) scale(${lerp(1, 0.62, aside)}) translate(-40px, -120px)`;
  const convo: React.ReactNode[] = [];
  const lf = leadFace(g);
  if (t >= s("flip")) convo.push(<div key="lead" style={{ ...at(leadPos[0], leadPos[1], leadPos[2]) }}>
    {(() => {
      if (t < s("flip") + 0.4) {
        const fl = flip(g, 0);
        return <div style={{ transform: `scaleY(${fl.sy})` }}><CallCard a={fl.b ? "answered" : "missed"} t={t} time="14:03" /></div>;
      }
      return <CallCard a={lf.a} b={lf.b} k={lf.k} t={t} time={lf.time} ring={lf.ring} press={lf.press} />;
    })()}
  </div>);
  if (t > s("ask") - 0.25) {
    const q = k(g, "ask", 0.5), cw = k(g, "ask-0.2", 0.6);
    // the caller herself (Mixkit 49933, Free licence): she asks, the receptionist answers
    convo.push(<div key="caller" style={{ ...at(420, 560, lerp(0.9, 1, cw), clamp01(cw * 1.5)), width: 560, height: 640, borderRadius: 34, overflow: "hidden", boxShadow: SHADOW, background: C.beige }}>
      <Sequence from={T.f("ask-0.2")} layout="none"><OffthreadVideo src={staticFile("footage/caller.mp4")} muted style={{ position: "absolute", height: "100%", left: -150, top: 0, transform: `scale(${1.04 + 0.04 * clamp01((t - s("ask")) / 3.5)})` }} /></Sequence>
      <div style={{ position: "absolute", left: 22, top: 22, padding: "8px 16px", borderRadius: 99, background: "rgba(255,255,255,0.92)", fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.ink, opacity: q }}>Beller</div>
    </div>);
    convo.push(<div key="q" style={{ position: "absolute", left: 760, top: 330, opacity: clamp01(q * 1.6), transform: `translateY(${(1 - q) * 40}px)` }}>
      <Bubble who="caller" text="Hebben jullie morgen nog plek?" size={46} /></div>);
    const A = "Ja, morgen om 10:00 is er nog plek.";
    const a = k(g, "answer", 0.45), n = clamp01((t - s("answer") - 0.15) / 1.05) * A.length;
    convo.push(<div key="a" style={{ position: "absolute", right: 1920 - 1760, top: 520, opacity: clamp01(a * 1.6), transform: `translateY(${(1 - a) * 40}px)` }}>
      <Bubble who="ai" text={A} n={n} size={46} /></div>);
  }
  if (t < s("whip1") + 0.45) els.push(<div key="convo" style={{ position: "absolute", inset: 0, transform: convoT, transformOrigin: "0 0" }}>{convo}</div>);

  // the agenda arrives; "10:00" lifts out of the answer and lands on Tuesday as the appointment
  const AGC: P = [1290, 720], AGS = 0.78;
  const ag = k(g, "agenda", 0.75);
  if (ag > 0 && t < s("whip1") + 0.45) {
    const ax = lerp(2500, AGC[0], ag) - whip1 * 2300;
    const [cx, cy] = cell(1, 1);
    const landed = k(g, "land", 0.35);
    els.push(<div key="ag" style={{ ...at(ax, AGC[1], AGS) }}>
      <Agenda>
        {landed > 0 && <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%)` }}>
          <Appt time="10:00" glow={Math.sin(Math.PI * clamp01((t - s("land")) / 0.7))} />
          {t > s("check") && <div style={{ position: "absolute", right: -16, top: -16, width: 44, height: 44, borderRadius: "50%", background: C.white, boxShadow: SHADOW,
            display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, "check", 0.4)})` }}><Icon name="check" size={26} color={C.teal} stroke={3.2} /></div>}
        </div>}
      </Agenda>
    </div>);
    // the token's flight: from the answer's "10:00" (in the stepped-aside conversation) to the cell
    const fl = k(g, "fly", 0.62, MOVE);
    if (fl > 0 && landed < 1) {
      const sx = 40 + (1204 - 40) * 0.62, sy = 120 + (571 - 120) * 0.62;
      const ex = AGC[0] + (cx - AG.w / 2) * AGS, ey = AGC[1] + (cy - AG.h / 2) * AGS;
      const x = lerp(sx, ex, fl), y = lerp(sy, ey, fl) - Math.sin(fl * Math.PI) * 170;
      els.push(<div key="tok" style={{ ...at(x, y, lerp(1, AGS, fl), 1 - landed), padding: "8px 18px", borderRadius: 14, background: C.teal, color: "#fff", fontFamily: F.ui,
        fontWeight: 700, fontSize: 34, boxShadow: "0 18px 30px -16px rgba(10,79,74,0.7)", fontVariantNumeric: "tabular-nums" }}>10:00</div>);
    }
  }

  // ===== 5–6 the practice keeps working while the phone handles the calls; then the phone goes and the practice is in focus
  // The window on the practice comes in on a speed-matched whip with the phone beside it (soft focus: the phone is the
  // subject); what VoxFlow handled stacks up on the phone, a call is taken, the screen dims; "en kun je volledig":
  // the phone goes, the window opens up; "focussen": the focus pulls to the practice; "bedrijf": the calls handled.
  const PW = 440, PHH = 900;
  const ph = k(g, "whip1+0.1", 0.6);
  if (ph > 0 && t < s("teal") + 0.8) {
    const open = k(g, "open6", 0.9, MOVE);
    const [fx, fy, fw, fh] = [lerp(745, 960, open), lerp(500, 540, open), lerp(1230, 1680, open), lerp(692, 945, open)];
    const focus = k(g, "focus", 0.7, MOVE);
    const pill = k(g, "pill", 0.5);
    const n = t < s("pill") + 0.35 ? 1 : t < s("pill") + 0.7 ? 2 : 3;
    const tealIn = k(g, "teal", 0.75, SOFT);
    els.push(<div key="prac" style={{ ...at(lerp(2700, fx, ph), fy), width: fw, height: fh, borderRadius: 32, overflow: "hidden", boxShadow: SHADOW, background: C.page }}>
      <Practice start={T.f("whip1")} from={DENTIST.work} blur={lerp(5, 0, focus)} zoom={1.02 + 0.04 * clamp01((t - s("whip1")) / 5.5)} />
      {pill > 0 && <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 16, padding: "14px 16px 14px 14px", borderRadius: 999, background: C.white, boxShadow: SHADOW,
        opacity: clamp01(pill * 1.6) * (1 - tealIn), transform: `translateY(${(1 - pill) * 40}px)`, fontFamily: F.ui }}>
        <Avatar size={56} />
        <div style={{ fontWeight: 600, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>Gesprekken afgehandeld</div>
        <div style={{ minWidth: 52, height: 52, borderRadius: 26, background: C.teal, color: "#fff", fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      </div>}
    </div>);
    const gone = k(g, "w:en2", 0.6, DEPART);
    const dim = k(g, "dim", 0.6, SOFT);
    const NOTES: [string, string][] = [["VoxFlow", "Afspraak ingepland · di 10:00"], ["VoxFlow", "Vraag beantwoord"], ["VoxFlow", "Terugbelverzoek genoteerd"],
      ["VoxFlow", "Doorverbonden met collega"], ["VoxFlow", "Afspraakbevestiging verstuurd"]];
    const bn = k(g, "banner", 0.45), bk = k(g, "banner+0.42", 0.4, MOVE);
    // new notifications arrive at the top and push the older ones down, the way a lock screen does
    const pushed = (i: number) => NOTES.reduce((acc, _, j) => acc + (j > i ? k(g, `notes+${j * 0.17}`, 0.36, MOVE) : 0), 0);
    if (gone < 1) els.push(<div key="phone" style={{ ...at(lerp(2900, 1540, ph) + gone * 120, 560 + gone * 760) }}>
      <Phone w={PW} h={PHH}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 176, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 100, color: C.ink, letterSpacing: "-0.03em" }}>10:24</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 296, textAlign: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 23, color: C.txt2 }}>dinsdag 14 oktober</div>
        {NOTES.map(([a, b2], i) => {
          const u = k(g, `notes+${i * 0.17 + 0.1}`, 0.4);
          if (u <= 0) return null;
          return <div key={i} style={{ position: "absolute", left: 16, top: 360 + pushed(i) * 104, opacity: clamp01(u * 2.2 - 0.2), transform: `translateY(${(1 - u) * -30}px) scale(${lerp(0.92, 1, u)})` }}>
            <Note title={a} sub={b2} w={PW * 0.93 - 32} /></div>;
        })}
        {bn > 0 && <div style={{ position: "absolute", left: 14, right: 14, top: 62 + (1 - bn) * -160, height: 100, borderRadius: 30, background: C.tealDeep, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${-bk * 100}px)` }}>
            {[0, 1].map((f) => (
              <div key={f} style={{ height: 100, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", fontFamily: F.ui, color: "#fff" }}>
                {f === 0 ? <div style={{ position: "relative" }}><Rings t={t} r={23} color="#BFE0DB" /><div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="phone" size={22} color="#fff" /></div></div>
                  : <Avatar size={46} ring="rgba(255,255,255,0.3)" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, opacity: 0.8 }}>{f === 0 ? "Inkomend gesprek" : "VoxFlow neemt op"}</div>
                  <div style={{ fontWeight: 700, fontSize: 24 }}>06 12 34 56 78</div>
                </div>
                {f === 1 && <Wave t={t} h={30} w={4} n={6} color="#BFE0DB" />}
              </div>
            ))}
          </div>
        </div>}
        <div style={{ position: "absolute", inset: 0, background: `rgba(22,34,31,${0.55 * dim})` }} />
      </Phone>
    </div>);
  }

  // ===== 7 on the pale-teal field: "VoxFlow werkt" + the slot word, each with its picture
  const PILL_FACE: P = [960 - 840 + 40 + 14 + 28, 540 + 472 - 40 - 42];
  const field7 = (
    <Field key="f7" g={g} from="teal" x={PILL_FACE[0]} y={PILL_FACE[1]} color={C.tealSoft}>
      {(() => {
        const kids: React.ReactNode[] = [];
        const out7 = k(g, "cream", 0.35, DEPART);
        kids.push(<div key="wm7" style={{ position: "absolute", left: 160, top: 214, opacity: 1 - out7 }}><Wordmark h={124} k={k(g, "werkt", 0.6, MOVE)} /></div>);
        const wk = k(g, "w:werkt-0.12", 0.45);
        kids.push(<div key="werkt" style={{ position: "absolute", left: 452, top: 244, fontFamily: F.display, fontWeight: 800, fontSize: 104, letterSpacing: "-0.035em", lineHeight: 1, color: C.ink,
          opacity: clamp01(wk * 1.7) * (1 - out7), transform: `translateY(${(1 - wk) * 28}px)`, filter: wk < 1 ? `blur(${(1 - wk) * 8}px)` : undefined }}>werkt</div>);
        // the slot: each word drops through (out down, in from above), on its word
        const SLOT: [string, string, string][] = [["professioneel,", "prof", "w:professioneel"], ["snel,", "snel", "w:snel"], ["zonder pauzes.", "zonder", "w:zonder"]];
        // one drop-through move: the old word and the new one travel together, one slot height apart
        const drop = (i: number) => (i === 0 ? k(g, "prof", 0.5, ARRIVE) : k(g, `${SLOT[i][1]}-0.05`, 0.42, MOVE));
        SLOT.forEach(([w], i) => {
          const inn = drop(i), nxt = i + 1 < SLOT.length ? drop(i + 1) : 0;
          if (inn <= 0 || nxt >= 1) return;
          const y = (1 - inn) * -190 + nxt * 190;
          kids.push(<div key={`sl${i}`} style={{ position: "absolute", left: 150, top: 390, height: 190, width: 1260, overflow: "hidden", opacity: 1 - out7 }}>
            <div style={{ position: "absolute", left: 10, top: 18, transform: `translateY(${y}px)`, fontFamily: F.display, fontWeight: 800, fontSize: 146, letterSpacing: "-0.04em", lineHeight: 1,
              color: C.teal, whiteSpace: "nowrap", filter: (inn < 1 || nxt > 0) ? `blur(${(1 - inn) * 6 + nxt * 6}px)` : undefined }}>
              {i === 2 ? <>zonder <span style={{ position: "relative", color: C.tealDeep }}>pauzes.
                <span style={{ position: "absolute", left: -6, right: -6, top: "54%", height: 12, borderRadius: 9, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${k(g, "strike", 0.35, MOVE)}) rotate(-2deg)` }} /></span></> : w}
            </div>
          </div>);
        });
        // the pictures, in one place on the right, dropping through with their words
        const PIC = (i: number, _lab: string, node: React.ReactNode) => {
          const inn = drop(i), nxt = i < 2 ? drop(i + 1) : 0;
          if (inn <= 0 || nxt >= 1) return;
          // under the slot word, on its left edge: each picture drops through with its word
          kids.push(<div key={`pic${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(170px, ${640 + (1 - inn) * 50 + nxt * 40}px, 0)`,
            opacity: clamp01(inn * 1.8 - 0.3) * clamp01(1 - nxt * 2.5) * (1 - out7), filter: (inn < 1 || nxt > 0) ? `blur(${(1 - inn) * 6 + nxt * 6}px)` : undefined }}>{node}</div>);
        };
        const G = "Goedemiddag, waarmee kan ik je helpen?";
        const gn = clamp01((t - s("prof") - 0.35) / 1.0) * G.length;
        PIC(0, "prof", <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <Avatar size={78} />
          <div style={{ width: 470, padding: "26px 32px", borderRadius: 34, borderBottomLeftRadius: 8, background: C.teal, color: "#fff", fontFamily: F.ui, fontWeight: 500, fontSize: 40, lineHeight: 1.25, minHeight: 100 }}>
            {G.slice(0, Math.floor(gn))}<span style={{ opacity: Math.floor(t * 2.4) % 2 ? 0.9 : 0.2 }}>|</span></div>
        </div>);
        const ring = k(g, "snel+0.1", 0.75, MOVE);
        PIC(1, "snel", <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ position: "relative", width: 250, height: 250 }}>
            <svg width={250} height={250} viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#C5DDD9" strokeWidth="2.6" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={C.teal} strokeWidth="2.6" strokeLinecap="round" strokeDasharray={`${94.2 * ring} 94.2`} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 800, color: C.teal, letterSpacing: "-0.04em" }}>
              <span style={{ fontSize: 82 }}>&lt;3</span><span style={{ fontSize: 30, marginLeft: 4, marginTop: 30 }}>sec</span></div>
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.tealDeep, whiteSpace: "nowrap" }}>binnen 3 seconden opgenomen</div>
        </div>);
        PIC(2, "zonder", <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22, paddingTop: 50 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d, i) => {
              const on = k(g, `zonder+${0.12 + i * 0.07}`, 0.25);
              return <div key={d} style={{ width: 62, height: 62, borderRadius: "50%", background: mix("#FFFFFF", C.teal, on), color: mix(C.teal, "#FFFFFF", on), boxShadow: `0 0 0 2px ${rgba(C.teal, 0.3)}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700, fontSize: 24 }}>{d}</div>;
            })}
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.tealDeep }}>7 dagen per week, ook ’s nachts</div>
        </div>);
        return kids;
      })()}
    </Field>
  );

  // ===== 8 cream grows back out of "zo": five calls at once, all answered on "direct"; the middle one opens into the customer's phone
  const ZO: P = [170 + 6 * 74 + 31, 640 + 50 + 31];
  const CALLS: P[] = [[560, 236], [790, 386], [1020, 536], [1250, 686], [1480, 836]];
  const field8 = (
    <Field key="f8" g={g} from="cream" x={ZO[0]} y={ZO[1]} color={C.page}>
      {(() => {
        const kids: React.ReactNode[] = [];
        const ph8 = k(g, "photo", 0.75, MOVE);
        const w2 = k(g, "whip2", 0.36, DEPART);
        if (ph8 > 0 && w2 < 1) {
          const [x, y] = CALLS[2];
          const cx = lerp(x, 960, ph8) - w2 * 2300, cy = lerp(y, 540, ph8);
          const ww8 = lerp(580, 1240, ph8), hh8 = lerp(116, 832, ph8);
          const chip = k(g, "sms", 0.5);
          kids.push(<div key="photo" style={{ ...at(cx, cy), width: ww8, height: hh8, borderRadius: lerp(26, 34, ph8), overflow: "hidden", boxShadow: SHADOW, background: C.white }}>
            <Img src={staticFile("img/control-followup-sms-photo.png")} style={{ position: "absolute", width: 1240, height: 832, left: (ww8 - 1240) / 2, top: (hh8 - 832) / 2,
              transform: `scale(${1.0 + 0.06 * clamp01((t - s("photo")) / 1.6)})`, opacity: clamp01(ph8 * 1.5) }} />
            {chip > 0 && <div style={{ position: "absolute", left: 36, bottom: 36, display: "flex", alignItems: "center", gap: 14, padding: "14px 24px 14px 14px", borderRadius: 999, background: C.white,
              boxShadow: SHADOW, opacity: clamp01(chip * 1.6), transform: `translateY(${(1 - chip) * 40}px)`, fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={26} color="#fff" stroke={3} /></div>
              Afspraakbevestiging verstuurd</div>}
          </div>);
        }
        CALLS.forEach(([x, y], i) => {
          const u = k(g, `calls+${i * 0.15}`, 0.6);
          if (u <= 0) return;
          const fl = k(g, `direct+${i * 0.03}`, 0.3, MOVE);
          const sy = Math.abs(Math.cos(fl * Math.PI));
          const recede = i === 2 ? 0 : ph8;
          const o = clamp01(u * 1.6) * (1 - recede) * (i === 2 ? 1 - k(g, "photo+0.35", 0.4) : 1);
          if (o <= 0.001) return;
          kids.push(<div key={`c${i}`} style={{ ...at(lerp(x + 1000, x, u) + (i === 2 ? 0 : (x - 1020) * 0.3 * recede), y, 1 - 0.1 * recede, o) }}>
            <div style={{ transform: `scaleY(${sy})` }}><CallCard a={fl > 0.5 ? "answered" : "incoming"} t={t + i * 0.13} ring={1} /></div>
          </div>);
        });
        // ===== 9 the week fills up; on "ieder" the page turns to next week, which fills up too; 10 an appointment becomes the button
        const ag9 = k(g, "whip2+0.1", 0.6);
        const CELLS1: [number, number][] = [[0, 1], [4, 1], [3, 2], [1, 3], [2, 3], [4, 0]];
        const CELLS2: [number, number][] = [[1, 0], [3, 1], [0, 2], [2, 3], [4, 2]];
        const HR = ["09:00", "10:00", "11:00", "12:00", "13:00"];
        const W1 = CELLS1.map(([d, h], i) => [d, h, HR[h], s("w:meer2") - 0.1 + i * 0.11] as [number, number, string, number]);
        const W2 = CELLS2.map(([d, h], i) => [d, h, HR[h], s("w:ieder") + 0.42 + i * 0.1] as [number, number, string, number]);
        const BUSY2: [number, number][] = [[0, 0], [2, 1], [4, 0], [1, 2], [3, 3]];
        const turn = k(g, "w:ieder-0.04", 0.46, MOVE);
        const LIFT = 3;                                       // next week's Wednesday 12:00 becomes the button
        if (ag9 > 0) {
          const back = k(g, "cta", 0.7, MOVE);
          const appts = (list: [number, number, string, number][], extra?: [number, number, string, number]) =>
            [...(extra ? [extra] : []), ...list].map(([d, h, tm, at0], i) => {
              const u = at0 >= 0 ? k(g, at0, 0.42) : 1;
              if (u <= 0 || (list === W2 && i === LIFT && t > s("cta"))) return null;
              const [cx, cy] = cell(d, h);
              return <div key={i} style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%) translateY(${(1 - u) * -70}px)`, opacity: clamp01(u * 1.7) }}>
                <Appt time={tm} glow={at0 >= 0 ? Math.sin(Math.PI * clamp01((t - at0) / 0.6)) : 0} /></div>;
            });
          kids.push(<div key="ag9" style={{ ...at(lerp(2600, 960, ag9), 560, lerp(1, 0.9, back), 1 - back), width: AG.w, height: AG.h, borderRadius: 34, overflow: "hidden", boxShadow: SHADOW,
            filter: back > 0 ? `blur(${back * 8}px)` : undefined }}>
            <div style={{ display: "flex", gap: 60, transform: `translateX(${-turn * (AG.w + 60)}px)` }}>
              <Agenda flat>{appts(W1, [1, 1, "10:00", -1])}</Agenda>
              <Agenda flat label="volgende week" hilite={-1} busy={BUSY2}>{appts(W2)}</Agenda>
            </div>
          </div>);
          const APPTS = W2;
          // the lifted appointment travels to the centre and becomes "Start gratis"
          if (t > s("cta")) {
            const [d, h] = [APPTS[LIFT][0], APPTS[LIFT][1]];
            const [cx, cy] = cell(d, h);
            const sx = 960 + (cx - AG.w / 2), sy = 560 + (cy - AG.h / 2);
            void APPTS;
            const mv = k(g, "cta+0.15", 0.8, MOVE), mo = k(g, "cta+0.35", 0.5, MOVE);
            const press = clamp01((t - s("press")) / 0.3);
            kids.push(<div key="btn" style={{ ...at(lerp(sx, 960, mv), lerp(sy, 700, mv) - Math.sin(mv * Math.PI) * 40, 1) }}>
              <div style={{ position: "relative" }}>
                <div style={{ opacity: 1 - mo, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}><Appt time="12:00" /></div>
                <div style={{ opacity: mo, transform: `scale(${lerp(0.55, 1, mo)})` }}><Button size={44} press={press} /></div>
              </div>
            </div>);
            const mk2 = k(g, "mark", 0.65, MOVE);
            if (mk2 > 0) kids.push(<div key="wm10" style={{ ...at(960, 400, 1, clamp01(mk2 * 2)) }}><Wordmark h={150} k={mk2} /></div>);
            const TAG: [string, boolean][] = [["De", false], ["AI-receptionist", true], ["die", false], ["nooit", false], ["een", false], ["oproep", false], ["mist.", false]];
            kids.push(<div key="tag" style={{ position: "absolute", left: 0, right: 0, top: 528, display: "flex", justifyContent: "center", gap: 16, fontFamily: F.display, fontWeight: 800, fontSize: 58, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
              {TAG.map(([w, acc], i) => {
                const u = k(g, `tagline+${i * 0.07}`, 0.5);
                return <span key={i} style={{ display: "inline-block", color: acc ? C.teal : C.ink, opacity: clamp01(u * 1.7), transform: `translateY(${(1 - u) * 22}px)`, filter: u < 1 ? `blur(${(1 - u) * 6}px)` : undefined }}>{w}</span>;
              })}
            </div>);
            const url = k(g, "press+0.3", 0.5);
            kids.push(<div key="url" style={{ position: "absolute", left: 0, right: 0, top: 796, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.txt2, opacity: url, transform: `translateY(${(1 - url) * 16}px)` }}>voxflow.nl</div>);
          }
        }
        return kids;
      })()}
    </Field>
  );

  // ===== the fields, in story order: white grows out of the answered call (4), pale teal out of the receptionist's face (7),
  // cream out of the last day (8). Everything of 1–3 lies under the white field; 4–6 under the teal; 7 under the cream.
  const lead = leadPos;
  const white = <Field key="fw" g={g} from="white" x={lead[0]} y={lead[1]} color={C.white} />;
  // the white field sits between 1–3 and the conversation; the convo group (with the lead card) is drawn above it
  const under = els.filter((e) => React.isValidElement(e) && ["win", "assistant", "h0", "h1", "h2", "wm", "chip", "st0", "st1", "w30", "w31", "w32", "247", "dial"].includes(String(e.key)));
  const over = els.filter((e) => !under.includes(e));
  return (
    <>
      <div style={{ position: "absolute", inset: -200, background: mix(C.page, C.night, nightK * 0.92) }} />
      {under}
      {white}
      {over}
      {field7}
      {field8}
    </>
  );
};
