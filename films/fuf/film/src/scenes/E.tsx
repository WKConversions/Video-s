// Segment E (32.85-42.5 s): "Because the next big opportunity might start with one conversation. Future Unicorn
// Founders. Build what's next, together." + the end card.
// 16 the H4 glow narrows into the light through a door left ajar; the door swings open and the camera pushes through.
// 17 the light condenses into a speech bubble that grows word by word until it becomes the frame: "one conversation."
// 18 the bubble shrinks, its outline unwinds into the one-line unicorn, which fills to the mark; the name slides in.
// 19 a speed-matched pan to building blocks that drop and stack, carrying "Build what's next," then "together." lands.
// 20 the top block's face opens into the Málaga photo panel: an editorial split end card that keeps moving.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, SERIF, SANS, SHADOW, H4, H4Glow, Mark, Lockup, Photo, DrawLine, unicornPath, w, clamp, mix, ease, inout, spring } from "../kit";

// ease-out quint: a quick settle with a short tail (avoids long sub-pixel creeps that step and shake)
const q5 = (x: number) => 1 - Math.pow(1 - clamp(x), 5);
const PAPER = "linear-gradient(165deg, #FFFDF9 0%, #FAF6F0 55%, #F1EBE2 100%)";

// a word rising through a mask (with an optional sideways slide)
const Rise: React.FC<{ t: number; at: number; children: React.ReactNode; size: number; it?: boolean; color?: string; dx?: number; out?: number; resp?: number }> = ({ t, at, children, size, it, color, dx = 0, out = 9999, resp = 0.55 }) => {
  const p = spring(t, at, resp, 0.85), o = ease((t - out) / 0.3);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingTop: size * 0.05, verticalAlign: "top" }}>
      <span style={{ display: "inline-block", transform: `translate(${(1 - p) * dx}px, ${(1 - p) * 112 - o * 118}%)`, fontStyle: it ? "italic" : "normal",
        color: color ?? (it ? F.bronze : F.ink) }}>{children}</span>
    </span>
  );
};

// ---------------------------------------------------------------- 16 the door
const DOOR = { x: 1060, y: 170, w: 400, h: 760 }; // the opening in world px
const DoorPanel: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #2E2C29 0%, #3A3733 45%, #262422 100%)", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.25), inset -10px 0 18px rgba(0,0,0,0.25)" }}>
    {[[40, 44, 320, 300], [40, 384, 320, 330]].map(([x, y, ww, hh], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: ww, height: hh, borderRadius: 4,
        background: "linear-gradient(160deg, #2A2826, #36332F)", boxShadow: "inset 3px 3px 0 rgba(0,0,0,0.35), inset -3px -3px 0 rgba(255,255,255,0.08), 0 0 0 6px rgba(255,255,255,0.03)" }} />
    ))}
    {/* the brass plate and the knob */}
    <div style={{ position: "absolute", left: 140, top: 230, width: 120, height: 46, borderRadius: 6, background: "linear-gradient(160deg, #B59B7F, #8F765E 60%, #7A644F)", boxShadow: "0 2px 4px rgba(39,38,36,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 26, color: "#F7F0E6", letterSpacing: "0.12em" }}>FUF</div>
    <div style={{ position: "absolute", left: 344, top: 380, width: 34, height: 34, borderRadius: 34, background: "radial-gradient(circle at 35% 35%, #D9C3A6, #8F765E 55%, #5E4B3A)", boxShadow: "0 4px 8px rgba(39,38,36,0.35)" }} />
  </div>
);

// the world beyond the door: the Málaga terrace at sunset, panning (screen space), warm-washed
const Beyond: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: -560, transform: `translateX(${-150 - (t - 33.1) * 330}px)` }}>
      <Photo src="hero-malaga.jpg" w={3600} h={1700} z={1.04} fx={0.5} fy={0.55} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, rgba(232,185,138,0.10), rgba(232,185,138,0.35))" }} />
  </div>
);

const Door: React.FC<{ t: number }> = ({ t }) => {
  // the glow narrows into the doorway; the door swings closed to ajar, then open; the camera pushes through
  const nar = q5((t - 33.1) / 0.55);
  const closeP = q5((t - 33.16) / 0.5);
  const openP = inout((t - 34.06) / 0.42);
  const theta = mix(mix(86, 56, closeP), 108, openP);
  const push = clamp((t - 34.12) / 0.4), s = 1 + Math.pow(push, 2.4) * 7.5;
  const drift = (33.75 - t) * 300;
  const c0x = DOOR.x + DOOR.w / 2, c0y = DOOR.y + DOOR.h / 2;
  const cx = mix(c0x + drift, 960, ease(push)), cy = mix(c0y, 540, ease(push));
  const S = (x: number, y: number) => [cx + (x - c0x) * s, cy + (y - c0y) * s];
  // the opening in screen px, and the glow's clip morphing from the full frame into it
  const [ox0, oy0] = S(DOOR.x, DOOR.y), [ox1, oy1] = S(DOOR.x + DOOR.w, DOOR.y + DOOR.h);
  const cl = { l: mix(0, ox0, nar), t: mix(0, oy0, nar), r: mix(1920, ox1, nar), b: mix(1080, oy1, nar) };
  const rad = Math.cos((theta * Math.PI) / 180), gx = DOOR.x + DOOR.w * Math.max(0, rad) * 0.93;
  const casing = spring(t, 33.12, 0.6, 0.85);
  const wedge = clamp((t - 33.35) / 0.4);
  return (
    <AbsoluteFill>
      {/* the light beyond the door: the H4 glow, clipped to the doorway */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${cl.t}px ${1920 - cl.r}px ${1080 - cl.b}px ${cl.l}px)` }}>
        <Beyond t={t} />
        <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp((t - 33.4) / 0.45) }}><H4Glow t={t} /></div>
      </div>
      {/* the world: casing, door, floor light and the words */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
        transform: `translate(${cx - c0x * s}px, ${cy - c0y * s}px) scale(${s})` }}>
        {/* floor line and skirting */}
        <div style={{ position: "absolute", left: -400, top: DOOR.y + DOOR.h, width: 2800, height: 2, background: F.sand2, transformOrigin: "50% 50%", transform: `scaleX(${casing})` }} />
        {/* casing (architrave) */}
        <div style={{ position: "absolute", left: DOOR.x - 38, top: DOOR.y - 38, width: DOOR.w + 76, height: DOOR.h + 38, transformOrigin: "50% 100%",
          transform: `scale(${mix(1.25, 1, casing)})`, opacity: clamp(casing * 1.6),
          background: "linear-gradient(90deg, #E2D8CB, #F2ECE4 30%, #E9E1D6 70%, #D9CEC0)", boxShadow: "0 30px 60px -30px rgba(39,38,36,0.35), inset 0 0 0 1px rgba(39,38,36,0.08)",
          clipPath: `polygon(0 0, 100% 0, 100% 100%, ${DOOR.w + 38}px 100%, ${DOOR.w + 38}px 38px, 38px 38px, 38px 100%, 0 100%)` }} />
        <div style={{ position: "absolute", left: DOOR.x - 4, top: DOOR.y - 4, width: DOOR.w + 8, height: DOOR.h + 4, boxShadow: "inset 0 0 0 4px rgba(39,38,36,0.10)", opacity: casing }} />
        {/* light spilling across the floor from the gap */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: wedge }}>
          <defs><linearGradient id="eWedge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={F.sunset} stopOpacity={0.85} /><stop offset="1" stopColor={F.sunset} stopOpacity={0} />
          </linearGradient></defs>
          <polygon points={`${gx},${DOOR.y + DOOR.h} ${DOOR.x + DOOR.w},${DOOR.y + DOOR.h} ${DOOR.x + DOOR.w + 330},1160 ${gx + 60},1160`} fill="url(#eWedge)" />
        </svg>
        {/* the door, hinged on the left, swinging into the room */}
        <div style={{ position: "absolute", left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, perspective: 1500, perspectiveOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${theta}deg)`, opacity: clamp((t - 33.14) / 0.12) }}>
            <DoorPanel />
          </div>
        </div>
        {/* the line, left of the door */}
        <div style={{ position: "absolute", left: 190, top: 330, fontFamily: SERIF, fontSize: 104, lineHeight: 1.16, letterSpacing: "-0.02em", whiteSpace: "pre" }}>
          <div style={{ display: "flex", gap: 26 }}>
            <Rise t={t} at={w("because")} size={104}>Because</Rise><Rise t={t} at={w("the2")} size={104}>the</Rise><Rise t={t} at={w("next")} size={104}>next</Rise>
          </div>
          <div style={{ display: "flex", gap: 26 }}>
            <Rise t={t} at={w("big")} size={104} it>big</Rise><Rise t={t} at={w("opportunity")} size={104}>opportunity</Rise>
          </div>
          <div style={{ marginTop: 40, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: "0.22em", color: F.bronze, opacity: clamp((t - 33.4) / 0.2),
            transform: `translateX(${(1 - spring(t, 33.4, 0.5, 0.9)) * -40}px)` }}>MAKE ROOM FOR POSSIBILITY</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 17 the bubble becomes the frame
type Rect = { x: number; y: number; w: number; h: number; r: number };
const bubbleRect = (t: number): Rect => {
  // contract from the full frame (the light) into a small bubble, then grow on each word, then fill the frame
  const c = q5((t - 34.46) / 0.42);
  let cw = mix(1920, 900, c), ch = mix(1080, 420, c), cyy = mix(540, 470, c), cxx = 960, r = mix(0, 150, c);
  const g1 = q5((t - w("start2")) / 0.32), g2 = q5((t - w("with2")) / 0.3), g3 = q5((t - w("one")) / 0.45);
  cw += g1 * 200 + g2 * 200; ch += g1 * 50 + g2 * 50; r += g1 * 20 + g2 * 20;
  cw = mix(cw, 1792, g3); ch = mix(ch, 850, g3); cyy = mix(cyy, 64 + 425, g3); r = mix(r, 64, g3);
  // shrink to the unicorn's place and size
  const z = q5((t - 36.69) / 0.32), ux = 600 + driftU(t);
  cw = mix(cw, 470, z); ch = mix(ch, 300, z); cxx = mix(cxx, ux, z); cyy = mix(cyy, 520, z); r = mix(r, 120, z);
  return { x: cxx - cw / 2, y: cyy - ch / 2, w: cw, h: ch, r };
};
const tailPts = (b: Rect) => {
  const k = Math.min(1, b.w / 900);
  const a = b.x + b.w * 0.2, bb = a + mix(70, 130, k), tipx = a - mix(30, 60, k), tipy = b.y + b.h + mix(56, 70, k);
  return { a, bb, tipx, tipy, base: b.y + b.h };
};
// the bubble's outline as one path, starting and ending at the tail's tip (for the unwinding)
const bubblePath = (b0: Rect, e = 0) => {
  const { a, bb, tipx, tipy } = tailPts(b0), b = { x: b0.x - e, y: b0.y - e, w: b0.w + 2 * e, h: b0.h + 2 * e, r: b0.r + e };
  const base = b.y + b.h, R = Math.min(b.r, b.w / 2, b.h / 2), x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h;
  return `M${tipx} ${tipy} L${a} ${base} L${x0 + R} ${y1} A${R} ${R} 0 0 1 ${x0} ${y1 - R} L${x0} ${y0 + R} A${R} ${R} 0 0 1 ${x0 + R} ${y0} L${x1 - R} ${y0} A${R} ${R} 0 0 1 ${x1} ${y0 + R} L${x1} ${y1 - R} A${R} ${R} 0 0 1 ${x1 - R} ${y1} L${bb} ${base} Z`;
};

const Bubble: React.FC<{ t: number }> = ({ t }) => {
  const b = bubbleRect(t), B = 5;
  const ins = (q: Rect, e: number) => `inset(${q.y - e}px ${1920 - q.x - q.w - e}px ${1080 - q.y - q.h - e}px ${q.x - e}px round ${q.r + e}px)`;
  const dark = clamp((t - 34.50) / 0.3) * (1 - clamp((t - w("one")) / 0.3));
  const sheet = q5((t - (w("one") - 0.02)) / 0.45);
  const line = clamp((t - 34.50) / 0.2);
  const cardOut = ease((t - 36.66) / 0.28);
  const { a, bb, tipx, tipy, base } = tailPts(b);
  const tail = `M${a} ${base - 3} L${tipx} ${tipy} L${bb} ${base - 3}`;
  const outT = 36.55;
  const dCont = (36.1 - t) * 200;
  const swash = clamp((t - 36.02) / 0.42);
  const reply = spring(t, 36.18, 0.5, 0.7) * (1 - clamp((t - 36.62) / 0.18));
  return (
    <AbsoluteFill>
      {/* the bronze rim, the paper, the tail */}
      <div style={{ position: "absolute", inset: 0, background: F.bronze, opacity: line, clipPath: ins(b, B) }} />
      <div style={{ position: "absolute", inset: 0, background: PAPER, clipPath: ins(b, 0) }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Beyond t={t} />
          <div style={{ position: "absolute", inset: 0, opacity: dark * (1 - cardOut), background: "linear-gradient(180deg, rgba(39,38,36,0.15), rgba(39,38,36,0.45))" }} />
          {/* a paper card slides up over the photo's lower part when the bubble becomes the frame */}
          <div style={{ position: "absolute", left: 0, top: 470, width: 1920, height: 760, borderRadius: "36px 36px 0 0", background: PAPER,
            boxShadow: "0 -20px 50px -20px rgba(39,38,36,0.35)", transform: `translateY(${(1 - sheet * (1 - cardOut)) * 640}px)` }} />
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: line }}>
        <path d={tail} fill={sheet > 0.6 && cardOut < 0.5 ? "#FBF8F3" : "#4A3D33"} stroke={F.bronze} strokeWidth={B} strokeLinejoin="round" />
      </svg>
      {/* the full line inside the frame-sized bubble */}
      {t > w("one") - 0.05 && t < 37.0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: ins(b, -2) }}><div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${dCont}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 506, width: 1920, display: "flex", justifyContent: "center", gap: 18, fontFamily: SERIF, fontSize: 62, letterSpacing: "-0.01em", whiteSpace: "pre" }}>
            <Rise t={t} at={w("one") + 0.02} size={62} out={outT}>might</Rise><Rise t={t} at={w("one") + 0.07} size={62} out={outT}>start</Rise><Rise t={t} at={w("one") + 0.12} size={62} out={outT}>with</Rise>
          </div>
          <div style={{ position: "absolute", left: 0, top: 588, width: 1920, display: "flex", justifyContent: "center", alignItems: "flex-end", fontFamily: SERIF, fontSize: 172, letterSpacing: "-0.025em", whiteSpace: "pre" }}>
            <Rise t={t} at={w("one") + 0.04} size={172} it out={outT} resp={0.5}>one </Rise>
            {"conversation.".split("").map((ch, i) => <Rise key={i} t={t} at={w("conversation") + i * 0.028} size={172} it out={outT + i * 0.008} resp={0.5}>{ch}</Rise>)}
          </div>
          <DrawLine d="M560 846 C 800 812, 1080 826, 1300 834 S 1540 826, 1620 800" p={swash} width={6} style={{ opacity: 1 - clamp((t - outT) / 0.2) }} />
          {/* a reply bubble: the other side of the conversation */}
          <div style={{ position: "absolute", left: 1440, top: 150, width: 300, height: 128, transformOrigin: "85% 100%", transform: `scale(${reply})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "linear-gradient(160deg, #34322F, #272624)", boxShadow: SHADOW,
              display: "flex", alignItems: "center", justifyContent: "center", }}><DrawLine d="M78 66 C 104 40, 128 92, 152 64 S 200 40, 222 66" p={clamp((t - 36.26) / 0.3)} width={5} color={F.tan} /></div>
            <svg width={60} height={40} style={{ position: "absolute", left: 210, top: 118 }}><path d="M0 0 L50 32 L36 0 Z" fill="#272624" /></svg>
          </div>
        </div></div>
      )}
    </AbsoluteFill>
  );
};

// the rolling word slot ("might" / "start" / "with"), its own layer so "might" can rise just before the bubble cut
const Slot: React.FC<{ t: number }> = ({ t }) => {
  const slotOut = clamp((t - w("one")) / 0.2);
  const roll = (at: number, next: number) => {
    const pin = spring(t, at, 0.42, 0.85), pout = next > 0 ? spring(t, next, 0.42, 0.9) : 0;
    return `translateY(${(1 - pin) * 105 - pout * 105}%)`;
  };
  const slot = [["might", w("might") - 0.05, w("start2")], ["start", w("start2"), w("with2")], ["with", w("with2"), w("one")]] as const;
  return (
    <div style={{ position: "absolute", left: 0, top: 370, width: 1920, height: 200, overflow: "hidden", opacity: 1 - slotOut }}>
      {slot.map(([txt, at, nx]) => (
        <div key={txt} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 200, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SERIF, fontSize: 150, letterSpacing: "-0.02em", color: F.cream, textShadow: "0 2px 12px rgba(39,38,36,0.35)", transform: roll(at, nx) }}>{txt}</div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- 18 the outline unwinds into the unicorn
function driftU(t: number) { return (37.8 - t) * 320; }
const UNI = { x: 600, y: 520, s: 560 };
const Slide: React.FC<{ t: number; at: number; children: React.ReactNode }> = ({ t, at, children }) => (
  <div style={{ transform: `translateX(${(1 - spring(t, at, 0.55, 0.85)) * 240}px)` }}>{children}</div>
);
const camX = (t: number) => inout((t - 38.56) / 0.4) * 1920;

const UnicornShot: React.FC<{ t: number }> = ({ t }) => {
  const dx = driftU(t) - camX(t);
  const bEnd = bubbleRect(36.97), tE = tailPts(bEnd);
  const unwind = inout((t - 36.97) / 0.5);
  const draw = clamp((t - 37.12) / 0.5);
  const fill = q5((t - 37.5) / 0.42);
  const lineOut = clamp((t - 37.85) / 0.2);
  const hair = clamp((t - 38.02) / 0.32);
  const ir = inout((t - 36.97) / 0.18), sh = dx - driftU(36.97);
  const iw = bEnd.w * (1 - ir), ih = bEnd.h * (1 - ir), icx = bEnd.x + bEnd.w / 2 + sh, icy = bEnd.y + bEnd.h / 2, irr = Math.min(bEnd.r, iw / 2, ih / 2);
  return (
    <AbsoluteFill>
      {ir < 1 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${icy - ih / 2}px ${1920 - icx - iw / 2}px ${1080 - icy - ih / 2}px ${icx - iw / 2}px round ${irr}px)` }}>
          <Beyond t={t} />
        </div>
      )}
      {/* the bubble outline (frozen at its last shape) retracting from the tail, as the unicorn draws */}
      {t < 37.5 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(${dx - (driftU(36.97) - 0)} 0)`}>
            <path d={`M${tE.a} ${tE.base - 3} L${tE.tipx} ${tE.tipy} L${tE.bb} ${tE.base - 3} Z`} fill="#4A3D33" opacity={1 - clamp((t - 36.97) / 0.15)} />
            <path d={bubblePath(bEnd, 2.5)} pathLength={1} fill="none" stroke={F.bronze} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={-unwind} />
          </g>
        </svg>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${dx}px)` }}>
        <DrawLine d={unicornPath(UNI.x, UNI.y, UNI.s)} p={draw} width={5} style={{ opacity: 1 - lineOut }} />
        <div style={{ position: "absolute", left: UNI.x - UNI.s / 2, top: UNI.y - UNI.s / 2, clipPath: `circle(${fill * 80}% at 50% 55%)`, transform: `scale(${1 + 0.06 * ease((t - 37.6) / 1.1)})` }}>
          <Mark size={UNI.s} tone="bronze" />
        </div>
        <div style={{ position: "absolute", left: 960, top: 226, fontFamily: SERIF, fontSize: 150, lineHeight: 1.12, letterSpacing: "-0.02em", whiteSpace: "pre" }}>
          <Slide t={t} at={w("future2")}><Rise t={t} at={w("future2")} size={150}>Future</Rise></Slide>
          <Slide t={t} at={w("unicorn2")}><Rise t={t} at={w("unicorn2")} size={150} it>Unicorn</Rise></Slide>
          <Slide t={t} at={w("founders3")}><Rise t={t} at={w("founders3")} size={150}>Founders.</Rise></Slide>
        </div>
        <div style={{ position: "absolute", left: 966, top: 790, width: 560, height: 2, background: F.bronze, opacity: 0.6, transformOrigin: "0 50%", transform: `scaleX(${ease(hair)})` }} />
        <div style={{ position: "absolute", left: 966, top: 820, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: "0.22em", color: F.bronze,
          opacity: clamp((t - 38.12) / 0.25), transform: `translateX(${(1 - spring(t, 38.12, 0.5, 0.9)) * -40}px)` }}>INTERNATIONAL · MÁLAGA, SPAIN</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 19 building blocks
type Blk = { col: number; row: number; land: number; tone: "cream" | "bronze" | "sand"; word?: string };
const BW = 400, BH = 168, BD = 46, FLOOR = 962;
const colX = (c: number) => 230 + c * 450;
const BLOCKS: Blk[] = [
  { col: 0, row: 0, land: w("build"), tone: "cream", word: "Build" },
  { col: 1, row: 0, land: 39.22, tone: "sand" },
  { col: 1, row: 1, land: w("whats"), tone: "bronze", word: "what’s" },
  { col: 2, row: 0, land: 39.41, tone: "bronze" },
  { col: 2, row: 1, land: 39.51, tone: "sand" },
  { col: 2, row: 2, land: w("next2"), tone: "cream", word: "next," },
];
const GRAIN = (c: string) => `radial-gradient(ellipse 60px 14px at 28% 62%, ${c}, rgba(0,0,0,0) 70%), radial-gradient(ellipse 38px 9px at 71% 34%, ${c}, rgba(0,0,0,0) 70%), repeating-linear-gradient(179deg, rgba(0,0,0,0) 0px, ${c} 3px, rgba(0,0,0,0) 7px, rgba(0,0,0,0) 19px, ${c} 21px, rgba(0,0,0,0) 24px, rgba(0,0,0,0) 37px), repeating-linear-gradient(177deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 11px, ${c} 13px, rgba(0,0,0,0) 16px, rgba(0,0,0,0) 53px)`;
const TONES = {
  cream: { front: `${GRAIN("rgba(150,115,80,0.16)")}, linear-gradient(180deg, #FFFDF9, #F1EBE2)`, top: "#FFFFFF", side: "#D9D0C4", text: F.ink },
  sand: { front: `${GRAIN("rgba(120,90,60,0.17)")}, linear-gradient(180deg, #ECE4D9, #DDD3C6)`, top: "#F4EEE6", side: "#C6BAAA", text: F.ink },
  bronze: { front: `${GRAIN("rgba(60,40,25,0.22)")}, linear-gradient(180deg, #A0866D, #846C55)`, top: "#B9A189", side: "#6A5643", text: "#FBF6EE" },
};
const blockDrop = (t: number, land: number, dur = 0.26) => {
  const f = clamp((t - (land - dur)) / dur);
  const y = -(1 - f * f) * 820;
  const k = t - land, sq = k > 0 ? Math.exp(-k * 11) * Math.cos(k * 34) * 0.07 : 0;
  return { y, sq, vis: t > land - dur };
};
const bxB = (t: number) => 1920 - camX(t) + (39.85 - t) * 192;
const byB = (t: number) => (t - 39.85) * 90;
const faceRect = (t: number) => { const ox = bxB(t), d = exitY(t) + byB(t); return { x: ox + colX(2), y: FLOOR - 3 * BH + d, w: BW, h: BH }; };
function exitY(t: number) { const e = clamp((t - 40.8) / 0.42); return e * e * 1250; }

const BlocksShot: React.FC<{ t: number }> = ({ t }) => {
  const ox = bxB(t), ey = exitY(t) + byB(t);
  const togIn = t > w("together2") - 0.36;
  const floor = ease((t - 38.7) / 0.6);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${ox}px, ${ey}px)`, willChange: "transform" }}>
      <div style={{ position: "absolute", left: 120, top: FLOOR, width: 1560, height: 2, background: F.tan, transformOrigin: "0 50%", transform: `scaleX(${floor})` }} />
      {BLOCKS.map((b, i) => {
        const d = blockDrop(t, b.land, i === 0 ? 0.42 : 0.26); if (!d.vis) return null;
        const tn = TONES[b.tone], x = colX(b.col), y = FLOOR - (b.row + 1) * BH;
        const shadowK = clamp(1 - Math.abs(d.y) / 820);
        return (
          <React.Fragment key={i}>
            {b.row === 0 && <div style={{ position: "absolute", left: x - 20, top: FLOOR - 26, width: BW + BD + 40, height: 52, borderRadius: "50%", opacity: shadowK * 0.9,
              background: "radial-gradient(closest-side, rgba(39,38,36,0.22), rgba(39,38,36,0))" }} />}
            <div style={{ position: "absolute", left: x, top: y - BD, width: BW + BD, height: BH + BD, transformOrigin: "50% 100%", transform: `translateY(${d.y}px) scale(${1 + d.sq * 0.5}, ${1 - d.sq})` }}>
              <svg width={BW + BD} height={BH + BD} style={{ position: "absolute", left: 0, top: 0 }}>
                <polygon points={`0,${BD} ${BD},0 ${BW + BD},0 ${BW},${BD}`} fill={tn.top} stroke="rgba(39,38,36,0.10)" strokeWidth={1.5} />
                <polygon points={`${BW},${BD} ${BW + BD},0 ${BW + BD},${BH} ${BW},${BH + BD}`} fill={tn.side} stroke="rgba(39,38,36,0.10)" strokeWidth={1.5} />
              </svg>
              <div style={{ position: "absolute", left: 0, top: BD, width: BW, height: BH, background: tn.front, boxShadow: "inset 0 0 0 1.5px rgba(39,38,36,0.10), inset 0 -10px 20px rgba(39,38,36,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 100, letterSpacing: "-0.02em", color: tn.text }}>
                {b.word && <span style={{ transform: "translateY(-6px)" }}>{b.word}</span>}
                {!b.word && <div style={{ width: 120, height: 3, background: tn.text, opacity: 0.25 }} />}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {togIn && (
        <div style={{ position: "absolute", left: colX(2) + BW / 2 + BD / 2 - 400, top: FLOOR - 3 * BH - BD - 196, width: 800, height: 190, display: "flex", justifyContent: "center", alignItems: "flex-end",
          fontFamily: SERIF, fontStyle: "italic", fontSize: 158, letterSpacing: "-0.02em", color: F.bronze, lineHeight: 1, whiteSpace: "pre", opacity: 1 - clamp((t - 40.66) / 0.12), transform: `translateY(${-ease((t - 40.62) / 0.16) * 40}px)` }}>
          {"together.".split("").map((ch, i) => { const d = blockDrop(t, w("together2") - 0.06 + i * 0.02); return (
            <span key={i} style={{ display: "inline-block", transformOrigin: "50% 100%", opacity: d.vis ? 1 : 0, transform: `translateY(${d.y * 0.8}px) scaleY(${1 - d.sq})` }}>{ch}</span>); })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- 20 the end card
const PANEL = { x: 1004, y: 64, w: 852, h: 952, r: 28 };
const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const k = q5((t - 40.78) / 0.55);
  const f = faceRect(Math.min(t, 40.78));
  const q = { x: mix(f.x, PANEL.x, k), y: mix(f.y, PANEL.y, k), w: mix(f.w, PANEL.w, k), h: mix(f.h, PANEL.h, k), r: mix(0, PANEL.r, k) };
  const pan = -380 - (t - 40.7) * 160;
  const btn = spring(t, 41.55, 0.5, 0.8);
  const ph = (t - 41.6) % 0.9, nudge = ph < 0 ? 0 : Math.sin(clamp(ph / 0.22) * Math.PI) * 12;
  const chip = spring(t, 41.75, 0.5, 0.85);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${q.y}px ${1920 - q.x - q.w}px ${1080 - q.y - q.h}px ${q.x}px round ${q.r}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -80, transform: `translateX(${pan}px)` }}>
          <Photo src="hero-malaga.jpg" w={2700} h={1290} z={1.03} fx={0.6} fy={0.5} />
        </div>
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, background: "linear-gradient(180deg, rgba(39,38,36,0) 60%, rgba(39,38,36,0.35))" }} />
        <div style={{ position: "absolute", left: PANEL.x + 44, top: PANEL.y + PANEL.h - 108, height: 56, padding: "0 26px", borderRadius: 28, background: "rgba(247,244,239,0.94)",
          display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.16em", color: F.ink,
          transform: `translateY(${(1 - chip) * 120}px)` }}>
          <span style={{ color: F.bronze }}>UPCOMING GATHERINGS</span><span style={{ opacity: 0.4 }}>·</span><span>DATES TO BE ANNOUNCED</span>
        </div>
      </div>
      {/* the copy side */}
      <div style={{ position: "absolute", left: 130, top: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 200, transform: `translateY(${(1 - spring(t, 41.0, 0.55, 0.85)) * 60}px)`, opacity: clamp((t - 41.0) / 0.2) }}>
          <Lockup size={150} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 430, fontFamily: SERIF, fontSize: 92, lineHeight: 1.12, letterSpacing: "-0.02em", whiteSpace: "pre" }}>
          <div style={{ display: "flex", gap: 22 }}><Rise t={t} at={41.15} size={92}>Ambitious,</Rise><Rise t={t} at={41.24} size={92}>but</Rise></div>
          <div><Rise t={t} at={41.34} size={92} it>approachable.</Rise></div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 712, height: 84, padding: "0 40px", borderRadius: 42, background: F.ink, display: "flex", alignItems: "center", gap: 18,
          fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.02em", color: F.cream, boxShadow: SHADOW, whiteSpace: "nowrap",
          transformOrigin: "0 50%", transform: `translateX(${(1 - btn) * -60}px) scale(${mix(0.85, 1, btn)})`, opacity: clamp(btn * 2) }}>
          Join the community
          <span style={{ display: "inline-block", fontSize: 30, color: F.tan, transform: `translate(${nudge}px, ${-nudge}px)` }}>↗</span>
        </div>
        <div style={{ position: "absolute", left: 4, top: 846, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 21, letterSpacing: "0.2em", color: F.bronze,
          opacity: clamp((t - 41.8) / 0.25), transform: `translateX(${(1 - spring(t, 41.8, 0.5, 0.9)) * -40}px)` }}>INTERNATIONAL IN OUTLOOK · CONNECTED TO MÁLAGA</div>
      </div>
    </AbsoluteFill>
  );
};

export const SegE: React.FC<{ t: number }> = ({ t }) => {
  if (t < H4) return null;
  if (t < H4 + 0.25) return <AbsoluteFill><H4Glow t={t} /></AbsoluteFill>; // the hand-off, unchanged
  return (
    <AbsoluteFill>
      {t < 34.50 && <Door t={t} />}
      {t >= 34.46 && t < 36.97 && <Bubble t={t} />}
      {t >= 34.38 && t < w("one") + 0.25 && <Slot t={t} />}
      {t >= 36.97 && t < 39.1 && <UnicornShot t={t} />}
      {t >= 38.6 && t < 41.5 && <BlocksShot t={t} />}
      {t >= 40.78 && <EndCard t={t} />}
    </AbsoluteFill>
  );
};
