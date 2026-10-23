// Scene 2 (h1 → h2): "Det bedste? Du ser den færdig, før du betaler en krone. Vil du ændre noget? Skriv det. Creoble retter det."
// One object: the phone. The thread capsule flips up into it (3D, rotateX 70 → 0, bounce), the site scrolls in it, the
// Island expands, a Liquid Glass "0 kr." tag swings in, the phone turns toward us, the headline is selected, a sage
// bubble rises and types the instruction, the headline blur-swaps, a check pops, the phone folds back into the capsule.
// Transforms only (translate / scale / rotate / clip-path on static boxes).
import React from "react";
import { C, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Check, LiquidGlass, RollNumber, f } from "../shared";
import { CX, CY, HANDOFF_HALF, Handoff, Line, MiniSite, PHONE, Phone, SCREEN } from "../v5";

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
const DEG = Math.PI / 180;
/** a bolder hold than the kit's float: bob, and a visible 3D sway (the phone is the only thing moving, so every pixel of it moves) */
const sway = (t: number, amp: number) =>
  `translateY(${amp * 9 * Math.sin(t * 2.3)}px) rotateY(${amp * 12 * Math.sin(t * 1.9 + 0.7)}deg) rotateX(${amp * 4.5 * Math.sin(t * 1.5 + 2)}deg) rotateZ(${amp * 1.6 * Math.sin(t * 1.7 + 1)}deg)`;

// the beats (seconds): voice words from words.json, fine offsets are the picture's own
const T_ISLAND_ON = 11.58;             // "færdig"
const T_ISLAND_OFF = 14.3;
const T_TAG = 13.3;                    // "krone"
const T_TAG_OUT = 13.98;
const T_TURN = 14.0;                   // "Vil"
const T_SELECT = 14.3;                 // "ændre"
const T_BUBBLE = 15.02;                // "Skriv"
const T_WIDEN = 15.42;
const T_TYPE = 15.52;
const T_SWAP = 15.94;                  // "Creoble"
const T_CHECK = 16.2;
const T_POP = 16.44;
const T_FOLD = 16.46;
const T_FOLD_END = 16.8;               // = f("h2") - 7.5 frames, the capsule is home at x 760

const OLD_HEAD = "Kom godt i bevægelse igen.";
const NEW_HEAD = "Velkommen hjem i din krop.";
const INSTRUCTION = "Gør overskriften varmere";

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

  // ── the phone's life ──────────────────────────────────────────────────────────────────────────────────────────
  const pc = spr(t, E0, 0.38, 0.82);                          // the capsule opens (clip morph), may overshoot
  const ang = 70 * (1 - spr(t, E0 + 0.02, 0.5, 0.5));         // flips up from flat, overshoots forward and settles
  const travel = 1 - spr(t, E0, 0.55, 0.9);                   // x 1160 → 960
  const fold = INOUT(clamp01((t - T_FOLD) / (T_FOLD_END - T_FOLD)));   // the phone shrinks into the capsule at x 760
  const m = pc * (1 - fold);                                  // 0 = capsule, 1 = phone
  const turn = spr(t, T_TURN, 0.55, 0.6);                     // toward the camera
  const yaw = 26 * (1 - turn) * clamp01((pc - 0.35) / 0.5);   // the capsule enters frontal; the phone is turned away once it is open
  const sc = 0.935 + 0.065 * turn;
  const lift = -34 * spr(t, T_BUBBLE - 0.02, 0.6, 0.8);        // makes room for the bubble below
  const calm = 1 - fold;
  const fl = sway(t + 0.3, clamp01((t - E0 - 0.25) / 0.45) * calm * (1 + 0.55 * kk(t, T_TURN, 0.5)));
  const dx = 200 * travel - 200 * fold;
  const dy = -34 * Math.sin(Math.PI * clamp01((t - E0) / 0.55)) * (1 - fold) + lift * calm;
  const cosA = Math.max(0.3, Math.cos(ang * DEG));
  const hl = mix(60 / cosA, PHONE.h, m);                       // local height of the clip (keeps the capsule 60 tall on screen)
  const vIn = (PHONE.h - hl) / 2;
  const hIn = (PHONE.w - mix(200, PHONE.w, m)) / 2;
  const extra = 90 * clamp01((m - 0.94) / 0.06);               // room for the phone's own shadow once it is open
  const rh = mix(30, 50, clamp01(m));
  const rv = rh / mix(1, cosA, clamp01(1 - m));
  const clip = `inset(${(vIn - extra).toFixed(2)}px ${(hIn - extra).toFixed(2)}px ${(vIn - extra).toFixed(2)}px ${(hIn - extra).toFixed(2)}px round ${rh.toFixed(2)}px / ${rv.toFixed(2)}px)`;
  const overlay = 1 - clamp01((m - 0.2) / 0.42);               // the sage capsule fades into the phone
  const wrapT = `translate(${dx}px, ${dy}px) perspective(1600px) ${fl} rotateY(${yaw}deg) rotateX(${ang}deg) scale(${sc})`;
  const shadowA = 0.2 * (1 - clamp01(m));

  // ── the site ─────────────────────────────────────────────────────────────────────────────────────────────────
  const build = mix(0.2, 1, kk(t, E0 + 0.08, 0.7));
  // two quick browse passes (down and back, down and back), a half-cosine each so the page is always moving; then a small drift
  const su = clamp01((t - 11.1) / 2.97);
  const scroll = t < 14.07 ? 372 * (0.5 - 0.5 * Math.cos(2 * Math.PI * 2 * su)) : 28 * (0.5 - 0.5 * Math.cos((t - 14.07) * 3.1));
  const sel = Math.max(0, spr(t, T_SELECT, 0.45, 0.55)) * (1 - kk(t, 16.32, 0.22));
  const swap = kk(t, T_SWAP, 0.42);
  const headline = (
    <span style={{ display: "block", position: "relative" }}>
      <span style={{ position: "absolute", left: -7, right: -7, top: -4, bottom: -4, borderRadius: 10, background: `rgba(135,168,158,${0.34 * sel})`, boxShadow: `0 0 0 2px rgba(135,168,158,${clamp01(sel) * 0.9})`,
        transform: `scale(${0.9 + 0.1 * sel})`, opacity: clamp01(sel * 4) }} />
      <span style={{ display: "grid", position: "relative" }}>
        <span style={{ gridArea: "1 / 1", opacity: 1 - swap, filter: swap > 0 ? `blur(${swap * 8}px)` : undefined, transform: `translateY(${-swap * 12}px)` }}>{OLD_HEAD}</span>
        <span style={{ gridArea: "1 / 1", opacity: swap, filter: swap < 1 ? `blur(${(1 - swap) * 8}px)` : undefined, transform: `translateY(${(1 - swap) * 14}px)` }}>{NEW_HEAD}</span>
      </span>
    </span>
  ) as unknown as string;

  // ── the Island ───────────────────────────────────────────────────────────────────────────────────────────────
  const pI = Math.max(0, spr(t, T_ISLAND_ON, 0.5, 0.58) - spr(t, T_ISLAND_OFF, 0.42, 0.8));
  const islandClip = `inset(${mix(12, 5, pI)}px ${Math.max(0, mix(90, 20, pI))}px round ${mix(13, 20, clamp01(pI))}px)`;
  const islandTxt = clamp01((pI - 0.45) * 2.4);

  // ── the headline above ───────────────────────────────────────────────────────────────────────────────────────
  const headP = kk(t, 10.42, 0.62), headOut = kk(t, 11.12, 0.3, INOUT);

  // ── the "0 kr." tag ──────────────────────────────────────────────────────────────────────────────────────────
  const tagIn = spr(t, T_TAG, 0.45, 0.6);
  const tagSwing = -58 * (1 - spr(t, T_TAG, 0.62, 0.34));
  const tagOut = INOUT(clamp01((t - T_TAG_OUT) / 0.3));
  const tagOn = t > T_TAG - 0.02 && tagOut < 1;
  const tagX = 1176, tagY = 338;

  // ── the bubble ───────────────────────────────────────────────────────────────────────────────────────────────
  const BW = 356, BH = 62, BY = 922;
  const rise = spr(t, T_BUBBLE, 0.52, 0.6);
  const widen = spr(t, T_WIDEN, 0.42, 0.7);
  const popAway = INOUT(clamp01((t - T_POP) / 0.24));
  const bubbleOn = t > T_BUBBLE - 0.02 && popAway < 1;
  const typedText = INSTRUCTION.slice(0, Math.max(0, Math.min(INSTRUCTION.length, Math.floor((t - T_TYPE) * 44))));
  const dotsA = 1 - clamp01((t - T_WIDEN) / 0.12);
  const badge = Math.max(0, spr(t, T_CHECK, 0.42, 0.5));

  return (
    <>
      {/* the line: one short line, blurs away before the next beat */}
      {headP > 0 && headOut < 1 && <Line text="Det bedste?" y={128} p={headP} out={headOut} italicWords={["bedste"]} />}

      {/* the phone, opened from the capsule */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: shadowA > 0.004 ? `drop-shadow(0 16px 16px rgba(26,22,20,${shadowA.toFixed(3)}))` : undefined }}>
        <div style={{ position: "absolute", left: CX - PHONE.w / 2, top: CY - PHONE.h / 2, width: PHONE.w, height: PHONE.h, transform: wrapT, clipPath: clip, willChange: "transform" }}>
          <Phone x={PHONE.w / 2} y={PHONE.h / 2}>
            {/* the page scrolls as one promoted layer (two stacked windows of the same site), so slow scrolling is sub-pixel smooth */}
            <div style={{ width: SCREEN.w, height: SCREEN.h, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, willChange: "transform", transform: `translate3d(0, ${-scroll}px, 0)` }}>
                <MiniSite build={build} scroll={0} headline={headline} booking={1} highlight={0} />
                <MiniSite build={build} scroll={SCREEN.h} booking={1} highlight={0} />
              </div>
            </div>
          </Phone>
          {/* the expanding Island: "Forhåndsvisning" with an eye */}
          <div style={{ position: "absolute", left: 15, top: 8, width: 270, height: 50, background: "#000", clipPath: islandClip, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: islandTxt, filter: islandTxt < 1 ? `blur(${(1 - islandTxt) * 5}px)` : undefined, transform: `scale(${0.9 + 0.1 * islandTxt})`, fontFamily: SANS, fontWeight: 500, fontSize: 19, color: C.cream, whiteSpace: "nowrap" }}>
              <Eye s={22} pupil={1 - 0.8 * Math.max(0, Math.sin((t - 12.4) * 9) * (t > 12.4 && t < 12.7 ? 1 : 0))} />
              <span>Forhåndsvisning</span>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: C.sage, marginLeft: 2, transform: `scale(${1 + 0.35 * Math.sin(t * 6)})` }} />
            </div>
          </div>
          {/* the sage capsule it came from */}
          <div style={{ position: "absolute", inset: 0, borderRadius: PHONE.r, background: C.sage, opacity: overlay, pointerEvents: "none" }} />
        </div>
      </div>

      {/* "0 kr." — Liquid Glass tag that swings in beside the phone */}
      {tagOn && (
        <div style={{ position: "absolute", left: tagX - 84, top: tagY - 36, width: 168, height: 72, transformOrigin: "0% 50%",
          transform: `translate(${-210 * tagOut}px, ${-90 * tagOut}px) rotate(${tagSwing}deg) scale(${(0.6 + 0.4 * Math.min(1.1, tagIn)) * (1 - 0.85 * tagOut)})`, opacity: 1 - tagOut * tagOut }}>
          <LiquidGlass w={168} h={72} p={Math.max(0, tagIn)} sheen={0.2 + 0.6 * kk(t, T_TAG, 0.9, INOUT)} tint="sage">
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: SERIF, fontSize: 36, color: C.ink, letterSpacing: "-0.02em" }}>
              <RollNumber value={0} from={6} p={kk(t, T_TAG + 0.12, 0.55)} size={36} />
              <span style={{ fontFamily: SERIF, fontSize: 36 }}>kr.</span>
            </div>
          </LiquidGlass>
        </div>
      )}

      {/* the instruction bubble: rises with typing dots, widens, types, gets a check, pops away */}
      {bubbleOn && (
        <div style={{ position: "absolute", left: CX - BW / 2, top: BY - BH / 2, width: BW, height: BH,
          transform: `translateY(${(1 - rise) * 96 + popAway * 34}px) scale(${(0.5 + 0.5 * rise) * (1 - 0.4 * popAway)})`, opacity: clamp01(rise * 3) * (1 - popAway), filter: popAway > 0 ? `blur(${popAway * 6}px)` : undefined }}>
          <div style={{ position: "absolute", inset: 0, background: C.sage, borderRadius: "31px 31px 9px 31px", clipPath: `inset(0 ${((BW - 96) / 2) * (1 - widen)}px 0 ${((BW - 96) / 2) * (1 - widen)}px round 31px)`, boxShadow: "0 12px 28px -14px rgba(26,22,20,0.35)" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: dotsA }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: C.ink, opacity: 0.55, transform: `translateY(${-6 * Math.max(0, Math.sin((t - T_BUBBLE) * 11 - i * 0.9))}px)` }} />)}
            </div>
            <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.ink, whiteSpace: "pre", opacity: clamp01((t - T_TYPE) * 12) }}>
              {typedText}
              {typedText.length < INSTRUCTION.length && <span style={{ display: "inline-block", width: 2, height: 28, marginLeft: 2, background: C.ink, opacity: 0.8 }} />}
            </div>
          </div>
          <div style={{ position: "absolute", right: -16, top: -18, transform: `scale(${badge})`, opacity: clamp01(badge * 4), borderRadius: 24, boxShadow: `0 0 0 4px ${C.bg}` }}>
            <Check size={42} p={1} color={C.sageDeep} style={{ opacity: 1, transform: "none" }} />
          </div>
        </div>
      )}
    </>
  );
};
