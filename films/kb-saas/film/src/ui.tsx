// The interface pieces, drawn in K.B's site style (rounded white cards on the pale canvas, navy ink, Montserrat,
// the cyan accent as shapes), at two to four times real size so they read on a phone.
import React from "react";
import { C, F, SHADOW, SHADOW_SOFT, clamp01, lerp, mix, rgba } from "./lib";
import { Icon } from "./icons";

/** The K.B logo tile (the site's favicon, rebuilt as vectors): white Copperplate "K.B" on the navy gradient. */
export const KBTile: React.FC<{ size: number; letters?: number; style?: React.CSSProperties }> = ({ size, letters = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={style}>
    <defs><linearGradient id="kbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#354C67" /><stop offset="1" stopColor="#3D5574" /></linearGradient></defs>
    <rect width="512" height="512" rx="38" fill="url(#kbg)" />
    <g fill="#FFFFFF" opacity={letters}>
      <path transform="translate(61.650 334.974) scale(0.21014 -0.21014)" d="M65 0H215V15H195V242L330 354L594 15H576V0H755V15H733L408 418L732 685H750V700H572V685H593L195 367V685H215V700H65V685H85V15H65Z" />
      <path transform="translate(222.410 334.974) scale(0.21014 -0.21014)" d="M80 55C80 17 109 -15 150 -15C191 -15 220 17 220 55C220 93 191 125 150 125C109 125 80 93 80 55Z" />
      <path transform="translate(285.453 334.974) scale(0.21014 -0.21014)" d="M65 0H525C670 0 753 71 753 190C753 278 708 337 626 362C687 386 735 433 735 520C735 629 650 700 505 700H65V685H85V15H65ZM485 600C565 600 625 584 625 505C625 429 565 405 475 405H189V600ZM189 100V315H500C590 315 643 281 643 215C643 119 590 100 500 100Z" />
    </g>
  </svg>
);

/** The "K.B" logotype as text (Copperplate), for pills and lockups. */
export const KBWord: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.navy, style }) => (
  <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: size, color, letterSpacing: 0, lineHeight: 1, ...style }}>K.B</span>
);

/** A white card. */
export const Card: React.FC<{ w: number; h?: number; r?: number; pad?: number; style?: React.CSSProperties; children?: React.ReactNode; soft?: boolean }> =
  ({ w, h, r = 28, pad = 0, style, children, soft }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: C.white, boxShadow: soft ? SHADOW_SOFT : SHADOW, padding: pad,
      boxSizing: "border-box", border: `1.5px solid ${rgba(C.navy, 0.06)}`, position: "relative", overflow: "hidden", ...style }}>{children}</div>
  );

/** The pointer: an arrow cursor, about 90 px. `press` 0..1 shrinks it into the click; `fill` the arrow on hover. */
export const Cursor: React.FC<{ size?: number; press?: number; color?: string; label?: string; labelBg?: string }> =
  ({ size = 84, press = 0, color = C.ink, label, labelBg = C.navy }) => {
    const sc = 1 - 0.18 * Math.sin(Math.PI * clamp01(press));
    return (
      <div style={{ position: "relative", width: size, height: size, transform: `scale(${sc})`, transformOrigin: "10% 8%" }}>
        <svg width={size} height={size} viewBox="0 0 32 32" style={{ filter: "drop-shadow(0 6px 10px rgba(41,58,81,0.25))" }}>
          <path d="M6 3.5l19 11.2-8.3 1.7 4.9 9.1-3.6 1.9-4.9-9.2-6.1 5.8z" fill={color} stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
        {label && (
          <div style={{ position: "absolute", left: size * 0.62, top: size * 0.78, background: labelBg, color: "#fff", fontFamily: F.ui,
            fontWeight: 600, fontSize: size * 0.3, padding: `${size * 0.07}px ${size * 0.16}px`, borderRadius: size * 0.12, whiteSpace: "nowrap" }}>{label}</div>
        )}
      </div>
    );
  };

/** A status line with a light band sweeping through it at constant speed (technique 29). `t` seconds since it started. */
export const Shimmer: React.FC<{ text: string; size: number; t: number; color?: string; band?: number; speed?: number }> =
  ({ text, size, t, color = C.muted2, band = 90, speed = 620 }) => {
    const x = ((t * speed) % 900) - 200;
    return (
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: size, color: "transparent", whiteSpace: "nowrap",
        backgroundImage: `linear-gradient(90deg, ${color} 0px, ${color} ${x - band}px, ${C.ink} ${x}px, ${color} ${x + band}px, ${color} 2000px)`,
        backgroundClip: "text", WebkitBackgroundClip: "text" }}>{text}</span>
    );
  };

/** Typed text: the first n characters, with a caret. */
export const Typed: React.FC<{ text: string; n: number; size: number; color?: string; caret?: boolean; weight?: number; caretColor?: string; blinkT?: number }> =
  ({ text, n, size, color = C.ink, caret = true, weight = 500, caretColor = C.navy, blinkT = 0 }) => {
    const shown = text.slice(0, Math.max(0, Math.floor(n)));
    const on = n < text.length || Math.floor(blinkT * 2) % 2 === 0;
    return (
      <span style={{ fontFamily: F.ui, fontWeight: weight, fontSize: size, color, whiteSpace: "pre" }}>
        {shown}
        {caret && <span style={{ display: "inline-block", width: Math.max(3, size * 0.06), height: size * 1.05, background: caretColor,
          verticalAlign: "-0.16em", marginLeft: size * 0.04, opacity: on ? 1 : 0, borderRadius: 2 }} />}
      </span>
    );
  };

/** A pill-shaped status chip with a dot. */
export const Chip: React.FC<{ text: string; size?: number; tone?: "green" | "navy" | "cyan" | "red" | "grey" | "amber"; style?: React.CSSProperties; icon?: string }> =
  ({ text, size = 30, tone = "green", style, icon }) => {
    const pal = { green: [C.greenSoft, C.green], navy: [C.navy, "#fff"], cyan: [C.cyanSoft, C.navy], red: [C.redSoft, C.red], grey: [C.paleCool, C.muted], amber: [C.amberSoft, "#9A5B00"] }[tone];
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35, background: pal[0], color: pal[1], fontFamily: F.ui, fontWeight: 600,
        fontSize: size, padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: size * 2, whiteSpace: "nowrap", ...style }}>
        {icon ? <Icon name={icon} size={size * 1.05} color={pal[1]} stroke={2.6} /> :
          <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: "50%", background: tone === "navy" ? C.cyan : pal[1] }} />}
        {text}
      </div>
    );
  };

/** A tool tile: a rounded square with a line icon and an optional label beneath. */
export const ToolTile: React.FC<{ icon: string; size: number; label?: string; tint?: string; ink?: string; style?: React.CSSProperties }> =
  ({ icon, size, label, tint = C.white, ink = C.navy, style }) => (
    <div style={{ width: size, height: size, borderRadius: size * 0.26, background: tint, boxShadow: SHADOW_SOFT, display: "flex", alignItems: "center",
      justifyContent: "center", border: `1.5px solid ${rgba(C.navy, 0.07)}`, position: "relative", ...style }}>
      <Icon name={icon} size={size * 0.48} color={ink} stroke={1.9} />
      {label && <div style={{ position: "absolute", top: size + size * 0.12, left: "50%", transform: "translateX(-50%)", fontFamily: F.ui, fontWeight: 600,
        fontSize: size * 0.2, color: C.muted, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );

/** A word in the line, appearing whole (no fade) when `on`, tinted by the colour wake while new (technique 24). */
export const wakeColor = (age: number, base: string, tint: string) => mix(tint, base, clamp01((age - 0.1) / 0.17));

export { lerp };
