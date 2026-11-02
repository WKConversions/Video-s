// Scene S6 (12.45–15.50, B3): "Discover fresh ideas at our local events,"
// The Málaga pin's dot swells and opens into their white events section. Their own dark 2026 event banners land and
// flip on the words (Tatiana -> Yago -> Charlie) while the date under the card rolls like an odometer in the site's
// style; the logo's wave underlines the idea, hops down to underline the venue on 'local', and the last flip turns the
// announcement into the event itself (the talk in the stone-walled room), which grows and gets ready to split (S7).
import React from "react";
import { C, W, H, c01, k, mix, sp, INOUT, IN, OUT, SOFT, Pt } from "../kit";
import { H as HO } from "../handoff";
import { Scene } from "./types";
import { BAN, EV, BannerFace, EventFace, Odometer, Poly, Roller, banPx, bez, dipOf, evScale, evZoom, flatMark, flip, lerpC, pointAt, riseStyle } from "./b3-kit";

const PIN = { x: HO.pin.x, y: HO.pin.y };
const DATES = ["2026-10-15 19:00:00", "2026-09-17 19:00:00", "2026-06-18 19:00:00"];
const DATE_Y = 852, VEN_Y = 918, UL_Y = 978;
const FACE0: Pt = [EV.cx - BAN.w / 2, EV.cy - BAN.h / 2];         // the banner face's top-left in the frame (330, 80)
const NP = 96;
// the underline under Charlie's cyan headline (face px: from the headline's left edge, a third of the way from 'reliance'
// (PNG row 537) down to 'When:' (row 679)), and the venue underline (frame px)
const HL = banPx("charlie", 44, 537), WHEN = banPx("charlie", 70, 679);
const [UL_A, DOT_A] = flatMark(NP, HL[0], 300, mix(HL[1], WHEN[1], 0.33), 34);
const DOT_AF: Pt = [DOT_A[0] + FACE0[0], DOT_A[1] + FACE0[1]];
const [UL_B, DOT_B] = flatMark(NP, 680, 560, UL_Y, 24);
const UL_END = UL_B[UL_B.length - 1];
const DROP_C: Pt = [560, 900];          // the drop bends round the left of the date and the venue (they start at x 748 / 673)

const S6C: React.FC<{ t: number }> = ({ t }) => {
  // 12.45 the pin's dot swells (r 12 -> 35); 12.62 it opens into the white circle (cyan rim), covering the frame by 13.17
  const R = t < 12.62 ? mix(HO.pin.r, 35, k(t, 12.45, 0.17, SOFT)) : mix(35, 1240, k(t, 12.62, 0.55, INOUT));
  const rimP = k(t, 12.62, 0.13, OUT);
  const rim = t < 12.62 ? R : mix(35, 6, rimP);
  const Rin = Math.max(0, R - rim);
  const glow = 0.55 * k(t, 12.45, 0.12) * (1 - k(t, 12.62, 0.16));      // the swelling dot glows, the glow lets go as it opens
  const Rc = Math.max(0, Rin - 44);      // the card shows through an inner iris: a 44 px band of the white page always leads it
  // the white stays over the field until the contour lines draw in, outward from the card (13.75 -> 14.4)
  const hole = mix(-240, 1420, k(t, 13.75, 0.75, SOFT));

  // the card: lands (12.62), flips on 'fresh' (13.00), 'ideas' (13.42) and 'local events' (14.18), grows (14.55)
  const land = sp(t, 12.66, 1.4, 0.75);
  const fs = [flip(t, 13.0), flip(t, 13.42), flip(t, 14.18)];
  const ang = 6 * (1 - land) + 180 * (fs[0] + fs[1] + fs[2]);
  const face = Math.max(0, Math.min(3, Math.floor((ang + 90) / 180)));
  const loc = ang - 180 * face;                                   // the visible face's own angle (-90..90): no mirrored faces
  const dip = 1 - 0.05 * (dipOf(fs[0]) + dipOf(fs[1]) + dipOf(fs[2]));
  const ev = face === 3; const fw = ev ? EV.w : BAN.w, fh = ev ? EV.h : BAN.h;
  const sc = mix(0.9, 1, land) * dip * (ev ? evScale(t) : 1);
  const shade = 0.3 * Math.abs(Math.sin((loc * Math.PI) / 180));

  // the thread: 13.70 the logo's wave draws on under the headline (on the card, so it turns with it) and its dot clicks
  // in; 14.06 the line pulls back into its dot; 14.18 the dot drops off the turning card, round the left of the date, to
  // the venue (14.36) and draws the venue's underline on 'local' in the deeper cyan that reads on white, then clicks into
  // its full-stop place (14.60); 15.00 the line pulls back into the dot and the dot goes
  const ulP = k(t, 13.7, 0.3, SOFT), ulFrom = k(t, 14.06, 0.16, INOUT), pop = t < 13.96 ? 0 : sp(t, 13.96, 3.2, 0.6);
  const drop = k(t, 14.18, 0.18, INOUT), pB = k(t, 14.36, 0.24, SOFT), hopB = k(t, 14.6, 0.1, OUT);
  const exitFrom = k(t, 15.0, 0.2, IN), dotOut = 1 - k(t, 15.13, 0.12, IN);
  const dotPos: Pt = t < 14.18 ? DOT_AF : t < 14.36 ? bez(DOT_AF, DROP_C, UL_B[0], drop)
    : hopB <= 0 ? pointAt(UL_B, pB) : [mix(UL_END[0], DOT_B[0], hopB), mix(UL_END[1], DOT_B[1], hopB) - 16 * Math.sin(Math.PI * hopB)];
  const dotR = (t < 14.18 ? 6.6 * pop : mix(6.6, 5, drop)) * c01(dotOut);

  // the date and venue under the card: rise (12.78 / 12.86), roll with the flips, drop away as the card splits (15.0)
  const dateS = riseStyle(sp(t, 12.78, 1.7, 0.75), k(t, 15.06, 0.22, IN));
  const venS = riseStyle(sp(t, 12.86, 1.7, 0.75), k(t, 15.02, 0.22, IN));

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
      {t < 13.17 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, filter: glow > 0.01 ? `drop-shadow(0 0 16px rgba(73,216,237,${glow.toFixed(3)}))` : undefined }}>
          <circle cx={PIN.x} cy={PIN.y} r={R} fill={lerpC(C.cyanL, C.cyan, rimP)} />
          {Rin > 0.01 && <circle cx={PIN.x} cy={PIN.y} r={Rin} fill={C.paper} />}
        </svg>
      )}
      {t >= 13.17 && hole < 1400 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H,
          background: hole <= 0 ? C.paper : `radial-gradient(circle at ${EV.cx}px ${EV.cy}px, rgba(245,245,245,0) ${hole.toFixed(1)}px, ${C.paper} ${(hole + 240).toFixed(1)}px)` }} />
      )}
      {t >= 12.62 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, clipPath: t < 13.17 ? `circle(${Rc.toFixed(2)}px at ${PIN.x}px ${PIN.y}px)` : undefined }}>
          {t < 15.05 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: fw, height: fh,
              transform: `translate(${EV.cx - fw / 2}px, ${(EV.cy - fh / 2 + (1 - land) * 34).toFixed(3)}px) perspective(2800px) rotateY(${loc.toFixed(3)}deg) scale(${sc.toFixed(5)})` }}>
              {face === 0 && <BannerFace name="tatiana" shade={shade} />}
              {face === 1 && <BannerFace name="yago" shade={shade} />}
              {face === 2 && (
                <BannerFace name="charlie" shade={shade}>
                  {t >= 13.7 && ulFrom < 1 && <Poly pts={UL_A} c1={C.cyan} c2={C.cyanL} width={14} p={ulP} from={ulFrom} vw={BAN.w} vh={BAN.h} />}
                </BannerFace>
              )}
              {ev && <EventFace zoom={evZoom(t)} radius={EV.r / evScale(t)} shade={shade} />}
            </div>
          )}
          {t < 15.4 && <Odometer t={t} dates={DATES} rolls={[13.1, 13.52]} cy={DATE_Y} size={44} color={C.grey} style={dateS} />}
          {t < 15.4 && <Roller t={t} a="Impact Hub Perchel" b="Momentum Coworking" at={13.52} cy={VEN_Y} size={54} color={C.char} style={venS} />}
        </div>
      )}
      {t >= 14.36 && exitFrom < 1 && <Poly pts={UL_B} c1={C.cyanD} c2={C.cyan} width={10} p={pB} from={exitFrom} />}
      {t >= 13.96 && dotR > 0.05 && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={dotPos[0]} cy={dotPos[1]} r={dotR} fill={lerpC(C.cyanL, C.cyan, drop)} />
        </svg>
      )}
    </div>
  );
};

export const S6: Scene = { id: "S6", t0: 12.45, t1: 15.5, C: S6C };
