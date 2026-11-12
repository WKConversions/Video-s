// Motion tokens and brand roles for the K.B film. Colours are the site's own (brand.json: kruslockbosconsultancy.com
// CSS and screenshots, measured): canvas #F7F7F7, ink #252525, navy #293A51, cyan #38C8FF, the logo tile's gradient
// #354C67 → #3D5574. Contrast rule (brand.json): cyan never carries text on light grounds (1.8:1); on light it is a
// shape (a mark, a ring, a fill); on navy it can be text (6.0:1). Fonts: Montserrat, Copperplate CC (logotype only).
import React from "react";
import { Easing, Img, staticFile } from "remotion";

export const C = {
  canvas: "#F7F7F7", white: "#FFFFFF", ink: "#252525", muted: "#49525B", line: "#E2E8F0", pale: "#EBECF4", paleCool: "#F1F5F9",
  navy: "#293A51", navyDeep: "#1F2D40", kb: "#394F6D", kbL: "#354C67", kbR: "#3D5574", onNavy: "#BCC2C9",
  cyan: "#38C8FF", cyanSoft: "#D7F3FF", cyanInk: "#0B6E99",
  warn: "#E5484D", warnSoft: "#FDE7E7", ok: "#22B07D",
};
export const F = { sans: "Montserrat", logo: "Copperplate CC" };
// The kinetic kit's roles (src/kinetic.tsx reads KIT.font/serif/ink/word/mark/under/strike).
export const KIT = { font: F.sans, serif: F.sans, ink: C.ink, word: C.navy, mark: C.cyan, under: C.cyan, strike: C.cyan };

// Signature curve (precise premium, motion/motion-identity.md): the arrive curve for ~80% of moves; DEPART for exits,
// MOVE for moves of things already on screen. No overshoot anywhere (K.B, approved: pops read as spikes).
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.4, 0, 0.15, 1);
export const LIN = (t: number) => t;
// Duration palette at 30 fps, the energetic end of precise premium (the voice is energetic): quick 7, standard 13, slow 24.
export const D = { quick: 7, std: 13, slow: 24 };
export const SHADOW = {
  card: "0 30px 70px -28px rgba(41,58,81,0.35), 0 8px 18px -8px rgba(41,58,81,0.18)",
  tile: "0 18px 40px -18px rgba(41,58,81,0.55)",
  soft: "0 20px 50px -24px rgba(41,58,81,0.28)",
};
export const R = { card: 16, tile: 22, pill: 999 };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** The K.B logo tile, rebuilt from the site's favicon (public/img/kb-logo-tile.svg: Copperplate CC outlines on the
 *  gradient tile, radius 38/512). `dot` scales the period on its own centre (the one part of the mark that moves),
 *  `letters` fades the K and B (0 leaves the tile alone). */
export const KBTile: React.FC<{ size: number; dot?: number; letters?: number; radius?: number; shadow?: string; style?: React.CSSProperties }> = ({ size, dot = 1, letters = 1, radius, shadow = SHADOW.tile, style }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={{ display: "block", overflow: "visible", filter: shadow ? `drop-shadow(0 ${size * 0.05}px ${size * 0.07}px rgba(41,58,81,0.35))` : undefined, ...style }}>
    <defs><linearGradient id="kbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.kbL} /><stop offset="1" stopColor={C.kbR} /></linearGradient></defs>
    <rect width="512" height="512" rx={radius ?? 38} fill="url(#kbg)" />
    <g fill="#FFFFFF" opacity={letters}>
      <path transform="translate(61.650 334.974) scale(0.21014 -0.21014)" d="M65 0H215V15H195V242L330 354L594 15H576V0H755V15H733L408 418L732 685H750V700H572V685H593L195 367V685H215V700H65V685H85V15H65Z" />
      <path transform="translate(285.453 334.974) scale(0.21014 -0.21014)" d="M65 0H525C670 0 753 71 753 190C753 278 708 337 626 362C687 386 735 433 735 520C735 629 650 700 505 700H65V685H85V15H65ZM485 600C565 600 625 584 625 505C625 429 565 405 475 405H189V600ZM189 100V315H500C590 315 643 281 643 215C643 119 590 100 500 100Z" />
    </g>
    <circle cx={253.93} cy={323.42} r={14.71 * dot} fill="#FFFFFF" />
  </svg>
);

/** The "K.B" letters alone (Copperplate CC Heavy, as the site's nav sets them), for type-size lockups. */
export const KBWord: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = C.navy, style }) => (
  <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: size, color, letterSpacing: "0.01em", lineHeight: 1, ...style }}>K.B</span>
);

/** A tool as the site shows it: its real logo on a navy rounded tile (the "Tools we build with" strip). */
export const TOOLS: Record<string, string> = {
  n8n: "tools/n8n.png", make: "tools/make.png", supabase: "tools/supabase.png", next: "tools/nextjs.png", claude: "tools/claude.png",
  postgres: "tools/postgresql.png", ts: "tools/typescript.png", odoo: "tools/odoo.png", pipedrive: "tools/pipedrive.png",
  resend: "tools/resend.png", vite: "tools/vite.png", tanstack: "tools/tanstack.png", spring: "tools/springboot.png",
  payload: "tools/payload.png", datadog: "tools/datadog.png", apollo: "tools/apollo.png", zenchef: "tools/zenchef.png",
  expogo: "tools/expogo.png", aqqo: "tools/aqqo.png", gyg: "tools/getyourguide.png",
};
export const ToolTile: React.FC<{ tool: string; size: number; style?: React.CSSProperties; shadow?: boolean }> = ({ tool, size, style, shadow = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.17, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: shadow ? SHADOW.tile : undefined, ...style }}>
    <Img src={staticFile("img/" + TOOLS[tool])} style={{ width: size * 0.66, height: size * 0.66, objectFit: "contain" }} />
  </div>
);
