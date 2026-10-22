// Phone screen UIs for the realism demo, pinned onto tracked phone screens with OnQuad (screen content only).
import React from "react";
import { C, SERIF, SANS, SCREEN_GRAD, OUT, INOUT, ramp, clamp01, mix, Wordmark } from "./kit";

// ---------- 1. PhoneWake (600x1300, 2.2 s) ----------
const WAKE_W = 600;
const WAKE_H = 1300;
const WAKE_R = Math.hypot(WAKE_W / 2, WAKE_H / 2) + 40;

/** how bright the screen is (0..1) so the lead can add light spill */
export const PHONE_WAKE_GLOW = (t: number): number => {
  if (t < 0.7) return 0;
  const dot = 0.1 * ramp(t, 0.7, 0.12);
  const bloom = ramp(t, 0.95, 0.45, INOUT);
  return clamp01(mix(dot, 1, bloom));
};

export const PhoneWake: React.FC<{ t: number }> = ({ t }) => {
  const dotIn = ramp(t, 0.7, 0.15);
  const bloom = ramp(t, 0.95, 0.45, INOUT);
  const r = mix(6, WAKE_R, bloom);
  const edge = t >= 0.95 ? (1 - ramp(t, 1.3, 0.25)) * ramp(t, 0.95, 0.08) : 0;
  const pulse = 1 + 0.08 * Math.sin((t - 0.7) * 9);
  const logoIn = ramp(t, 1.45, 0.5);
  const logoScale = mix(1.03, 1.0, ramp(t, 1.45, 0.75, OUT));
  // slow drift of the gradient so no frame is ever still
  const drift = mix(1.06, 1.0, clamp01(t / 2.2));
  const driftY = mix(-12, 6, clamp01(t / 2.2));

  return (
    <div style={{ position: "relative", width: WAKE_W, height: WAKE_H, overflow: "hidden", background: "#020303" }}>
      {/* the bloomed gradient, revealed by a growing circle */}
      {t >= 0.95 && (
        <div style={{
          position: "absolute", inset: 0,
          clipPath: `circle(${r}px at 50% 50%)`,
        }}>
          <div style={{
            position: "absolute", inset: -40, background: SCREEN_GRAD,
            transform: `translateY(${driftY}px) scale(${drift})`,
          }} />
          {/* soft centre hot spot */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${0.35 * (1 - bloom * 0.6)}) 0%, rgba(255,255,255,0) 55%)`,
          }} />
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
      {/* the sage dot */}
      {t >= 0.7 && bloom < 1 && (
        <div style={{
          position: "absolute", left: WAKE_W / 2 - 6, top: WAKE_H / 2 - 6, width: 12, height: 12, borderRadius: "50%",
          background: C.glow, boxShadow: `0 0 40px ${C.sage}, 0 0 14px ${C.sageLight}`,
          opacity: dotIn * (1 - bloom),
          transform: `scale(${mix(0.4, 1, dotIn) * pulse})`,
        }} />
      )}
      {/* the wordmark */}
      {t >= 1.45 && (
        <div style={{
          position: "absolute", left: 0, top: 0, width: WAKE_W, height: WAKE_H,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: logoIn, filter: `blur(${mix(14, 0, logoIn)}px)`,
          transform: `scale(${logoScale})`,
        }}>
          <Wordmark w={420} />
        </div>
      )}
    </div>
  );
};

// ---------- 2. PhoneForm (750x1334, 1.4 s) ----------
const FORM_W = 750;
const FORM_H = 1334;
const TYPED = "Holm Fysioterapi i Aarhus";

export const PHONE_FORM_GLOW = (_t: number): number => 1;

export const PhoneForm: React.FC<{ t: number }> = ({ t }) => {
  const labelIn = ramp(t, 0, 0.3);
  const fieldIn = ramp(t, 0.08, 0.3);
  const n = Math.floor(clamp01((t - 0.35) / 0.75) * TYPED.length + 1e-6);
  const typed = TYPED.slice(0, t < 0.35 ? 0 : n);
  const typing = t >= 0.35 && t < 1.1;
  const caretOn = typing || Math.floor(t * 3.2) % 2 === 0;
  const press = t < 1.15 ? 0 : t < 1.23 ? ramp(t, 1.15, 0.08, INOUT) : 1 - ramp(t, 1.23, 0.15, OUT);
  const btnScale = mix(1, 0.96, press);
  // slow upward drift of the whole UI so the frame keeps moving
  const driftY = mix(6, -6, clamp01(t / 1.4));

  return (
    <div style={{ position: "relative", width: FORM_W, height: FORM_H, overflow: "hidden", background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${driftY}px)` }}>
        {/* wordmark */}
        <div style={{ position: "absolute", left: 0, top: 120, width: FORM_W, display: "flex", justifyContent: "center" }}>
          <Wordmark w={180} dark />
        </div>
        {/* label */}
        <div style={{
          position: "absolute", left: 60, top: 420, width: 630,
          fontFamily: SERIF, fontWeight: 400, fontSize: 54, lineHeight: 1.15, color: C.ink, textAlign: "left",
          opacity: labelIn, filter: `blur(${mix(10, 0, labelIn)}px)`,
          transform: `translateY(${mix(10, 0, labelIn)}px)`,
        }}>
          Fortæl kort om<br />din virksomhed
        </div>
        {/* text field */}
        <div style={{
          position: "absolute", left: 60, top: 600, width: 630, height: 120, boxSizing: "border-box",
          borderRadius: 20, border: `1.5px solid ${C.line}`, background: C.white,
          display: "flex", alignItems: "center", padding: "0 32px",
          fontFamily: SANS, fontWeight: 400, fontSize: 36, color: C.ink, whiteSpace: "pre",
          opacity: fieldIn, filter: `blur(${mix(8, 0, fieldIn)}px)`,
        }}>
          <span>{typed}</span>
          <span style={{
            display: "inline-block", width: 3, height: 44, marginLeft: 3, borderRadius: 2,
            background: C.sage, opacity: caretOn ? 1 : 0,
          }} />
        </div>
        {/* button */}
        <div style={{
          position: "absolute", left: 60, top: 770, width: 630, height: 112, borderRadius: 56,
          background: C.ink, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: SANS, fontWeight: 500, fontSize: 36,
          opacity: fieldIn, transform: `scale(${btnScale})`,
          boxShadow: `0 ${mix(14, 6, press)}px ${mix(30, 14, press)}px rgba(26,22,20,0.18)`,
        }}>
          Byg min side
        </div>
      </div>
    </div>
  );
};
