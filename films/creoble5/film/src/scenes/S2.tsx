// Scene 2 (h1 → h2), REVISION 1: "Det bedste? Du ser den færdig, før du betaler en krone. Vil du ændre noget? Skriv det.
// Creoble retter det." One object, the phone at 1.4× (420 × 896), centred. Every second SHOWS what the voice says:
// the site builds, one long steady scroll through the finished site, "0 kr." rolls in a big glass tag, the headline is
// selected, the instruction is typed in a bubble and sent, the headline deletes backwards and RETYPES, a check ticks.
// Transforms only (translate / scale / rotate / clip-path on static boxes). No sway, no float.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, HOLM, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Ico, LiquidGlass, RollNumber, f } from "../shared";
import { CX, CY, HANDOFF_HALF, Handoff, Line, MiniSite, PHONE, Phone, SCREEN, TYPE } from "../v5";

// ── local helpers (times in seconds) ─────────────────────────────────────────────────────────────────────────────
const kk = (t: number, at: number, dur: number, ease: (x: number) => number = OUT) => ease(clamp01((t - at) / dur));
/** a damped spring from time `at` (s): response (s) and damping ratio; < 1 overshoots and settles, passes 1 */
const spr = (t: number, at: number, response = 0.4, damping = 1) => {
  const x = t - at;
  if (x <= 0) return 0;
  const w0 = (2 * Math.PI) / response;
  if (damping >= 1) return 1 - (1 + w0 * x) * Math.exp(-w0 * x);
  const wd = w0 * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * w0 * x) * (Math.cos(wd * x) + ((damping * w0) / wd) * Math.sin(wd * x));
};
/** a distance D covered from a to b at a steady speed, with ramps of r seconds at both ends (a trapezoid velocity) */
const trap = (t: number, a: number, b: number, D: number, r: number) => {
  const T = b - a, v = D / (T - r), x = t - a;
  if (x <= 0) return 0;
  if (x >= T) return D;
  if (x < r) return (v * x * x) / (2 * r);
  if (x < T - r) return v * (x - r / 2);
  const y = T - x;
  return D - (v * y * y) / (2 * r);
};
const DEG = Math.PI / 180;
// the finished site is a long page: MiniSite's own page (≈ 990 pt) plus a closing block below it (the stretch photo, the
// booking buttons, the domain), so the steady scroll has something to show for the whole voice line
const TAIL_Y = 1000, PAGE_H = 1380;
const SiteTail: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: TAIL_Y, width: SCREEN.w, padding: "0 20px", boxSizing: "border-box", fontFamily: SANS, color: HOLM.ink }}>
    <div style={{ height: 240, borderRadius: 16, overflow: "hidden" }}><Img src={staticFile("img/holm-stretch.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
      <div style={{ height: 40, padding: "0 16px", borderRadius: 999, background: HOLM.accent, color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>Book tid</div>
      <div style={{ height: 40, padding: "0 16px", borderRadius: 999, border: `1.5px solid ${HOLM.ink}22`, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>Behandlinger</div>
    </div>
    <div style={{ marginTop: 24, fontSize: 13, fontWeight: 600 }}>Holm Fysioterapi</div>
    <div style={{ marginTop: 4, fontSize: 13, color: HOLM.muted }}>holmfysio.dk</div>
  </div>
);
const HOLM_ACCENT = "#2E4A52";
/** iOS-style press: 0 → 1 in 0.1 s, held, released */
const pressAt = (t: number, at: number, hold = 0.1) => {
  const x = t - at;
  if (x < 0) return 0;
  if (x < 0.08) return x / 0.08;
  if (x < 0.08 + hold) return 1;
  return Math.exp(-(x - 0.08 - hold) * 14);
};

// ── geometry ─────────────────────────────────────────────────────────────────────────────────────────────────────
// The phone is laid out natively at 2.1× (630 × 1344: text is rasterized sharp for the focus push) and sits at 1.4× (420 × 896)
// through a transform scale of 2/3; the camera push on the headline scales it to 1.0, the pull-back returns it to 2/3.
const PZ = 2.1, SN = 1.4 / 2.1;
const PW = PHONE.w * PZ, PH = PHONE.h * PZ;
const PH_N = PHONE.h * 1.4;                      // the resting height on screen

// ── the beats (seconds): voice words from words.json, offsets are the picture's own ─────────────────────────────
const T_SCROLL = 10.6, T_SCROLL_END = 13.55;     // one long steady pass down the finished site (≈ 6.6 px per frame)
const T_RET = 13.6, T_RET_END = 14.15;           // a fast eased return to the top
const T_ISLAND_ON = 11.58;                       // "færdig"
const T_ISLAND_OFF = 14.3;
const T_TAG = 13.3;                              // "krone"
const T_TAG_OUT = 13.98;
const T_PUSH = 14.2, T_PUSH_END = 14.65;         // "Vil du ændre noget?": the camera pushes in on the headline (fast, eased)
const T_PULL = 16.3, T_PULL_END = 16.75;         // on the check it pulls back out to 1.4×
const T_TAP = 14.4;                              // "ændre": a finger taps the headline
const T_SELECT = 14.5;
const T_BUBBLE = 14.76;                          // "Skriv"
const T_WIDEN = 14.98;
const T_TYPE = 15.08;
const T_SEND = 15.55;
const T_DEL = 15.6;                              // "Creoble": the old headline deletes backwards
const T_RETYPE = 15.86;                          // ... and the corrected one types
const T_CHECK = 16.28;
const T_POP = 16.5;
const T_FOLD = 16.52;                            // the phone folds back into the capsule
const T_FOLD_END = 16.8;                         // = f("h2") - 7.5 frames: the capsule is home at x 760

const OLD_HEAD = "Kom godt i bevægelse igen.";
const NEW_HEAD = "Velkommen hjem i din krop.";
const INSTRUCTION = "Gør overskriften varmere";

/** text laid out in full (so wrapping never changes) with only the first n characters visible, and an optional caret */
const Typed: React.FC<{ text: string; n: number; caret?: boolean; caretColor?: string; blink?: number }> = ({ text, n, caret = false, caretColor = C.sage, blink = 1 }) => (
  <>
    {text.split("").map((ch, i) => (
      <React.Fragment key={i}>
        {caret && i === n && <span style={{ position: "relative", display: "inline-block", width: 0 }}><i style={{ position: "absolute", left: 1, top: "0.1em", width: 3, height: "0.95em", borderRadius: 2, background: caretColor, opacity: blink }} /></span>}
        <span style={{ visibility: i < n ? "visible" : "hidden" }}>{ch}</span>
      </React.Fragment>
    ))}
    {caret && n >= text.length && <span style={{ position: "relative", display: "inline-block", width: 0 }}><i style={{ position: "absolute", left: 1, top: "0.1em", width: 3, height: "0.95em", borderRadius: 2, background: caretColor, opacity: blink }} /></span>}
  </>
);

const Eye: React.FC<{ s?: number; c?: string; pupil?: number }> = ({ s = 22, c = C.cream, pupil = 1 }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
    <path d="M4 24 C10 13 17 9 24 9 C31 9 38 13 44 24 C38 35 31 39 24 39 C17 39 10 35 4 24 Z" />
    <circle cx="24" cy="24" r={6.5 * pupil} fill={c} stroke="none" />
  </svg>
);

export const Scene2: React.FC<{ g: number }> = ({ g }) => {
  const h1 = f("h1"), h2 = f("h2");
  if (g <= h1 + HANDOFF_HALF) return <Handoff g={g} at="h1" />;
  if (g >= h2 - HANDOFF_HALF) return <Handoff g={g} at="h2" />;

  const t = g / 30;
  const E0 = (h1 + HANDOFF_HALF) / 30;    // the capsule is at x 1160 here

  // ── the phone: opens out of the capsule, flips up from flat, folds back into the capsule ─────────────────────
  const pc = spr(t, E0, 0.38, 0.82);                          // the capsule opens (clip morph), may overshoot
  const ang = 70 * (1 - spr(t, E0 + 0.02, 0.5, 0.5));         // flips up from flat, overshoots forward and settles
  const travel = 1 - spr(t, E0, 0.55, 0.9);                   // x 1160 → 960
  const fold = INOUT(clamp01((t - T_FOLD) / (T_FOLD_END - T_FOLD)));
  const m = pc * (1 - fold);                                  // 0 = capsule, 1 = phone
  const dx = 200 * travel - 200 * fold;
  // the camera push: scale the phone up around the headline (1.4× → 2.1×) and back
  const pp = INOUT(clamp01((t - T_PUSH) / (T_PUSH_END - T_PUSH))) * (1 - INOUT(clamp01((t - T_PULL) / (T_PULL_END - T_PULL))));
  const sc = mix(SN, 1, pp);
  const FOCUS_Y = 330, headLocalY = (144 - PHONE.h / 2) * PZ;   // the headline sits at phone point y 144
  const pushY = (FOCUS_Y - CY - headLocalY) * pp;
  const dy = -34 * Math.sin(Math.PI * clamp01((t - E0) / 0.55)) * (1 - fold) + pushY;
  const cosA = Math.max(0.3, Math.cos(ang * DEG));
  const hl = mix(60 / (sc * cosA), PH, m);                     // local height of the clip (keeps the capsule 60 tall on screen)
  const vIn = (PH - hl) / 2;
  const hIn = (PW - mix(200 / sc, PW, m)) / 2;
  const extra = 200 * clamp01((m - 0.94) / 0.06);              // room for the phone's own shadow once it is open
  const rh = mix(30 / sc, PHONE.r * PZ, clamp01(m));
  const rv = rh / mix(1, cosA, clamp01(1 - m));
  const clip = `inset(${(vIn - extra).toFixed(2)}px ${(hIn - extra).toFixed(2)}px ${(vIn - extra).toFixed(2)}px ${(hIn - extra).toFixed(2)}px round ${rh.toFixed(2)}px / ${rv.toFixed(2)}px)`;
  const overlay = 1 - clamp01((m - 0.2) / 0.42);               // the sage capsule fades into the phone
  const wrapT = `translate(${dx}px, ${dy}px) perspective(2200px) rotateX(${ang}deg) scale(${sc})`;
  const shadowA = 0.2 * (1 - clamp01(m));

  // ── the site: it builds, then ONE long steady scroll down (≥ 4 px/frame), a fast eased return ────────────────
  const build = mix(0.2, 1, kk(t, E0 + 0.05, 0.55));
  const down = trap(t, T_SCROLL, T_SCROLL_END, PAGE_H - SCREEN.h, 0.25);
  const back = INOUT(clamp01((t - T_RET) / (T_RET_END - T_RET)));
  const scroll = down * (1 - back);

  // ── the headline: tapped, selected, deleted backwards, retyped ──────────────────────────────────────────────
  const sel = Math.max(0, spr(t, T_SELECT, 0.45, 0.55)) * (1 - kk(t, T_RETYPE + 0.05, 0.25, INOUT));
  const nOld = t < T_DEL ? OLD_HEAD.length : Math.max(0, OLD_HEAD.length - Math.floor((t - T_DEL) * (OLD_HEAD.length / 0.26)));
  const nNew = Math.max(0, Math.min(NEW_HEAD.length, Math.floor((t - T_RETYPE) * (NEW_HEAD.length / 0.4))));
  const deleting = t >= T_DEL && nOld > 0;
  const typing = t >= T_RETYPE && t < T_CHECK + 0.1;
  const blink = 0.45 + 0.55 * (Math.sin(t * 16) > 0 ? 1 : 0);
  const headline = (
    <span style={{ display: "block", position: "relative" }}>
      <span style={{ position: "absolute", left: -7, right: -7, top: -4, bottom: -4, borderRadius: 10, background: `rgba(135,168,158,${0.34 * sel})`, boxShadow: `0 0 0 2px rgba(135,168,158,${clamp01(sel) * 0.9})`,
        transform: `scale(${0.9 + 0.1 * sel})`, opacity: clamp01(sel * 4) }} />
      <span style={{ display: "grid", position: "relative" }}>
        <span style={{ gridArea: "1 / 1" }}><Typed text={OLD_HEAD} n={nOld} caret={deleting || (t >= T_DEL && nOld === 0 && t < T_RETYPE)} caretColor={HOLM_ACCENT} blink={blink} /></span>
        <span style={{ gridArea: "1 / 1" }}><Typed text={NEW_HEAD} n={nNew} caret={typing} caretColor={HOLM_ACCENT} blink={blink} /></span>
      </span>
    </span>
  ) as unknown as string;
  // the finger tap on the headline (a touch ripple, in phone points)
  const tapP = kk(t, T_TAP, 0.4);
  const tapDown = pressAt(t, T_TAP, 0.08);

  // ── the Island ───────────────────────────────────────────────────────────────────────────────────────────────
  const pI = Math.max(0, spr(t, T_ISLAND_ON, 0.5, 0.58) - spr(t, T_ISLAND_OFF, 0.42, 0.8));
  const islandClip = `inset(${mix(12, 5, pI)}px ${Math.max(0, mix(90, 20, pI))}px round ${mix(13, 20, clamp01(pI))}px)`;
  const islandTxt = clamp01((pI - 0.45) * 2.4);

  // ── the line at the left: one short line, blurs away before the scroll takes over ────────────────────────────
  const headP = kk(t, E0 + 0.1, 0.62), headOut = kk(t, 11.12, 0.3, INOUT);

  // ── the big glass tag "0 kr." ────────────────────────────────────────────────────────────────────────────────
  const TW = 340, TH = 152, tagX = 1292, tagY = 400;
  const tagIn = spr(t, T_TAG, 0.45, 0.6);
  const tagSwing = -58 * (1 - spr(t, T_TAG, 0.62, 0.34));
  const tagOut = INOUT(clamp01((t - T_TAG_OUT) / 0.3));
  const tagOn = t > T_TAG - 0.02 && tagOut < 1;
  const toIslandX = CX - tagX, toIslandY = CY - PH_N / 2 + 46 - tagY;

  // ── the instruction bubble, at the left: rises with dots, widens, types, is sent ─────────────────────────────
  const BW = 640, BH = 104, BX = 960, BY = 905;
  const rise = spr(t, T_BUBBLE, 0.52, 0.6);
  const widen = spr(t, T_WIDEN, 0.42, 0.7);
  const popAway = INOUT(clamp01((t - T_POP) / 0.24));
  const bubbleOn = t > T_BUBBLE - 0.02 && popAway < 1;
  const nIns = Math.max(0, Math.min(INSTRUCTION.length, Math.floor((t - T_TYPE) * 60)));
  const dotsA = 1 - clamp01((t - T_WIDEN) / 0.12);
  const sendP = pressAt(t, T_SEND, 0.1);
  const checkP = Math.max(0, spr(t, T_CHECK, 0.42, 0.5));
  const gone = clamp01((t - T_SEND - 0.12) / 0.3);              // the sent text lifts off toward the phone
  const hInset = ((BW - 112) / 2) * (1 - widen);

  return (
    <>
      {headP > 0 && headOut < 1 && <Line text="Det bedste?" x={400} y={CY} p={headP} out={headOut} size={TYPE.head} italicWords={["bedste"]} />}

      {/* the phone, opened from the capsule */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: shadowA > 0.004 ? `drop-shadow(0 20px 20px rgba(26,22,20,${shadowA.toFixed(3)}))` : undefined }}>
        <div style={{ position: "absolute", left: CX - PW / 2, top: CY - PH / 2, width: PW, height: PH, transform: wrapT, clipPath: clip }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, zoom: PZ }}>
            <Phone x={PHONE.w / 2} y={PHONE.h / 2}>
              {/* the page scrolls as one promoted layer (two stacked windows of the same site) */}
              <div style={{ width: SCREEN.w, height: SCREEN.h, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, willChange: t < T_RET_END + 0.12 ? "transform" : "auto", transform: `translate3d(0, ${-scroll}px, 0)` }}>
                  <MiniSite build={build} scroll={0} headline={headline} booking={1} highlight={0} />
                  <MiniSite build={build} scroll={SCREEN.h} booking={1} highlight={0} />
                  <SiteTail />
                </div>
              </div>
            </Phone>
            {/* the finger tap on the headline */}
            {tapP > 0 && tapP < 1 && (
              <div style={{ position: "absolute", left: 92 - 22, top: 146 - 22, width: 44, height: 44, borderRadius: 22, background: "rgba(73,93,88,0.30)", opacity: (1 - tapP) * (0.4 + 0.6 * tapDown),
                transform: `scale(${0.55 + 1.5 * OUT(tapP)})` }} />
            )}
            {/* the expanding Island: "Forhåndsvisning" with an eye */}
            <div style={{ position: "absolute", left: 15, top: 8, width: 270, height: 50, background: "#000", clipPath: islandClip, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: islandTxt, filter: islandTxt < 1 ? `blur(${(1 - islandTxt) * 5}px)` : undefined, transform: `scale(${0.9 + 0.1 * islandTxt})`, fontFamily: SANS, fontWeight: 500, fontSize: 19, color: C.cream, whiteSpace: "nowrap" }}>
                <Eye s={22} pupil={1 - 0.8 * Math.max(0, Math.sin((t - 12.4) * 9) * (t > 12.4 && t < 12.7 ? 1 : 0))} />
                <span>Forhåndsvisning</span>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: C.sage, marginLeft: 2 }} />
              </div>
            </div>
            {/* the sage capsule it came from */}
            <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: C.sage, opacity: overlay, pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      {/* "0 kr." — a big Liquid Glass tag that swings in beside the phone and rolls its number */}
      {tagOn && (
        <div style={{ position: "absolute", left: tagX - TW / 2, top: tagY - TH / 2, width: TW, height: TH, transformOrigin: "0% 50%",
          transform: `translate(${toIslandX * tagOut}px, ${toIslandY * tagOut}px) rotate(${tagSwing}deg) scale(${(0.6 + 0.4 * Math.min(1.1, tagIn)) * (1 - 0.85 * tagOut)})`, opacity: 1 - tagOut * tagOut }}>
          <LiquidGlass w={TW} h={TH} p={Math.max(0, tagIn)} sheen={0.2 + 0.6 * kk(t, T_TAG, 0.9, INOUT)} tint="sage">
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: SERIF, fontSize: 80, color: C.ink, letterSpacing: "-0.02em" }}>
              <RollNumber value={0} from={6} p={kk(t, T_TAG + 0.1, 0.6)} size={80} />
              <span style={{ fontFamily: SERIF, fontSize: 80, lineHeight: 1 }}>kr.</span>
            </div>
          </LiquidGlass>
        </div>
      )}

      {/* the instruction: a big sage bubble with typing dots, then the text, then it is sent */}
      {bubbleOn && (
        <div style={{ position: "absolute", left: BX - BW / 2, top: BY - BH / 2, width: BW, height: BH,
          transform: `translate(${gone * 70}px, ${(1 - rise) * 120 + popAway * 40}px) scale(${(0.5 + 0.5 * rise) * (1 - 0.35 * popAway)})`, opacity: clamp01(rise * 3) * (1 - popAway), filter: popAway > 0 ? `blur(${popAway * 6}px)` : undefined }}>
          <div style={{ position: "absolute", inset: 0, background: C.sage, borderRadius: "52px 52px 14px 52px", clipPath: `inset(0 ${hInset}px 0 ${hInset}px round 52px)`, boxShadow: "0 16px 34px -16px rgba(26,22,20,0.38)" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 11, opacity: dotsA }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.ink, opacity: 0.55, transform: `translateY(${-9 * Math.max(0, Math.sin((t - T_BUBBLE) * 11 - i * 0.9))}px)` }} />)}
            </div>
            <div style={{ position: "absolute", left: 38, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.ink, whiteSpace: "pre", opacity: clamp01((t - T_TYPE) * 12) * (1 - gone) }}>
              <Typed text={INSTRUCTION} n={nIns} caret={nIns < INSTRUCTION.length || t < T_SEND} caretColor={C.ink} blink={blink} />
            </div>
            {/* the send button: pressed on "Skriv det", a check once the headline is corrected */}
            <div style={{ position: "absolute", right: 18, top: (BH - 68) / 2, width: 68, height: 68, borderRadius: 34, background: C.sageDeep, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01((t - T_TYPE) * 6),
              transform: `scale(${(1 - 0.14 * sendP) * (1 + 0.3 * Math.max(0, checkP - 0.6) * (checkP < 1 ? 1 : 0))})` }}>
              <div style={{ position: "absolute", opacity: 1 - clamp01(checkP * 3), transform: `scale(${1 - clamp01(checkP * 3) * 0.4})` }}><Ico n="arrow" s={36} c="#fff" w={2.8} /></div>
              <div style={{ position: "absolute", opacity: clamp01(checkP * 2.5), transform: `scale(${0.4 + 0.6 * Math.min(1.15, checkP)})` }}><Ico n="check" s={40} c="#fff" w={3} /></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
