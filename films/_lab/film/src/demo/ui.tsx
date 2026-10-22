// Phone screen UIs for the realism demo, pinned onto tracked phone screens with OnQuad (screen content only).
// Each UI also exports its break-out layer (the element that lifts off the glass toward the camera: the wordmark on
// PhoneWake, the text field on PhoneForm), so footage.tsx can draw it in 3D above the screen plane. When the caller
// passes the layer's height, the UI leaves that element out and draws only its soft shadow on the glass.
import React from "react";
import { spring } from "remotion";
import { C, SERIF, SANS, SCREEN_GRAD, OUT, INOUT, ramp, clamp01, mix, Wordmark } from "./kit";

/** spring 0→1 (with overshoot) starting at local second a; frame-accurate at 60 fps, computed from t only */
export const springAt = (t: number, a: number, config: { damping?: number; stiffness?: number; mass?: number }) =>
  t <= a ? 0 : spring({ frame: (t - a) * 60, fps: 60, config });

// ---------- 1. PhoneWake (600x1300, 2.2 s) ----------
export const WAKE_W = 600;
export const WAKE_H = 1300;
const WAKE_R = Math.hypot(WAKE_W / 2, WAKE_H / 2) + 40;
const LOGO_W = 420;
const LOGO_H = (LOGO_W * 1511) / 7208;
/** the wordmark's box on the screen (UI px) */
export const WAKE_LOGO = { x: (WAKE_W - LOGO_W) / 2, y: (WAKE_H - LOGO_H) / 2, w: LOGO_W, h: LOGO_H };

/** the bloom: a fast burst that settles (speed ramp), not a linear wipe */
const wakeBloom = (t: number) => ramp(t, 0.95, 0.5, OUT);
/** the wordmark fades/focuses in on the glass */
export const wakeLogoIn = (t: number) => ramp(t, 1.38, 0.38);
/** the wordmark's height above the glass (UI px): it peels off the screen on a spring once it has landed */
export const WAKE_LOGO_LIFT = (t: number) => 70 * springAt(t, 1.56, { damping: 11, stiffness: 120, mass: 0.8 });

/** how bright the screen is (0..1) so the lead can add light spill */
export const PHONE_WAKE_GLOW = (t: number): number => {
  if (t < 0.7) return 0;
  const dot = 0.12 * ramp(t, 0.7, 0.12);
  return clamp01(mix(dot, 1, wakeBloom(t)));
};

/** The wordmark itself (the break-out layer): WAKE_LOGO.w × WAKE_LOGO.h. */
export const WakeLogo: React.FC<{ t: number }> = ({ t }) => {
  const k = wakeLogoIn(t);
  return (
    <div style={{ width: LOGO_W, height: LOGO_H, opacity: k, filter: k < 1 ? `blur(${mix(12, 0, k)}px)` : undefined }}>
      <Wordmark w={LOGO_W} />
    </div>
  );
};

/** logoZ: when given, the wordmark is drawn by the caller as a floating layer at that height (UI px) and the
 * screen keeps only its shadow. */
export const PhoneWake: React.FC<{ t: number; logoZ?: number }> = ({ t, logoZ }) => {
  const dotS = springAt(t, 0.7, { damping: 9, stiffness: 200, mass: 0.7 });
  const bloom = wakeBloom(t);
  const r = mix(6, WAKE_R, bloom);
  const edge = t >= 0.95 ? (1 - ramp(t, 1.2, 0.3)) * ramp(t, 0.95, 0.06) : 0;
  const pulse = 1 + 0.1 * Math.sin((t - 0.7) * 11);
  const logoIn = wakeLogoIn(t);
  // slow drift of the gradient so the glass is never still
  const drift = mix(1.07, 1.0, clamp01(t / 2.2));
  const driftY = mix(-14, 8, clamp01(t / 2.2));
  const z = logoZ ?? 0;
  const shadowK = clamp01(z / 30) * (1 - ramp(z, 160, 400, (x) => x));

  return (
    <div style={{ position: "relative", width: WAKE_W, height: WAKE_H, overflow: "hidden", background: "#020303" }}>
      {/* the bloomed gradient, revealed by a growing circle */}
      {t >= 0.95 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `circle(${r}px at 50% 50%)` }}>
          <div style={{ position: "absolute", inset: -40, background: SCREEN_GRAD, transform: `translateY(${driftY}px) scale(${drift})` }} />
          {/* soft centre hot spot */}
          <div style={{ position: "absolute", inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${0.4 * (1 - bloom * 0.6)}) 0%, rgba(255,255,255,0) 55%)` }} />
        </div>
      )}
      {/* bright glow edge riding the circle */}
      {edge > 0.001 && (
        <div style={{
          position: "absolute", left: WAKE_W / 2 - r, top: WAKE_H / 2 - r, width: r * 2, height: r * 2,
          borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.85 * edge})`,
          boxShadow: `0 0 60px 18px rgba(185,214,204,${0.8 * edge}), inset 0 0 50px 10px rgba(255,255,255,${0.5 * edge})`,
        }} />
      )}
      {/* the sage dot: pops in on a spring, breathes, then is swallowed by the bloom */}
      {t >= 0.7 && bloom < 1 && (
        <div style={{
          position: "absolute", left: WAKE_W / 2 - 7, top: WAKE_H / 2 - 7, width: 14, height: 14, borderRadius: "50%",
          background: C.glow, boxShadow: `0 0 40px ${C.sage}, 0 0 14px ${C.sageLight}`,
          opacity: clamp01(dotS * 1.5) * (1 - bloom),
          transform: `scale(${dotS * pulse * mix(1, 2.2, ramp(t, 0.86, 0.12, INOUT))})`,
        }} />
      )}
      {/* the wordmark: on the glass, or (logoZ given) only its shadow under the floating layer */}
      {t >= 1.38 && logoZ === undefined && (
        <div style={{ position: "absolute", left: WAKE_LOGO.x, top: WAKE_LOGO.y }}><WakeLogo t={t} /></div>
      )}
      {t >= 1.38 && logoZ !== undefined && shadowK > 0.001 && (
        <div style={{
          position: "absolute", left: WAKE_LOGO.x, top: WAKE_LOGO.y, opacity: 0.42 * shadowK * logoIn,
          transform: `translate(${z * 0.06}px, ${z * 0.42}px) scale(${1 + z * 0.0012})`,
          filter: `brightness(0) blur(${2 + z * 0.13}px)`,
        }}>
          <Wordmark w={LOGO_W} />
        </div>
      )}
    </div>
  );
};

// ---------- 2. PhoneForm (750x1334, 1.45 s) ----------
export const FORM_W = 750;
export const FORM_H = 1334;
const TYPED = "Holm Fysioterapi i Aarhus";
/** the text field's box on the screen (UI px) */
export const FORM_FIELD = { x: 60, y: 600, w: 630, h: 120 };
const BTN = { x: 60, y: 770, w: 630, h: 112 };
/** where the button is pressed (UI px): the white wipe and the camera's push start here */
export const FORM_PRESS = { u: BTN.x + BTN.w / 2, v: BTN.y + BTN.h / 2 };
const T_TYPE = 0.42;
const T_TYPED = 0.98;
const T_PRESS = 1.0;
const T_RELEASE = 1.055;

export const PHONE_FORM_GLOW = (_t: number): number => 1;
const fieldIn = (t: number) => ramp(t, 0.2, 0.3);
/** the field's height above the glass (UI px): it lifts toward the camera on a spring as the typing starts */
export const FORM_FIELD_LIFT = (t: number) => 95 * springAt(t, 0.46, { damping: 12, stiffness: 115, mass: 0.9 });

/** The text field (the break-out layer): FORM_FIELD.w × FORM_FIELD.h. focus 0..1 tints the border sage. */
export const FormField: React.FC<{ t: number; focus?: number }> = ({ t, focus = 0 }) => {
  const n = Math.floor(clamp01((t - T_TYPE) / (T_TYPED - T_TYPE)) * TYPED.length + 1e-6);
  const typed = TYPED.slice(0, t < T_TYPE ? 0 : n);
  const typing = t >= T_TYPE && t < T_TYPED;
  const caretOn = typing || Math.floor(t * 3.2) % 2 === 0;
  const k = fieldIn(t);
  return (
    <div style={{
      width: FORM_FIELD.w, height: FORM_FIELD.h, boxSizing: "border-box", borderRadius: 20,
      border: `${mix(1.5, 2.5, focus)}px solid ${focus > 0.5 ? C.sage : C.line}`, background: C.white,
      display: "flex", alignItems: "center", padding: "0 32px",
      fontFamily: SANS, fontWeight: 400, fontSize: 36, color: C.ink, whiteSpace: "pre",
      opacity: k, filter: k < 1 ? `blur(${mix(8, 0, k)}px)` : undefined,
    }}>
      <span>{typed}</span>
      <span style={{ display: "inline-block", width: 3, height: 44, marginLeft: 3, borderRadius: 2, background: C.sage, opacity: caretOn ? 1 : 0 }} />
    </div>
  );
};

/** fieldZ: when given, the field is drawn by the caller as a floating layer at that height (UI px) and the screen
 * keeps only its socket and shadow. */
export const PhoneForm: React.FC<{ t: number; fieldZ?: number }> = ({ t, fieldZ }) => {
  const labelIn = ramp(t, 0.12, 0.32);
  const fk = fieldIn(t);
  // the press: down fast, released on a spring that overshoots
  const btnScale = t < T_RELEASE
    ? mix(1, 0.93, ramp(t, T_PRESS, T_RELEASE - T_PRESS, INOUT))
    : mix(0.93, 1, springAt(t, T_RELEASE, { damping: 8, stiffness: 260, mass: 0.6 }));
  const press = t < T_PRESS ? 0 : 1 - ramp(t, T_RELEASE, 0.25);
  const ripple = ramp(t, T_PRESS, 0.3, OUT);
  // the white wipe out of the pressed button (the next beat is white)
  const wipe = ramp(t, 1.07, 0.3, OUT);
  const z = fieldZ ?? 0;
  const shadowK = clamp01(z / 25) * (1 - ramp(z, 150, 350, (x) => x));

  return (
    <div style={{ position: "relative", width: FORM_W, height: FORM_H, overflow: "hidden", background: C.bg }}>
      {/* wordmark */}
      <div style={{ position: "absolute", left: 0, top: 120, width: FORM_W, display: "flex", justifyContent: "center" }}>
        <Wordmark w={180} dark />
      </div>
      {/* label */}
      <div style={{
        position: "absolute", left: 60, top: 420, width: 630,
        fontFamily: SERIF, fontWeight: 400, fontSize: 54, lineHeight: 1.15, color: C.ink, textAlign: "left",
        opacity: labelIn, filter: labelIn < 1 ? `blur(${mix(10, 0, labelIn)}px)` : undefined,
        transform: `translateY(${mix(18, 0, labelIn)}px)`,
      }}>
        Fortæl kort om<br />din virksomhed
      </div>
      {/* text field: on the glass, or (fieldZ given) its socket and the floating card's shadow */}
      {fieldZ === undefined ? (
        <div style={{ position: "absolute", left: FORM_FIELD.x, top: FORM_FIELD.y }}><FormField t={t} /></div>
      ) : (
        <>
          <div style={{
            position: "absolute", left: FORM_FIELD.x, top: FORM_FIELD.y, width: FORM_FIELD.w, height: FORM_FIELD.h,
            boxSizing: "border-box", borderRadius: 20, border: `1.5px dashed ${C.line}`, background: "rgba(232,229,223,0.35)",
            opacity: fk * clamp01(z / 30),
          }} />
          {shadowK > 0.001 && (
            <div style={{
              position: "absolute", left: FORM_FIELD.x, top: FORM_FIELD.y, width: FORM_FIELD.w, height: FORM_FIELD.h,
              borderRadius: 24, background: "rgba(26,22,20,1)", opacity: 0.22 * shadowK * fk,
              transform: `translate(${z * 0.05}px, ${z * 0.4}px) scale(${1 + z * 0.001})`, filter: `blur(${6 + z * 0.16}px)`,
            }} />
          )}
        </>
      )}
      {/* button */}
      <div style={{
        position: "absolute", left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, borderRadius: BTN.h / 2, overflow: "hidden",
        background: C.ink, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SANS, fontWeight: 500, fontSize: 36,
        opacity: fk, transform: `translateY(${mix(14, 0, fk)}px) scale(${btnScale})`,
        boxShadow: `0 ${mix(14, 5, press)}px ${mix(30, 12, press)}px rgba(26,22,20,0.18)`,
      }}>
        {t >= T_PRESS && ripple < 1 && (
          <div style={{
            position: "absolute", left: BTN.w / 2 - 340, top: BTN.h / 2 - 340, width: 680, height: 680, borderRadius: "50%",
            background: C.sage, opacity: 0.55 * (1 - ripple), transform: `scale(${mix(0.05, 1, ripple)})`,
          }} />
        )}
        <span style={{ position: "relative" }}>Byg min side</span>
      </div>
      {wipe > 0 && (
        <div style={{
          position: "absolute", left: FORM_PRESS.u - 1200, top: FORM_PRESS.v - 1200, width: 2400, height: 2400, borderRadius: "50%",
          background: C.bg, transform: `scale(${mix(0.02, 1, wipe)})`,
          boxShadow: `0 0 80px 40px ${C.bg}`,
        }} />
      )}
    </div>
  );
};
