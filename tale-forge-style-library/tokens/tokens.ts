/**
 * Tale Forge (https://tale-forge.app) design tokens for film work (Remotion 4 / React DOM).
 * Captured 2026-10-09/10. Generated from tokens/tokens.json (same values as tokens/tokens.css)
 * and derived/motion/motion-spec.json. No runtime dependencies: it compiles on its own
 *   npx -y -p typescript@5 tsc --noEmit --target es2020 --module esnext tokens.ts
 *
 * Values are CSS literals, so they drop straight into React `style` props. Theme-dependent values
 * are resolved per theme (var() and color-mix() already applied). Sources: "3q17cp:N" is
 * source/css/3q17cp_jgfwol.pretty.css line N. Names are camelCase versions of the site's custom
 * properties (THEMES) or ours (everything else).
 *
 * Asset paths are relative to the library root (tale-forge-style-library/). In Remotion, copy or
 * symlink the library into public/tale-forge/ and call staticFile(`tale-forge/${ASSETS.backgrounds.natt}`),
 * or use assetUrl(path, base).
 */

/* eslint-disable */

// ---------------------------------------------------------------- themes
export type ThemeName = "natt" | "morgon";
export const THEME_NAMES: readonly ThemeName[] = ["natt", "morgon"];
/** The server HTML ships body[data-theme="natt"]; a pre-paint script may switch it. */
export const DEFAULT_THEME: ThemeName = "natt";
export const THEME_LABELS = { natt: { sv: "Natt", en: "Night" }, morgon: { sv: "Morgon", en: "Morning" } } as const;

/** :root primitives, 3q17cp:461-465 */
export const PRIMITIVES = {
  violet: "#6d4fe0", // 3q17cp_jgfwol.pretty.css:461
  violetSoft: "#9b87f5", // 3q17cp_jgfwol.pretty.css:462
  gold: "#f2b22e", // 3q17cp_jgfwol.pretty.css:463
  goldSoft: "#f5c542", // 3q17cp_jgfwol.pretty.css:464
  coral: "#ff6154", // 3q17cp_jgfwol.pretty.css:465
} as const;

/** body[data-theme] semantic set: 47 custom properties, natt 3q17cp:494-540, morgon 3q17cp:543-589. */
export interface ThemeTokens {
  /** --page-ink · natt `#fff7e9` (494) · morgon `#241f35` (543) */
  pageInk: string;
  /** --page-sub · natt `#d9cfee` (495) · morgon `#5f5878` (544) */
  pageSub: string;
  /** --accent · natt `var(--gold-soft)` (496) · morgon `#6d4fe0` (545) */
  accent: string;
  /** --accent-ink · natt `var(--gold-soft)` (497) · morgon `#5b3fc7` (546) */
  accentInk: string;
  /** --card · natt `#0f1628ad` (498) · morgon `#fffc` (547) */
  card: string;
  /** --card-line · natt `#9b87f542` (499) · morgon `#ffffffe6` (548) */
  cardLine: string;
  /** --card-blur · natt `22px` (500) · morgon `24px` (549) */
  cardBlur: string;
  /** --card-ink · natt `#f2eeff` (501) · morgon `#241f35` (550) */
  cardInk: string;
  /** --card-sub · natt `#b5acd3` (502) · morgon `#5f5878` (551) */
  cardSub: string;
  /** --frame · natt `#101a30` (503) · morgon `#fff` (552) */
  frame: string;
  /** --frame-line · natt `#9b87f566` (504) · morgon `#ffffffe6` (553) */
  frameLine: string;
  /** --chip-bg · natt `#fff9ec1a` (505) · morgon `#6d4fe014` (554) */
  chipBg: string;
  /** --chip-line · natt `#fff3d942` (506) · morgon `#6d4fe029` (555) */
  chipLine: string;
  /** --chip-ink · natt `#e8dfc9` (507) · morgon `var(--accent-ink)` (556) */
  chipInk: string;
  /** --pill-bg · natt `#9b87f529` (508) · morgon `#6d4fe01a` (557) */
  pillBg: string;
  /** --pill-ink · natt `#c9bcff` (509) · morgon `var(--accent-ink)` (558) */
  pillInk: string;
  /** --micro-ink · natt `color-mix(in srgb, var(--page-sub) 85%, transparent)` (510) · morgon `var(--page-sub)` (559) */
  microInk: string;
  /** --h1-shadow · natt `0 2px 30px #0c082859` (511) · morgon `none` (560) */
  h1Shadow: string;
  /** --gold-chip-bg · natt `#f2b22e29` (512) · morgon `#f2b22e26` (561) */
  goldChipBg: string;
  /** --gold-chip-ink · natt `#ffd98f` (513) · morgon `#8f6a12` (562) */
  goldChipInk: string;
  /** --coral-chip-bg · natt `#ff615424` (514) · morgon `#ff61541f` (563) */
  coralChipBg: string;
  /** --coral-chip-ink · natt `#ffab9f` (515) · morgon `#c23a2b` (564) */
  coralChipInk: string;
  /** --trait-line · natt `#9b87f559` (516) · morgon `#6d4fe047` (565) */
  traitLine: string;
  /** --trait-ink · natt `#cfc5ec` (517) · morgon `#5f5878` (566) */
  traitInk: string;
  /** --trait-on-bg · natt `#9b87f533` (518) · morgon `#6d4fe01f` (567) */
  traitOnBg: string;
  /** --trait-on-line · natt `#9b87f599` (519) · morgon `#6d4fe06b` (568) */
  traitOnLine: string;
  /** --trait-on-ink · natt `#e9e2ff` (520) · morgon `#4a36a8` (569) */
  traitOnInk: string;
  /** --dash-line · natt `#ffecbe59` (521) · morgon `#6d4fe059` (570) */
  dashLine: string;
  /** --choice-bg · natt `#ffffff0f` (522) · morgon `#fff` (571) */
  choiceBg: string;
  /** --choice-line · natt `#9b87f552` (523) · morgon `#6d4fe038` (572) */
  choiceLine: string;
  /** --choice-ink · natt `#f2eeff` (524) · morgon `#241f35` (573) */
  choiceInk: string;
  /** --bar-bg · natt `#ffffff24` (525) · morgon `#241f3514` (574) */
  barBg: string;
  /** --prose-ink · natt `#eae4f5` (526) · morgon `#3a3450` (575) */
  proseInk: string;
  /** --foot-ink · natt `#b7a9d6` (527) · morgon `#5f5878` (576) */
  footInk: string;
  /** --btn-grad · natt `linear-gradient(135deg, #ffe08a, #f5c542)` (528) · morgon `linear-gradient(135deg, #6d4fe0, #5b3fc7)` (577) */
  btnGrad: string;
  /** --btn-ink · natt `#3a2b10` (529) · morgon `#fff` (578) */
  btnInk: string;
  /** --btn-shadow · natt `0 14px 40px #f5c54247` (530) · morgon `0 14px 34px #6d4fe059` (579) */
  btnShadow: string;
  /** --btn-shadow-hover · natt `0 20px 55px #f5c5426b` (531) · morgon `0 22px 48px #6d4fe073` (580) */
  btnShadowHover: string;
  /** --ghost-bg · natt `#fff9ec1a` (532) · morgon `#ffffffb8` (581) */
  ghostBg: string;
  /** --ghost-ink · natt `#fff3d9` (533) · morgon `#241f35` (582) */
  ghostInk: string;
  /** --control-line · natt `#fff3d952` (534) · morgon `#887da0` (583) */
  controlLine: string;
  /** --ghost-line · natt `var(--control-line)` (535) · morgon `var(--control-line)` (584) */
  ghostLine: string;
  /** --card-shadow · natt `0 18px 44px #0508146b` (536) · morgon `0 4px 12px #241f351a, 0 22px 52px #241f3529` (585) */
  cardShadow: string;
  /** --logo-ink · natt `#f5c542` (537) · morgon `#6d4fe0` (586) */
  logoInk: string;
  /** --logo-shadow · natt `0 2px 6px #050814cc, 0 0 34px #f5c54273` (538) · morgon `0 1px 2px #241f352e, 0 0 24px #6d4fe052` (587) */
  logoShadow: string;
  /** --map-dot · natt `var(--violet-soft)` (539) · morgon `var(--violet)` (588) */
  mapDot: string;
  /** --map-glow · natt `#f5c54240` (540) · morgon `#6d4fe033` (589) */
  mapGlow: string;
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
  natt: {
    pageInk: "#fff7e9",
    pageSub: "#d9cfee",
    accent: "#f5c542",
    accentInk: "#f5c542",
    card: "#0f1628ad",
    cardLine: "#9b87f542",
    cardBlur: "22px",
    cardInk: "#f2eeff",
    cardSub: "#b5acd3",
    frame: "#101a30",
    frameLine: "#9b87f566",
    chipBg: "#fff9ec1a",
    chipLine: "#fff3d942",
    chipInk: "#e8dfc9",
    pillBg: "#9b87f529",
    pillInk: "#c9bcff",
    microInk: "#d9cfeed9",
    h1Shadow: "0 2px 30px #0c082859",
    goldChipBg: "#f2b22e29",
    goldChipInk: "#ffd98f",
    coralChipBg: "#ff615424",
    coralChipInk: "#ffab9f",
    traitLine: "#9b87f559",
    traitInk: "#cfc5ec",
    traitOnBg: "#9b87f533",
    traitOnLine: "#9b87f599",
    traitOnInk: "#e9e2ff",
    dashLine: "#ffecbe59",
    choiceBg: "#ffffff0f",
    choiceLine: "#9b87f552",
    choiceInk: "#f2eeff",
    barBg: "#ffffff24",
    proseInk: "#eae4f5",
    footInk: "#b7a9d6",
    btnGrad: "linear-gradient(135deg, #ffe08a, #f5c542)",
    btnInk: "#3a2b10",
    btnShadow: "0 14px 40px #f5c54247",
    btnShadowHover: "0 20px 55px #f5c5426b",
    ghostBg: "#fff9ec1a",
    ghostInk: "#fff3d9",
    controlLine: "#fff3d952",
    ghostLine: "#fff3d952",
    cardShadow: "0 18px 44px #0508146b",
    logoInk: "#f5c542",
    logoShadow: "0 2px 6px #050814cc, 0 0 34px #f5c54273",
    mapDot: "#9b87f5",
    mapGlow: "#f5c54240",
  },
  morgon: {
    pageInk: "#241f35",
    pageSub: "#5f5878",
    accent: "#6d4fe0",
    accentInk: "#5b3fc7",
    card: "#fffc",
    cardLine: "#ffffffe6",
    cardBlur: "24px",
    cardInk: "#241f35",
    cardSub: "#5f5878",
    frame: "#fff",
    frameLine: "#ffffffe6",
    chipBg: "#6d4fe014",
    chipLine: "#6d4fe029",
    chipInk: "#5b3fc7",
    pillBg: "#6d4fe01a",
    pillInk: "#5b3fc7",
    microInk: "#5f5878",
    h1Shadow: "none",
    goldChipBg: "#f2b22e26",
    goldChipInk: "#8f6a12",
    coralChipBg: "#ff61541f",
    coralChipInk: "#c23a2b",
    traitLine: "#6d4fe047",
    traitInk: "#5f5878",
    traitOnBg: "#6d4fe01f",
    traitOnLine: "#6d4fe06b",
    traitOnInk: "#4a36a8",
    dashLine: "#6d4fe059",
    choiceBg: "#fff",
    choiceLine: "#6d4fe038",
    choiceInk: "#241f35",
    barBg: "#241f3514",
    proseInk: "#3a3450",
    footInk: "#5f5878",
    btnGrad: "linear-gradient(135deg, #6d4fe0, #5b3fc7)",
    btnInk: "#fff",
    btnShadow: "0 14px 34px #6d4fe059",
    btnShadowHover: "0 22px 48px #6d4fe073",
    ghostBg: "#ffffffb8",
    ghostInk: "#241f35",
    controlLine: "#887da0",
    ghostLine: "#887da0",
    cardShadow: "0 4px 12px #241f351a, 0 22px 52px #241f3529",
    logoInk: "#6d4fe0",
    logoShadow: "0 1px 2px #241f352e, 0 0 24px #6d4fe052",
    mapDot: "#6d4fe0",
    mapGlow: "#6d4fe033",
  },
};

/** camelCase key -> the site's CSS custom property name. */
export const CSS_VARS: Record<keyof ThemeTokens, string> = {
  pageInk: "--page-ink",
  pageSub: "--page-sub",
  accent: "--accent",
  accentInk: "--accent-ink",
  card: "--card",
  cardLine: "--card-line",
  cardBlur: "--card-blur",
  cardInk: "--card-ink",
  cardSub: "--card-sub",
  frame: "--frame",
  frameLine: "--frame-line",
  chipBg: "--chip-bg",
  chipLine: "--chip-line",
  chipInk: "--chip-ink",
  pillBg: "--pill-bg",
  pillInk: "--pill-ink",
  microInk: "--micro-ink",
  h1Shadow: "--h1-shadow",
  goldChipBg: "--gold-chip-bg",
  goldChipInk: "--gold-chip-ink",
  coralChipBg: "--coral-chip-bg",
  coralChipInk: "--coral-chip-ink",
  traitLine: "--trait-line",
  traitInk: "--trait-ink",
  traitOnBg: "--trait-on-bg",
  traitOnLine: "--trait-on-line",
  traitOnInk: "--trait-on-ink",
  dashLine: "--dash-line",
  choiceBg: "--choice-bg",
  choiceLine: "--choice-line",
  choiceInk: "--choice-ink",
  barBg: "--bar-bg",
  proseInk: "--prose-ink",
  footInk: "--foot-ink",
  btnGrad: "--btn-grad",
  btnInk: "--btn-ink",
  btnShadow: "--btn-shadow",
  btnShadowHover: "--btn-shadow-hover",
  ghostBg: "--ghost-bg",
  ghostInk: "--ghost-ink",
  controlLine: "--control-line",
  ghostLine: "--ghost-line",
  cardShadow: "--card-shadow",
  logoInk: "--logo-ink",
  logoShadow: "--logo-shadow",
  mapDot: "--map-dot",
  mapGlow: "--map-glow",
};

/** body background under the painted plate: natt 3q17cp:606, morgon 3q17cp:610 */
export const CANVAS: Record<ThemeName, string> = { natt: "#171232", morgon: "#ede9f6" };

/** MEASURED (not CSS): sample-book illustration palette, k-means CIELAB k=8, share of pixels. derived/color/image-palettes.json */
export const ILLUSTRATION_PALETTE = [
  { hex: "#ebcb9e", share: 17.5 },
  { hex: "#654619", share: 17.0 },
  { hex: "#907330", share: 16.1 },
  { hex: "#d59e56", share: 14.6 },
  { hex: "#b96b24", share: 12.9 },
  { hex: "#291e0f", share: 12.1 },
  { hex: "#ab2923", share: 6.6 },
  { hex: "#495050", share: 3.1 },
] as const;

// ---------------------------------------------------------------- gradients, shadows, effects
export const GRADIENTS = {
  /** --btn-grad: primary button, toggle thumb, FAB. natt 3q17cp:528, morgon 3q17cp:577 */
  btn: { natt: "linear-gradient(135deg, #ffe08a, #f5c542)", morgon: "linear-gradient(135deg, #6d4fe0, #5b3fc7)" },
  /** .glass:before 1px masked ring · 3q17cp_jgfwol.pretty.css:1130 */
  glassRim: "linear-gradient(135deg, #9b87f580, #f2b22e59 50%, #ff61544d)",
  /** .adv.ember:before (opacity 0.85, :1622) · 3q17cp_jgfwol.pretty.css:1623 */
  emberRim: "linear-gradient(135deg, #f2b22ebf, #ff615466)",
  /** .hiw-bar i (book baking bar), both themes · 3q17cp_jgfwol.pretty.css:2782 */
  progressFill: "linear-gradient(90deg, #f5c542, #9b87f5)",
  /** SVG linearGradient `${n}-path` stops 0 #f5c542 / 1 #9b87f5 (x2,y2 vary per path) · source/js/3d9nxlx1n5pdy.js @10032 */
  mapPathGradient: "linear-gradient(#f5c542, #9b87f5)",
  /** SVG linearGradient `${n}-ring` 0,0 -> 1,1, stops #f5c542 / #6D4FE0 · source/js/3d9nxlx1n5pdy.js @10221 */
  mapRingGradient: "linear-gradient(135deg, #f5c542, #6D4FE0)",
  /** .bg-night .scrim, over nebula-hero.webp · 3q17cp_jgfwol.pretty.css:632 */
  scrimNatt: "linear-gradient(#0b0f1e61 0%, #0b0f1e80 45%, #0d1122bd 100%)",
  /** natt only · 3q17cp:638-643 */
  starfield: "radial-gradient(1.4px 1.4px at 12% 8%, #ffe9b0e6 50%, #0000 51%), radial-gradient(1px 1px at 32% 16%, #f5f0e8cc 50%, #0000 51%), radial-gradient(1.6px 1.6px at 58% 6%, #f5c542d9 50%, #0000 51%), radial-gradient(1px 1px at 76% 12%, #f5f0e8b3 50%, #0000 51%), radial-gradient(1.2px 1.2px at 90% 22%, #ffe9b0bf 50%, #0000 51%), radial-gradient(1.3px 1.3px at 44% 24%, #9b87f599 50%, #0000 51%)",
} as const;

/** The six CSS stars (3q17cp:638-643): size in CSS px, x/y as fractions of the viewport, colour #rrggbbaa.
 *  Whole layer twinkles: opacity 0.95 -> 0.55 -> 0.95, 4.6 s ease-in-out (3q17cp:644, :648-656). */
export const STARS = [
  { sizePx: 1.4, x: 0.12, y: 0.08, color: "#ffe9b0e6" },
  { sizePx: 1, x: 0.32, y: 0.16, color: "#f5f0e8cc" },
  { sizePx: 1.6, x: 0.58, y: 0.06, color: "#f5c542d9" },
  { sizePx: 1, x: 0.76, y: 0.12, color: "#f5f0e8b3" },
  { sizePx: 1.2, x: 0.9, y: 0.22, color: "#ffe9b0bf" },
  { sizePx: 1.3, x: 0.44, y: 0.24, color: "#9b87f599" },
] as const;

export const SHADOWS = {
  /** --card-shadow: natt 3q17cp_jgfwol.pretty.css:536, morgon 3q17cp_jgfwol.pretty.css:585 */
  card: { natt: "0 18px 44px #0508146b", morgon: "0 4px 12px #241f351a, 0 22px 52px #241f3529" },
  /** --btn-shadow: natt 3q17cp_jgfwol.pretty.css:530, morgon 3q17cp_jgfwol.pretty.css:579 */
  btn: { natt: "0 14px 40px #f5c54247", morgon: "0 14px 34px #6d4fe059" },
  /** --btn-shadow-hover: natt 3q17cp_jgfwol.pretty.css:531, morgon 3q17cp_jgfwol.pretty.css:580 */
  btnHover: { natt: "0 20px 55px #f5c5426b", morgon: "0 22px 48px #6d4fe073" },
  /** --h1-shadow: natt 3q17cp_jgfwol.pretty.css:511, morgon 3q17cp_jgfwol.pretty.css:560 */
  h1: { natt: "0 2px 30px #0c082859", morgon: "none" },
  /** --logo-shadow: natt 3q17cp_jgfwol.pretty.css:538, morgon 3q17cp_jgfwol.pretty.css:587 */
  logo: { natt: "0 2px 6px #050814cc, 0 0 34px #f5c54273", morgon: "0 1px 2px #241f352e, 0 0 24px #6d4fe052" },
  /** .btn-primary second shadow (also .hiw-play :2812) · 3q17cp_jgfwol.pretty.css:912 */
  btnInsetHighlight: "inset 0 1px 0 #ffffff73",
  /** .fan .fbook hero covers · 3q17cp_jgfwol.pretty.css:939-940 */
  cover: "0 24px 50px #0a072066, 0 0 44px #f5c5421f",
  /** .builder-pic .pframe · 3q17cp_jgfwol.pretty.css:1175 */
  portrait: "0 16px 36px #0a07204d",
  /** .friend .avatar · 3q17cp_jgfwol.pretty.css:1309 */
  avatar: "0 10px 22px #0a072040",
  /** .companion-pic · 3q17cp_jgfwol.pretty.css:1458 */
  companion: "0 12px 26px #6d4fe040",
  /** .choice:hover · 3q17cp_jgfwol.pretty.css:1926 */
  choiceHover: "0 14px 30px #6d4fe02e",
  /** .friend-mode-option[aria-pressed="true"] · 3q17cp_jgfwol.pretty.css:2186 */
  optionPressed: "0 10px 26px #6d4fe024",
  /** .badge .dotpulse resting ring; keyframes pulse :1019-1029 · 3q17cp_jgfwol.pretty.css:1017 */
  dotpulseRest: "0 0 #f2b22e80",
} as const;

export const EFFECTS = {
  /** .glass:before opacity · 3q17cp_jgfwol.pretty.css:1129 */
  glassRimOpacity: 0.45,
  /** .logo img filter, both themes · 3q17cp_jgfwol.pretty.css:713 */
  logoImgGlow: "drop-shadow(0 0 14px #f5c54280)",
  /** .tt:focus-visible outline (also .choice :1929) · references a theme variable: resolve per theme (see FOCUS) · 3q17cp_jgfwol.pretty.css:823 */
  focusRing: "3px solid var(--accent)",
  /** outline-offset · 3q17cp_jgfwol.pretty.css:824 */
  focusOffset: "3px",
  /** .tt:focus-visible box-shadow · references a theme variable: resolve per theme (see FOCUS) · 3q17cp_jgfwol.pretty.css:825 */
  focusHalo: "0 0 0 6px color-mix(in srgb, var(--card) 88%, transparent)",
} as const;

/** Focus ring resolved per theme: outline 3px solid var(--accent), offset 3px (3q17cp:823-824). */
export const FOCUS: Record<ThemeName, { outline: string; outlineOffset: string }> = {
  natt: { outline: "3px solid #f5c542", outlineOffset: "3px" },
  morgon: { outline: "3px solid #6d4fe0", outlineOffset: "3px" },
};

// ---------------------------------------------------------------- fonts
export type FontRole = "wordmark" | "display" | "serif" | "ui";
export interface FontFile { family: string; weight: number; subset: string; path: string; unicodeRange: string; source: string }
export interface FontSpec {
  family: string; cssVar: string; stack: string; weights: readonly number[]; use: string;
  /** the latin subset file (the one Next.js preloads; covers Swedish å ä ö é) */
  latin: string; fallback: { family: string; src: string; sizeAdjust: string; ascentOverride: string; descentOverride: string };
}
export const FONTS: Record<FontRole, FontSpec> = {
  wordmark: {
    family: "Cinzel", cssVar: "--wordmark", stack: "\"Cinzel\", \"Cinzel Fallback\", \"Playfair Display\", Georgia, serif",
    weights: [700], use: "Cinzel 700: logo and book titles, always uppercase",
    latin: "derived/typography/fonts/Cinzel-700-latin.woff2",
    fallback: { family: "Cinzel Fallback", src: "local(Times New Roman)", sizeAdjust: "136.86%", ascentOverride: "71.31%", descentOverride: "27.18%" },
  }, // 3q17cp_jgfwol.pretty.css:469; faces 3q17cp:1-459
  display: {
    family: "Lora", cssVar: "--display", stack: "\"Lora\", \"Lora Fallback\", Georgia, serif",
    weights: [600, 700], use: "Lora 600/700: headlines, names, numerals",
    latin: "derived/typography/fonts/Lora-var400-700-latin.woff2",
    fallback: { family: "Lora Fallback", src: "local(Times New Roman)", sizeAdjust: "115.2%", ascentOverride: "87.33%", descentOverride: "23.78%" },
  }, // 3q17cp_jgfwol.pretty.css:466; faces 3q17cp:1-459
  serif: {
    family: "Source Serif 4", cssVar: "--serif", stack: "\"Source Serif 4\", \"Source Serif 4 Fallback\", Georgia, serif",
    weights: [400, 600], use: "Source Serif 4 400/600: ledes, story prose, choices",
    latin: "derived/typography/fonts/SourceSerif4-var200-900-latin.woff2",
    fallback: { family: "Source Serif 4 Fallback", src: "local(Times New Roman)", sizeAdjust: "117.91%", ascentOverride: "87.87%", descentOverride: "28.41%" },
  }, // 3q17cp_jgfwol.pretty.css:468; faces 3q17cp:1-459
  ui: {
    family: "Schibsted Grotesk", cssVar: "--ui", stack: "\"Schibsted Grotesk\", \"Schibsted Grotesk Fallback\", \"Segoe UI\", system-ui, sans-serif",
    weights: [400, 700, 800], use: "Schibsted Grotesk 400/700/800: UI and body",
    latin: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin.woff2",
    fallback: { family: "Schibsted Grotesk Fallback", src: "local(Arial)", sizeAdjust: "104.49%", ascentOverride: "93.46%", descentOverride: "24.67%" },
  }, // 3q17cp_jgfwol.pretty.css:467; faces 3q17cp:1-459
};

/** Every @font-face the site ships (one per declared weight per subset), pointing at the renamed copies. */
export const FONT_FILES: readonly FontFile[] = [
  { family: "Cinzel", weight: 700, subset: "latin-ext", path: "derived/typography/fonts/Cinzel-700-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:1-11" },
  { family: "Cinzel", weight: 700, subset: "latin", path: "derived/typography/fonts/Cinzel-700-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:12-21" },
  { family: "Lora", weight: 600, subset: "cyrillic-ext", path: "derived/typography/fonts/Lora-var400-700-cyrillic-ext.woff2", unicodeRange: "U+460-52F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", source: "3q17cp:40-48" },
  { family: "Lora", weight: 600, subset: "cyrillic", path: "derived/typography/fonts/Lora-var400-700-cyrillic.woff2", unicodeRange: "U+301, U+400-45F, U+490-491, U+4B0-4B1, U+2116", source: "3q17cp:49-56" },
  { family: "Lora", weight: 600, subset: "math", path: "derived/typography/fonts/Lora-var400-700-math.woff2", unicodeRange: "U+302-303, U+305, U+307-308, U+310, U+312, U+315, U+31A, U+326-327, U+32C, U+32F-330, U+332-333, U+338, U+33A, U+346, U+34D, U+391-3A1, U+3A3-3A9, U+3B1-3C9, U+3D1, U+3D5-3D6, U+3F0-3F1, U+3F4-3F5, U+2016-2017, U+2034-2038, U+203C, U+2040, U+2043, U+2047, U+2050, U+2057, U+205F, U+2070-2071, U+2074-208E, U+2090-209C, U+20D0-20DC, U+20E1, U+20E5-20EF, U+2100-2112, U+2114-2115, U+2117-2121, U+2123-214F, U+2190, U+2192, U+2194-21AE, U+21B0-21E5, U+21F1-21F2, U+21F4-2211, U+2213-2214, U+2216-22FF, U+2308-230B, U+2310, U+2319, U+231C-2321, U+2336-237A, U+237C, U+2395, U+239B-23B7, U+23D0, U+23DC-23E1, U+2474-2475, U+25AF, U+25B3, U+25B7, U+25BD, U+25C1, U+25CA, U+25CC, U+25FB, U+266D-266F, U+27C0-27FF, U+2900-2AFF, U+2B0E-2B11, U+2B30-2B4C, U+2BFE, U+3030, U+FF5B, U+FF5D, U+1D400-1D7FF, U+1EE??", source: "3q17cp:57-76" },
  { family: "Lora", weight: 600, subset: "symbols", path: "derived/typography/fonts/Lora-var400-700-symbols.woff2", unicodeRange: "U+1-C, U+E-1F, U+7F-9F, U+20DD-20E0, U+20E2-20E4, U+2150-218F, U+2190, U+2192, U+2194-2199, U+21AF, U+21E6-21F0, U+21F3, U+2218-2219, U+2299, U+22C4-22C6, U+2300-243F, U+2440-244A, U+2460-24FF, U+25A0-27BF, U+28??, U+2921-2922, U+2981, U+29BF, U+29EB, U+2B??, U+4DC0-4DFF, U+FFF9-FFFB, U+10140-1018E, U+10190-1019C, U+101A0, U+101D0-101FD, U+102E0-102FB, U+10E60-10E7E, U+1D2C0-1D2D3, U+1D2E0-1D37F, U+1F0??, U+1F100-1F1AD, U+1F1E6-1F1FF, U+1F30D-1F30F, U+1F315, U+1F31C, U+1F31E, U+1F320-1F32C, U+1F336, U+1F378, U+1F37D, U+1F382, U+1F393-1F39F, U+1F3A7-1F3A8, U+1F3AC-1F3AF, U+1F3C2, U+1F3C4-1F3C6, U+1F3CA-1F3CE, U+1F3D4-1F3E0, U+1F3ED, U+1F3F1-1F3F3, U+1F3F5-1F3F7, U+1F408, U+1F415, U+1F41F, U+1F426, U+1F43F, U+1F441-1F442, U+1F444, U+1F446-1F449, U+1F44C-1F44E, U+1F453, U+1F46A, U+1F47D, U+1F4A3, U+1F4B0, U+1F4B3, U+1F4B9, U+1F4BB, U+1F4BF, U+1F4C8-1F4CB, U+1F4D6, U+1F4DA, U+1F4DF, U+1F4E3-1F4E6, U+1F4EA-1F4ED, U+1F4F7, U+1F4F9-1F4FB, U+1F4FD-1F4FE, U+1F503, U+1F507-1F50B, U+1F50D, U+1F512-1F513, U+1F53E-1F54A, U+1F54F-1F5FA, U+1F610, U+1F650-1F67F, U+1F687, U+1F68D, U+1F691, U+1F694, U+1F698, U+1F6AD, U+1F6B2, U+1F6B9-1F6BA, U+1F6BC, U+1F6C6-1F6CF, U+1F6D3-1F6D7, U+1F6E0-1F6EA, U+1F6F0-1F6F3, U+1F6F7-1F6FC, U+1F7??, U+1F800-1F80B, U+1F810-1F847, U+1F850-1F859, U+1F860-1F887, U+1F890-1F8AD, U+1F8B0-1F8BB, U+1F8C0-1F8C1, U+1F900-1F90B, U+1F93B, U+1F946, U+1F984, U+1F996, U+1F9E9, U+1FA00-1FA6F, U+1FA70-1FA7C, U+1FA80-1FA89, U+1FA8F-1FAC6, U+1FACE-1FADC, U+1FADF-1FAE9, U+1FAF0-1FAF8, U+1FB??", source: "3q17cp:77-106" },
  { family: "Lora", weight: 600, subset: "vietnamese", path: "derived/typography/fonts/Lora-var400-700-vietnamese.woff2", unicodeRange: "U+102-103, U+110-111, U+128-129, U+168-169, U+1A0-1A1, U+1AF-1B0, U+300-301, U+303-304, U+308-309, U+323, U+329, U+1EA0-1EF9, U+20AB", source: "3q17cp:107-116" },
  { family: "Lora", weight: 600, subset: "latin-ext", path: "derived/typography/fonts/Lora-var400-700-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:117-127" },
  { family: "Lora", weight: 600, subset: "latin", path: "derived/typography/fonts/Lora-var400-700-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:128-137" },
  { family: "Lora", weight: 700, subset: "cyrillic-ext", path: "derived/typography/fonts/Lora-var400-700-cyrillic-ext.woff2", unicodeRange: "U+460-52F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", source: "3q17cp:138-146" },
  { family: "Lora", weight: 700, subset: "cyrillic", path: "derived/typography/fonts/Lora-var400-700-cyrillic.woff2", unicodeRange: "U+301, U+400-45F, U+490-491, U+4B0-4B1, U+2116", source: "3q17cp:147-154" },
  { family: "Lora", weight: 700, subset: "math", path: "derived/typography/fonts/Lora-var400-700-math.woff2", unicodeRange: "U+302-303, U+305, U+307-308, U+310, U+312, U+315, U+31A, U+326-327, U+32C, U+32F-330, U+332-333, U+338, U+33A, U+346, U+34D, U+391-3A1, U+3A3-3A9, U+3B1-3C9, U+3D1, U+3D5-3D6, U+3F0-3F1, U+3F4-3F5, U+2016-2017, U+2034-2038, U+203C, U+2040, U+2043, U+2047, U+2050, U+2057, U+205F, U+2070-2071, U+2074-208E, U+2090-209C, U+20D0-20DC, U+20E1, U+20E5-20EF, U+2100-2112, U+2114-2115, U+2117-2121, U+2123-214F, U+2190, U+2192, U+2194-21AE, U+21B0-21E5, U+21F1-21F2, U+21F4-2211, U+2213-2214, U+2216-22FF, U+2308-230B, U+2310, U+2319, U+231C-2321, U+2336-237A, U+237C, U+2395, U+239B-23B7, U+23D0, U+23DC-23E1, U+2474-2475, U+25AF, U+25B3, U+25B7, U+25BD, U+25C1, U+25CA, U+25CC, U+25FB, U+266D-266F, U+27C0-27FF, U+2900-2AFF, U+2B0E-2B11, U+2B30-2B4C, U+2BFE, U+3030, U+FF5B, U+FF5D, U+1D400-1D7FF, U+1EE??", source: "3q17cp:155-174" },
  { family: "Lora", weight: 700, subset: "symbols", path: "derived/typography/fonts/Lora-var400-700-symbols.woff2", unicodeRange: "U+1-C, U+E-1F, U+7F-9F, U+20DD-20E0, U+20E2-20E4, U+2150-218F, U+2190, U+2192, U+2194-2199, U+21AF, U+21E6-21F0, U+21F3, U+2218-2219, U+2299, U+22C4-22C6, U+2300-243F, U+2440-244A, U+2460-24FF, U+25A0-27BF, U+28??, U+2921-2922, U+2981, U+29BF, U+29EB, U+2B??, U+4DC0-4DFF, U+FFF9-FFFB, U+10140-1018E, U+10190-1019C, U+101A0, U+101D0-101FD, U+102E0-102FB, U+10E60-10E7E, U+1D2C0-1D2D3, U+1D2E0-1D37F, U+1F0??, U+1F100-1F1AD, U+1F1E6-1F1FF, U+1F30D-1F30F, U+1F315, U+1F31C, U+1F31E, U+1F320-1F32C, U+1F336, U+1F378, U+1F37D, U+1F382, U+1F393-1F39F, U+1F3A7-1F3A8, U+1F3AC-1F3AF, U+1F3C2, U+1F3C4-1F3C6, U+1F3CA-1F3CE, U+1F3D4-1F3E0, U+1F3ED, U+1F3F1-1F3F3, U+1F3F5-1F3F7, U+1F408, U+1F415, U+1F41F, U+1F426, U+1F43F, U+1F441-1F442, U+1F444, U+1F446-1F449, U+1F44C-1F44E, U+1F453, U+1F46A, U+1F47D, U+1F4A3, U+1F4B0, U+1F4B3, U+1F4B9, U+1F4BB, U+1F4BF, U+1F4C8-1F4CB, U+1F4D6, U+1F4DA, U+1F4DF, U+1F4E3-1F4E6, U+1F4EA-1F4ED, U+1F4F7, U+1F4F9-1F4FB, U+1F4FD-1F4FE, U+1F503, U+1F507-1F50B, U+1F50D, U+1F512-1F513, U+1F53E-1F54A, U+1F54F-1F5FA, U+1F610, U+1F650-1F67F, U+1F687, U+1F68D, U+1F691, U+1F694, U+1F698, U+1F6AD, U+1F6B2, U+1F6B9-1F6BA, U+1F6BC, U+1F6C6-1F6CF, U+1F6D3-1F6D7, U+1F6E0-1F6EA, U+1F6F0-1F6F3, U+1F6F7-1F6FC, U+1F7??, U+1F800-1F80B, U+1F810-1F847, U+1F850-1F859, U+1F860-1F887, U+1F890-1F8AD, U+1F8B0-1F8BB, U+1F8C0-1F8C1, U+1F900-1F90B, U+1F93B, U+1F946, U+1F984, U+1F996, U+1F9E9, U+1FA00-1FA6F, U+1FA70-1FA7C, U+1FA80-1FA89, U+1FA8F-1FAC6, U+1FACE-1FADC, U+1FADF-1FAE9, U+1FAF0-1FAF8, U+1FB??", source: "3q17cp:175-204" },
  { family: "Lora", weight: 700, subset: "vietnamese", path: "derived/typography/fonts/Lora-var400-700-vietnamese.woff2", unicodeRange: "U+102-103, U+110-111, U+128-129, U+168-169, U+1A0-1A1, U+1AF-1B0, U+300-301, U+303-304, U+308-309, U+323, U+329, U+1EA0-1EF9, U+20AB", source: "3q17cp:205-214" },
  { family: "Lora", weight: 700, subset: "latin-ext", path: "derived/typography/fonts/Lora-var400-700-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:215-225" },
  { family: "Lora", weight: 700, subset: "latin", path: "derived/typography/fonts/Lora-var400-700-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:226-235" },
  { family: "Source Serif 4", weight: 400, subset: "cyrillic-ext", path: "derived/typography/fonts/SourceSerif4-var200-900-cyrillic-ext.woff2", unicodeRange: "U+460-52F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", source: "3q17cp:253-261" },
  { family: "Source Serif 4", weight: 400, subset: "cyrillic", path: "derived/typography/fonts/SourceSerif4-var200-900-cyrillic.woff2", unicodeRange: "U+301, U+400-45F, U+490-491, U+4B0-4B1, U+2116", source: "3q17cp:262-269" },
  { family: "Source Serif 4", weight: 400, subset: "greek", path: "derived/typography/fonts/SourceSerif4-var200-900-greek.woff2", unicodeRange: "U+370-377, U+37A-37F, U+384-38A, U+38C, U+38E-3A1, U+3A3-3FF", source: "3q17cp:270-277" },
  { family: "Source Serif 4", weight: 400, subset: "vietnamese", path: "derived/typography/fonts/SourceSerif4-var200-900-vietnamese.woff2", unicodeRange: "U+102-103, U+110-111, U+128-129, U+168-169, U+1A0-1A1, U+1AF-1B0, U+300-301, U+303-304, U+308-309, U+323, U+329, U+1EA0-1EF9, U+20AB", source: "3q17cp:278-287" },
  { family: "Source Serif 4", weight: 400, subset: "latin-ext", path: "derived/typography/fonts/SourceSerif4-var200-900-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:288-298" },
  { family: "Source Serif 4", weight: 400, subset: "latin", path: "derived/typography/fonts/SourceSerif4-var200-900-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:299-308" },
  { family: "Source Serif 4", weight: 600, subset: "cyrillic-ext", path: "derived/typography/fonts/SourceSerif4-var200-900-cyrillic-ext.woff2", unicodeRange: "U+460-52F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", source: "3q17cp:309-317" },
  { family: "Source Serif 4", weight: 600, subset: "cyrillic", path: "derived/typography/fonts/SourceSerif4-var200-900-cyrillic.woff2", unicodeRange: "U+301, U+400-45F, U+490-491, U+4B0-4B1, U+2116", source: "3q17cp:318-325" },
  { family: "Source Serif 4", weight: 600, subset: "greek", path: "derived/typography/fonts/SourceSerif4-var200-900-greek.woff2", unicodeRange: "U+370-377, U+37A-37F, U+384-38A, U+38C, U+38E-3A1, U+3A3-3FF", source: "3q17cp:326-333" },
  { family: "Source Serif 4", weight: 600, subset: "vietnamese", path: "derived/typography/fonts/SourceSerif4-var200-900-vietnamese.woff2", unicodeRange: "U+102-103, U+110-111, U+128-129, U+168-169, U+1A0-1A1, U+1AF-1B0, U+300-301, U+303-304, U+308-309, U+323, U+329, U+1EA0-1EF9, U+20AB", source: "3q17cp:334-343" },
  { family: "Source Serif 4", weight: 600, subset: "latin-ext", path: "derived/typography/fonts/SourceSerif4-var200-900-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:344-354" },
  { family: "Source Serif 4", weight: 600, subset: "latin", path: "derived/typography/fonts/SourceSerif4-var200-900-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:355-364" },
  { family: "Schibsted Grotesk", weight: 400, subset: "latin-ext", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:380-390" },
  { family: "Schibsted Grotesk", weight: 400, subset: "latin", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:391-400" },
  { family: "Schibsted Grotesk", weight: 700, subset: "latin-ext", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:401-411" },
  { family: "Schibsted Grotesk", weight: 700, subset: "latin", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:412-421" },
  { family: "Schibsted Grotesk", weight: 800, subset: "latin-ext", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin-ext.woff2", unicodeRange: "U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF", source: "3q17cp:422-432" },
  { family: "Schibsted Grotesk", weight: 800, subset: "latin", path: "derived/typography/fonts/SchibstedGrotesk-var400-900-latin.woff2", unicodeRange: "U+??, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", source: "3q17cp:433-442" },
];

/** @font-face CSS for all FONT_FILES; `base` is the URL prefix of the library root. */
export const fontFaceCss = (base = ".."): string =>
  FONT_FILES.map(
    (f) =>
      `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};font-display:swap;` +
      `src:url(${base}/${f.path}) format("woff2");unicode-range:${f.unicodeRange}}`,
  ).join("\n");

// ---------------------------------------------------------------- type scale
export interface TypeRole {
  role: string; font: FontRole; weight: number;
  /** CSS font-size as shipped (may be clamp()) */ sizeCss: string;
  /** computed px at viewport widths (1440 desktop, 834 tablet, 390 phone) */ px: Partial<Record<"1440" | "834" | "390", number>>;
  lineHeight: number | "normal"; letterSpacing: string; extra?: string; sample: { sv: string; en: string }; source: string;
}
export const TYPE: Record<string, TypeRole> = {
  hero: { role: "h1 (hero)", font: "display", weight: 700, sizeCss: "clamp(2.7rem, 5.4vw, 4.4rem)", px: {"1440": 70.4, "834": 45.04, "390": 43.2}, lineHeight: 1.06, letterSpacing: "-0.015em", extra: "text-wrap: balance; text-shadow: var(--h1-shadow)", sample: { sv: "En värld som minns henne.", en: "A world that remembers her." }, source: "3q17cp: font-size 862, font-weight 863, line-height 864, letter-spacing 857" },
  "hiw-headline": { role: "h2.hiw-headline", font: "display", weight: 700, sizeCss: "clamp(1.9rem, 4vw, 2.7rem)", px: {"1440": 43.2, "834": 33.36, "390": 30.4}, lineHeight: "normal", letterSpacing: "-0.015em", sample: { sv: "Äventyr värda att prata om.", en: "Adventures worth talking about." }, source: "3q17cp: font-size 2559, font-weight 2560, letter-spacing 2556" },
  h2: { role: "h2 (section)", font: "display", weight: 600, sizeCss: "clamp(1.5rem, 2.4vw, 2rem)", px: {"1440": 32, "834": 24, "390": 24}, lineHeight: "normal", letterSpacing: "-0.01em", sample: { sv: "Din hjälte", en: "Your hero" }, source: "3q17cp: font-size 1059, font-weight 1060, letter-spacing 1057" },
  "reader-title": { role: ".reader-title (book title, Cinzel)", font: "wordmark", weight: 700, sizeCss: "2rem", px: {"1440": 32, "390": 24.8}, lineHeight: 1.18, letterSpacing: "0", extra: "text-transform: uppercase; color: var(--logo-ink); text-shadow: var(--logo-shadow)", sample: { sv: "Iris och den sparade platsen", en: "Iris and the Saved Place" }, source: "3q17cp: font-size 1819, line-height 1820, letter-spacing 1813" },
  logo: { role: ".logo (wordmark)", font: "wordmark", weight: 700, sizeCss: "1.72rem", px: {"1440": 27.52, "390": 16.8}, lineHeight: "normal", letterSpacing: "3px", extra: "text-transform: uppercase; color: var(--logo-ink); text-shadow: var(--logo-shadow)", sample: { sv: "Tale Forge", en: "Tale Forge" }, source: "3q17cp: font-size 706, font-weight 707, letter-spacing 701" },
  "builder-name": { role: ".builder-name", font: "display", weight: 700, sizeCss: "1.6rem", px: {"1440": 25.6}, lineHeight: "normal", letterSpacing: "-0.01em", sample: { sv: "Alva", en: "Alva" }, source: "3q17cp: font-size 1214, font-weight 1215, letter-spacing 1212" },
  "step-title": { role: ".hiw-step-text h3", font: "display", weight: 700, sizeCss: "1.35rem", px: {"1440": 21.6}, lineHeight: "normal", letterSpacing: "normal", sample: { sv: "Bygg er hjälte", en: "Build your hero" }, source: "3q17cp: font-size 2635, font-weight 2636" },
  "adv-title": { role: ".adv-title", font: "display", weight: 700, sizeCss: "1.3rem", px: {"1440": 20.8}, lineHeight: 1.25, letterSpacing: "-0.015em", sample: { sv: "Ett stort äventyr", en: "A big adventure" }, source: "3q17cp: font-size 1594, font-weight 1595, line-height 1596, letter-spacing 1593" },
  "book-title": { role: ".book-title", font: "display", weight: 700, sizeCss: "1.02rem", px: {"1440": 16.32}, lineHeight: 1.25, letterSpacing: "-0.01em", sample: { sv: "Alva och fyraljuset i tornet", en: "Alva and the Fourth Candle in the Tower" }, source: "3q17cp: font-size 1516, font-weight 1517, line-height 1518, letter-spacing 1515" },
  lede: { role: ".lede", font: "serif", weight: 400, sizeCss: "clamp(1.08rem, 1.65vw, 1.28rem)", px: {"1440": 20.48, "834": 17.28, "390": 17.28}, lineHeight: 1.65, letterSpacing: "normal", extra: "max-width: 46ch; color: var(--page-sub)", sample: { sv: "Den målade hjälten återvänder. Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat.", en: "The painted hero returns. Choices change what happens, and later books remember the adventures you have already shared." }, source: "3q17cp: font-size 876, line-height 877" },
  prose: { role: ".prose (reader page)", font: "serif", weight: 400, sizeCss: "1.2rem", px: {"1440": 19.2}, lineHeight: 1.85, letterSpacing: "normal", extra: "color: var(--prose-ink); :first-letter 2.5em/0.9, 600, var(--accent)", sample: { sv: "Iris kom till kvartersbiblioteket med ett stort ritpapper under armen.", en: "Iris came to the neighbourhood library with a big sheet of drawing paper under her arm. (library translation)" }, source: "3q17cp: font-size 1830, line-height 1831" },
  "hiw-lede": { role: ".hiw-lede", font: "serif", weight: 400, sizeCss: "1.1rem", px: {"1440": 17.6}, lineHeight: 1.7, letterSpacing: "normal", extra: "max-width: 56ch", sample: { sv: "Från ett foto till en uppläst bilderbok med fyra olika slut.", en: "From one photo to a narrated picture book with four different endings." }, source: "3q17cp: font-size 2566, line-height 2567" },
  "step-copy": { role: ".hiw-step-copy", font: "serif", weight: 400, sizeCss: "1.02rem", px: {"1440": 16.32}, lineHeight: 1.75, letterSpacing: "normal", extra: "max-width: 52ch", sample: { sv: "Ladda upp en bild och välj det som gör ert barn till ert barn.", en: "Upload a photo and pick what makes your child your child." }, source: "3q17cp: font-size 2642, line-height 2643" },
  choice: { role: ".choice (story choice)", font: "serif", weight: 600, sizeCss: "1.05rem", px: {"1440": 16.8}, lineHeight: "normal", letterSpacing: "normal", extra: "radius 16px; 2px solid var(--choice-line)", sample: { sv: "Gå med Mossa till den gröna mattan.", en: "Go with Mossa to the green rug. (library translation)" }, source: "3q17cp: font-size 1916, font-weight 1917" },
  button: { role: ".btn", font: "ui", weight: 700, sizeCss: "1.05rem", px: {"1440": 16.8}, lineHeight: "normal", letterSpacing: "normal", extra: "pill, padding 17px 30px, min-height 52px", sample: { sv: "Skapa er hjälte", en: "Create your hero" }, source: "3q17cp: font-size 895, font-weight 896" },
  "nav-cta": { role: ".nav-cta / .tt-opt", font: "ui", weight: 700, sizeCss: "0.95rem", px: {"1440": 15.2}, lineHeight: "normal", letterSpacing: "normal", sample: { sv: "Logga in", en: "Login" }, source: "3q17cp: font-size 739, font-weight 740" },
  trait: { role: ".trait", font: "ui", weight: 700, sizeCss: "0.88rem", px: {"1440": 14.08}, lineHeight: "normal", letterSpacing: "normal", sample: { sv: "Modig", en: "Brave" }, source: "3q17cp: font-size 1234, font-weight 1235" },
  micro: { role: ".hiw-micro", font: "ui", weight: 600, sizeCss: "0.88rem", px: {"1440": 14.08}, lineHeight: "normal", letterSpacing: "normal", extra: "color: var(--micro-ink)", sample: { sv: "Porträttet styr både bilderna och berättelsen.", en: "The portrait shapes both the pictures and the story." }, source: "3q17cp: font-size 2651, font-weight 2652" },
  kicker: { role: ".kicker", font: "ui", weight: 700, sizeCss: "0.85rem", px: {"1440": 13.6}, lineHeight: "normal", letterSpacing: "normal", sample: { sv: "Exempel: Alvas värld · 2 böcker", en: "Demo: Alva's world · 2 books" }, source: "3q17cp: font-size 846, font-weight 847" },
  "cta-microcopy": { role: ".cta-microcopy", font: "ui", weight: 400, sizeCss: "0.85rem", px: {"1440": 13.6}, lineHeight: "normal", letterSpacing: "normal", extra: "color: var(--page-sub)", sample: { sv: "Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden.", en: "The first book is free, no card needed. After that $14.99 a month." }, source: "3q17cp: font-size 3144" },
  eyebrow: { role: ".hiw-kicker", font: "ui", weight: 700, sizeCss: "0.82rem", px: {"1440": 13.12}, lineHeight: "normal", letterSpacing: "2px", extra: "text-transform: uppercase", sample: { sv: "Så fungerar det", en: "How it works" }, source: "3q17cp: font-size 2550, font-weight 2551, letter-spacing 2544" },
  "sec-chip": { role: ".sec-chip", font: "ui", weight: 700, sizeCss: "0.8rem", px: {"1440": 12.8}, lineHeight: "normal", letterSpacing: "normal", sample: { sv: "barnens favorit", en: "the family favorite" }, source: "3q17cp: font-size 1095, font-weight 1096" },
  chip: { role: ".chip", font: "ui", weight: 800, sizeCss: "0.76rem", px: {"1440": 12.16}, lineHeight: "normal", letterSpacing: "0.05em", extra: "text-transform: uppercase", sample: { sv: "Godnatt", en: "Bedtime" }, source: "3q17cp: font-size 1575, font-weight 1576, letter-spacing 1568" },
  "book-sub": { role: ".book-sub", font: "ui", weight: 800, sizeCss: "0.72rem", px: {"1440": 11.52}, lineHeight: "normal", letterSpacing: "0.04em", extra: "text-transform: uppercase", sample: { sv: "Stora känslor", en: "Big feelings" }, source: "3q17cp: font-size 1528, font-weight 1529, letter-spacing 1521" },
  footer: { role: ".foot", font: "ui", weight: 400, sizeCss: "0.9rem", px: {"1440": 14.4}, lineHeight: "normal", letterSpacing: "normal", extra: "color: var(--foot-ink)", sample: { sv: "Tale Forge, sagor som minns er värld.", en: "Tale Forge, storybooks that remember your world." }, source: "3q17cp: font-size 1941" },
};

// ---------------------------------------------------------------- space, radius, blur (px numbers unless a string is needed)
/** De-facto spacing scale (no tokens on the site): tokens/layout.json spacing.scale_px */
export const SPACE_SCALE = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 34, 36, 40, 44] as const;
export const SPACE = {
  shellWidth: "min(1120px, 100%)", // min(1120px, 100%) · .shell width · 3q17cp_jgfwol.pretty.css:683
  gutter: 28, // 28px · .shell padding 0 28px, every viewport · 3q17cp_jgfwol.pretty.css:686
  navPadY: 22, // 22px · .shell > nav padding (14px at <=560px, :758) · 3q17cp_jgfwol.pretty.css:693
  heroGap: 40, // 40px · .hero column gap · 3q17cp_jgfwol.pretty.css:830
  sectionPad: "44px 0 8px", // 44px 0 8px · section padding · 3q17cp_jgfwol.pretty.css:1039
  sectionHeadGap: 22, // 22px · .sec-head margin-bottom · 3q17cp_jgfwol.pretty.css:1044
  ctaGap: 14, // 14px · .cta-row gap · 3q17cp_jgfwol.pretty.css:883
  btnPad: "17px 30px", // 17px 30px · .btn padding · 3q17cp_jgfwol.pretty.css:894
  btnMinH: 52, // 52px · .btn min-height · 3q17cp_jgfwol.pretty.css:893
  tapMin: 44, // 44px · .tt min-height (all pill controls) · 3q17cp_jgfwol.pretty.css:771
  kickerPad: "8px 16px", // 8px 16px · .kicker padding · 3q17cp_jgfwol.pretty.css:845
  secChipPad: "6px 12px", // 6px 12px · .sec-chip padding · 3q17cp_jgfwol.pretty.css:1094
  chipPad: "6px 13px", // 6px 13px · .chip padding · 3q17cp_jgfwol.pretty.css:1574
  traitPad: "8px 15px", // 8px 15px · .trait padding · 3q17cp_jgfwol.pretty.css:1233
  badgePad: "14px 18px", // 14px 18px · .fan .badge padding · 3q17cp_jgfwol.pretty.css:991
  cardPad: 22, // 22px · .adv padding (.hiw-card also 22px) · 3q17cp_jgfwol.pretty.css:1540
  cardPadLg: 26, // 26px · .builder padding · 3q17cp_jgfwol.pretty.css:1159
  gridGap: 18, // 18px · .builder-grid gap (.advs :1534) · 3q17cp_jgfwol.pretty.css:1150
  shelfGap: 22, // 22px · .shelf gap · 3q17cp_jgfwol.pretty.css:1482
} as const;

export const RADII = {
  pill: 999, // 999px · .btn and every pill control · 3q17cp_jgfwol.pretty.css:890
  circle: "50%", // 50% · dots, .hiw-node, .fab, avatars · 3q17cp_jgfwol.pretty.css:1012
  card: 26, // 26px · .glass · 3q17cp_jgfwol.pretty.css:1117
  book: 22, // 22px · .book (shelf card) · 3q17cp_jgfwol.pretty.css:1491
  cover: 20, // 20px · .fan .fbook (hero covers) · 3q17cp_jgfwol.pretty.css:931
  badge: 18, // 18px · .fan .badge, dashed slots · 3q17cp_jgfwol.pretty.css:988
  choice: 16, // 16px · .choice · 3q17cp_jgfwol.pretty.css:1911
  portrait: 30, // 30px · .builder-pic .pframe · 3q17cp_jgfwol.pretty.css:1169
  small: 6, // 6px · .skip-link · 3q17cp_jgfwol.pretty.css:478
} as const;

/** Frame borders use the theme --frame colour: natt #101a30, morgon #fff (3q17cp:503 / :552). */
export const FRAMES = {
  frameBook: { width: 5, natt: "#101a30", morgon: "#fff" }, // 5px solid var(--frame) · 3q17cp_jgfwol.pretty.css:930
  framePortrait: { width: 4, natt: "#101a30", morgon: "#fff" }, // 4px solid var(--frame) · 3q17cp_jgfwol.pretty.css:1168
} as const;

export const BLUR = {
  card: { natt: 22, morgon: 24 }, // --card-blur 3q17cp:500 / :549
  chip: 10, // .kicker, .sec-chip, .hiw-ai-chip backdrop-filter · 3q17cp_jgfwol.pretty.css:840
  ghost: 14, // .btn-ghost backdrop-filter · 3q17cp_jgfwol.pretty.css:923
  veil: 8, // .pframe .veil while the portrait paints · 2_gt301v4m-60.pretty.css:240
  modal: 6, // sheet scrim · 2h1wwdz1nvxwk.pretty.css:243
  glod: 4, // glöd sound pill · 37m388zf6rymp.pretty.css:780
} as const;

// ---------------------------------------------------------------- motion
export type Bezier = readonly [number, number, number, number];
export const CURVES = {
  cssEase: [0.25, 0.1, 0.25, 1] as Bezier, // ease · --theme-transition-easing; unnamed `transition: x 0.5s` too · 3q17cp_jgfwol.pretty.css:471
  inOut: [0.42, 0, 0.58, 1] as Bezier, // ease-in-out · every idle loop (twinkle, float1/2, floatBadge) · 3q17cp_jgfwol.pretty.css:644
  out: [0, 0, 0.58, 1] as Bezier, // ease-out · map path draw · 3q17cp_jgfwol.pretty.css:2944
  settle: [0.2, 0.7, 0.3, 1] as Bezier, // cubic-bezier(0.2, 0.7, 0.3, 1) · .reveal; tfStartIn screens · 3q17cp_jgfwol.pretty.css:1102
  softSpring: [0.2, 0.7, 0.3, 1.2] as Bezier, // cubic-bezier(0.2, 0.7, 0.3, 1.2) · fan covers, toggle thumb (:790), .book, .adv, .choice · 3q17cp_jgfwol.pretty.css:934
  spring: [0.2, 0.7, 0.3, 1.4] as Bezier, // cubic-bezier(0.2, 0.7, 0.3, 1.4) · .btn, .fab, .hiw-play press targets · 3q17cp_jgfwol.pretty.css:898
} as const;

/** Seconds. */
export const DURATIONS = {
  theme: 0.5, // 0.5s · --theme-transition-duration · 3q17cp_jgfwol.pretty.css:470
  press: 0.25, // 0.25s · .btn transform · 3q17cp_jgfwol.pretty.css:898
  shadow: 0.3, // 0.3s · .btn box-shadow · 3q17cp_jgfwol.pretty.css:899
  trait: 0.25, // 0.25s · .trait all · 3q17cp_jgfwol.pretty.css:1236
  card: 0.35, // 0.35s · .book lift · 3q17cp_jgfwol.pretty.css:1493
  adv: 0.3, // 0.3s · .adv lift · 3q17cp_jgfwol.pretty.css:1541
  glassShadow: 0.4, // 0.4s · .glass box-shadow · 3q17cp_jgfwol.pretty.css:1122
  cover: 0.5, // 0.5s · .fan .fbook transform · 3q17cp_jgfwol.pretty.css:934
  reveal: 0.7, // 0.7s · .reveal (dormant on the live site) · 3q17cp_jgfwol.pretty.css:1102
  pathDraw: 0.9, // 0.9s · map lit path stroke-dashoffset · 3q17cp_jgfwol.pretty.css:2944
  pathFade: 0.25, // 0.25s · previous map path fade · 3q17cp_jgfwol.pretty.css:2948
  screenIn: 0.45, // 0.45s · .start-screen tfStartIn · 2_gt301v4m-60.pretty.css:12
  twinkle: 4.6, // 4.6s · .starfield loop · 3q17cp_jgfwol.pretty.css:644
  float1: 7.0, // 7s · .fb1 loop · 3q17cp_jgfwol.pretty.css:950
  float2: 8.0, // 8s · .fb2 loop · 3q17cp_jgfwol.pretty.css:957
  floatBadge: 9.0, // 9s · .fan .badge loop · 3q17cp_jgfwol.pretty.css:995
  pulse: 2.4, // 2.4s · .dotpulse loop · 3q17cp_jgfwol.pretty.css:1016
} as const;

/** Hover / press transforms (CSS strings, verbatim). */
export const MOVES = {
  liftBtn: "translateY(-3px)", // .btn-primary:hover · 3q17cp_jgfwol.pretty.css:916
  liftPlay: "translateY(-2px)", // .hiw-play:hover · 3q17cp_jgfwol.pretty.css:2827
  liftChoice: "translateY(-3px)", // .choice:hover · 3q17cp_jgfwol.pretty.css:1925
  liftAdv: "translateY(-6px)", // .adv:hover · 3q17cp_jgfwol.pretty.css:1545
  liftBook: "translateY(-10px) rotate(-1deg)", // .book:hover · 3q17cp_jgfwol.pretty.css:1502
  press: "scale(0.96)", // .btn:active · 3q17cp_jgfwol.pretty.css:905
  fabHover: "scale(1.1)", // .builder-pic .fab:hover · 3q17cp_jgfwol.pretty.css:1204
} as const;

/** Idle loops (0% = a, 50% = b, 100% = a; the curve applies per keyframe segment). From derived/motion/motion-spec.json. */
export const IDLE = {
  /** .starfield (natt backdrop, 6 stars) · source/css/3q17cp_jgfwol.pretty.css:636-656 */
  starTwinkle: { periodS: 4.6, curve: "ease_in_out", opacity: [0.95, 0.55] as const },
  /** .fan .fb1 (left cover) · source/css/3q17cp_jgfwol.pretty.css:948-970 · measured p2p 11.7 px */
  coverFloat1: { periodS: 7, curve: "ease_in_out", rotateDeg: [-8, -8.6] as const, yPx: [0, -12] as const },
  /** .fan .fb2 (right cover, on top) · source/css/3q17cp_jgfwol.pretty.css:955-979 · measured p2p 15.7 px */
  coverFloat2: { periodS: 8, curve: "ease_in_out", rotateDeg: [7, 7.6] as const, yPx: [0, -16] as const },
  /** .fan .badge (glass caption chip) · source/css/3q17cp_jgfwol.pretty.css:980-1009 · measured p2p 7.0 px */
  badgeFloat: { periodS: 9, curve: "ease_in_out", rotateDeg: [2.5, 3] as const, yPx: [0, -7] as const },
  /** .dotpulse (10 px gold dot) · source/css/3q17cp_jgfwol.pretty.css:1010-1029 */
  goldDotPulse: { periodS: 2.4, curve: "css_ease", ringSpreadPx: [0, 12] as const, ringAlpha: [0.45, 0] as const, ringEndsAt: 0.7 },
  /** .easel .veil-glow (gold radial, screen blend) · source/css/2_gt301v4m-60.pretty.css:365-388 */
  veilBreathe: { periodS: 4.6, curve: "ease_in_out", opacity: [0.42, 0.9] as const, scale: [1, 1.06] as const },
  /** .pframe .veil svg (paintbrush) · source/css/2_gt301v4m-60.pretty.css:248-261 */
  brushBob: { periodS: 2.6, curve: "ease_in_out", rotateDeg: [-8, 6] as const, yPx: [0, -5] as const },
  /** .glod-pulse-dot, active step dot · source/css/37m388zf6rymp.pretty.css:182-201, 290-295 */
  glodStatusPulse: { periodS: 2.6, curve: "ease_in_out", scale: [1, 1.25] as const, opacity: [0.85, 1] as const },
} as const;

/** One motif of derived/motion/motion-spec.json, copied verbatim. */
export interface MotionMotif {
  id: string; layer: string; property: string; values: unknown;
  duration_s?: number | Record<string, number>; curve?: string | Record<string, string>;
  loop?: string; measured?: string; note?: string; source: string; [k: string]: unknown;
}
export const MOTION_SPEC: readonly MotionMotif[] = [
 {
  "id": "star_twinkle",
  "layer": ".starfield (natt backdrop, 6 stars)",
  "property": "opacity",
  "values": [
   0.95,
   0.55,
   0.95
  ],
  "duration_s": 4.6,
  "curve": "ease_in_out",
  "loop": "infinite yoyo",
  "stagger": "none (one layer)",
  "source": "source/css/3q17cp_jgfwol.pretty.css:636-656"
 },
 {
  "id": "book_float_1",
  "layer": ".fan .fb1 (left cover)",
  "property": "rotate deg / translateY px",
  "values": {
   "rotate": [
    -8,
    -8.6,
    -8
   ],
   "y": [
    0,
    -12,
    0
   ]
  },
  "duration_s": 7,
  "curve": "ease_in_out",
  "loop": "infinite",
  "measured": "p2p 11.7 px",
  "source": "source/css/3q17cp_jgfwol.pretty.css:948-970"
 },
 {
  "id": "book_float_2",
  "layer": ".fan .fb2 (right cover, on top)",
  "property": "rotate / translateY",
  "values": {
   "rotate": [
    7,
    7.6,
    7
   ],
   "y": [
    0,
    -16,
    0
   ]
  },
  "duration_s": 8,
  "curve": "ease_in_out",
  "loop": "infinite",
  "measured": "p2p 15.7 px",
  "source": "source/css/3q17cp_jgfwol.pretty.css:955-979"
 },
 {
  "id": "badge_float",
  "layer": ".fan .badge (glass caption chip)",
  "property": "rotate / translateY",
  "values": {
   "rotate": [
    2.5,
    3,
    2.5
   ],
   "y": [
    0,
    -7,
    0
   ]
  },
  "duration_s": 9,
  "curve": "ease_in_out",
  "loop": "infinite",
  "measured": "p2p 7.0 px",
  "source": "source/css/3q17cp_jgfwol.pretty.css:980-1009"
 },
 {
  "id": "gold_dot_pulse",
  "layer": ".dotpulse (10 px gold dot)",
  "property": "box-shadow ring",
  "values": [
   "0 0 0 0 #f2b22e73",
   "0 0 0 12px #f2b22e00 @70%",
   "0 0 0 0 #f2b22e00"
  ],
  "duration_s": 2.4,
  "curve": "css_ease",
  "loop": "infinite",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1010-1029"
 },
 {
  "id": "cta_hover_lift",
  "layer": ".btn-primary",
  "property": "translateY px + box-shadow",
  "values": {
   "y": [
    0,
    -3
   ],
   "shadow_natt": [
    "0 14px 40px #f5c54247",
    "0 20px 55px #f5c5426b"
   ],
   "shadow_morgon": [
    "0 14px 34px #6d4fe059",
    "0 22px 48px #6d4fe073"
   ],
   "inset_highlight": [
    "inset 0 1px 0 #ffffff73",
    "gone"
   ]
  },
  "duration_s": {
   "transform": 0.25,
   "box_shadow": 0.3
  },
  "curve": {
   "transform": "spring",
   "box_shadow": "css_ease"
  },
  "loop": "once (reverses on leave)",
  "measured": "peak -3.348 px about 0.17 s into the move (+11.6 %), exactly -3 px at 0.25 s; shadow and inset gloss follow over 0.3 s",
  "source": "source/css/3q17cp_jgfwol.pretty.css:886-917, 530-531, 579-580"
 },
 {
  "id": "press",
  "layer": ".btn:active",
  "property": "scale",
  "values": [
   1,
   0.96
  ],
  "duration_s": 0.25,
  "curve": "spring",
  "source": "source/css/3q17cp_jgfwol.pretty.css:904-906"
 },
 {
  "id": "card_lift",
  "layer": ".book (bookshelf card)",
  "property": "translateY / rotate",
  "values": {
   "y": [
    0,
    -10
   ],
   "rotate": [
    0,
    -1
   ]
  },
  "duration_s": 0.35,
  "curve": "soft_spring",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1485-1503",
  "measured": "peak -10.44 px about 0.25 s into the move (+4.4 %), -10 px at 0.35 s"
 },
 {
  "id": "adventure_lift",
  "layer": ".adv",
  "property": "translateY",
  "values": [
   0,
   -6
  ],
  "duration_s": 0.3,
  "curve": "soft_spring",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1537-1546"
 },
 {
  "id": "choice_lift",
  "layer": ".choice (reader)",
  "property": "translateY + violet glow",
  "values": {
   "y": [
    0,
    -3
   ],
   "shadow": "0 14px 30px #6d4fe02e",
   "border": "--violet-soft"
  },
  "duration_s": 0.25,
  "curve": "soft_spring",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1904-1927"
 },
 {
  "id": "fab_pop",
  "layer": ".builder-pic .fab",
  "property": "scale",
  "values": [
   1,
   1.1
  ],
  "duration_s": 0.25,
  "curve": "spring",
  "measured": "peak 1.1116",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1185-1205"
 },
 {
  "id": "theme_crossfade",
  "layer": "body colours, .bg-night/.bg-day",
  "property": "background-color, color, opacity",
  "values": "natt <-> morgon",
  "duration_s": 0.5,
  "curve": "css_ease",
  "note": "gradients (buttons, thumb) snap; toggle thumb slides translate(0 -> 100%) on soft_spring 0.5 s",
  "source": "source/css/3q17cp_jgfwol.pretty.css:470-471, 598-617, 664-675, 768-819; analysis/06-theming-and-atmosphere.md#7-the-crossfade-between-themes-measured"
 },
 {
  "id": "map_path_draw",
  "layer": ".hiw-map .map-path-lit--lit (SVG, pathLength=1)",
  "property": "stroke-dashoffset / opacity",
  "values": {
   "dashoffset": [
    1,
    0
   ],
   "opacity": [
    0,
    0.9
   ]
  },
  "duration_s": {
   "dashoffset": 0.9,
   "opacity": 0.2
  },
  "curve": {
   "dashoffset": "ease_out",
   "opacity": "css_ease"
  },
  "loop": "next ending every 4.5 s (AA, AB, BA, BB); previous path fades 0.25 s then snaps off at 0.3 s; first draw 0.6 s after 40 % visible",
  "source": "source/css/3q17cp_jgfwol.pretty.css:2938-2996; source/js/3d9nxlx1n5pdy.js (threshold:.4)"
 },
 {
  "id": "medallion_active",
  "layer": ".hiw-map .map-medallion",
  "property": "scale / opacity",
  "values": {
   "active_scale": 1.05,
   "dimmed_opacity": 0.55
  },
  "duration_s": 0.2,
  "curve": "css_ease",
  "source": "source/css/3q17cp_jgfwol.pretty.css:2977-2996"
 },
 {
  "id": "screen_enter",
  "layer": ".start-flow .start-screen",
  "property": "opacity / translateY",
  "values": {
   "opacity": [
    0,
    1
   ],
   "y": [
    22,
    0
   ]
  },
  "duration_s": 0.45,
  "curve": "settle",
  "note": "no exit animation: the previous screen cuts",
  "source": "source/css/2_gt301v4m-60.pretty.css:1-13"
 },
 {
  "id": "veil_breathe",
  "layer": ".easel .veil-glow (gold radial, screen blend)",
  "property": "opacity / scale",
  "values": {
   "opacity": [
    0.42,
    0.9,
    0.42
   ],
   "scale": [
    1,
    1.06,
    1
   ]
  },
  "duration_s": 4.6,
  "curve": "ease_in_out",
  "loop": "infinite",
  "source": "source/css/2_gt301v4m-60.pretty.css:365-388"
 },
 {
  "id": "veil_specks",
  "layer": ".veil-speck x5",
  "property": "translateY / scale / opacity",
  "values": {
   "y": [
    0,
    -28,
    -56
   ],
   "scale": [
    0.75,
    1,
    0.7
   ],
   "opacity": "0 -> .55 (20%) -> .7 (50%) -> .3 (80%) -> 0"
  },
  "duration_s": 5.4,
  "curve": "ease_in_out",
  "stagger_s": [
   0,
   1.4,
   0.7,
   2.1,
   3.0
  ],
  "left": [
   "24%",
   "44%",
   "60%",
   "78%",
   "52%"
  ],
  "size_px": [
   4,
   3,
   5,
   3,
   4
  ],
  "source": "source/css/2_gt301v4m-60.pretty.css:389-426; source/js/0ad0wel9cyv30.js"
 },
 {
  "id": "brush_bob",
  "layer": ".pframe .veil svg (paintbrush)",
  "property": "rotate / translateY",
  "values": {
   "rotate": [
    -8,
    6,
    -8
   ],
   "y": [
    0,
    -5,
    0
   ]
  },
  "duration_s": 2.6,
  "curve": "ease_in_out",
  "loop": "infinite",
  "source": "source/css/2_gt301v4m-60.pretty.css:248-261"
 },
 {
  "id": "unveil_sequence",
  "layer": ".easel img + .sheen + .embers",
  "property": "filter / scale / sweep / embers",
  "values": {
   "ph0": "blur(26px) brightness(.22) saturate(0) scale(1.08)",
   "ph1 @0s": "blur(20px) brightness(.5) saturate(.15)",
   "ph2 @1.1s": "blur(7px) brightness(.85) saturate(.7) + gold sheen sweep 1.3s",
   "ph3 @2.6s": "filter none, scale 1 (1.6s settle) + 18 embers tfRise",
   "name @2.6s": "fade-up .7s",
   "line @3.3s": "fade-up .7s",
   "actions @4.1s": "fade-up .6s"
  },
  "duration_s": {
   "filter": 1.5,
   "transform": 1.6
  },
  "curve": {
   "filter": "css_ease",
   "transform": "settle"
  },
  "source": "source/css/2_gt301v4m-60.pretty.css:284-336, 337-364, 446-526; analysis/05b-components-app-and-forms.md#16-reproduce-it-film-and-emulation-recipes"
 },
 {
  "id": "unveil_button_pop",
  "layer": ".unveil-armed.ready-pop",
  "property": "scale / gold halo",
  "values": {
   "scale": [
    0.92,
    1.06,
    1
   ],
   "halo": [
    "0 0 0 #f5c54200",
    "0 0 26px #f5c5428c @45%",
    "0 0 0 #f5c54200"
   ]
  },
  "duration_s": 0.42,
  "curve": "spring",
  "source": "source/css/2_gt301v4m-60.pretty.css:510-526"
 },
 {
  "id": "ember_rise",
  "layer": ".embers.go .ember x18",
  "property": "translate / opacity",
  "values": {
   "x_px": "-110..110",
   "y_px": "-120..-280",
   "opacity": "0 -> .95 (12%) -> 0",
   "size_px": "3..8",
   "left": "35..65%"
  },
  "duration_s": 2.4,
  "curve": "ease_out",
  "stagger_s": "random 0..0.9",
  "fill": "forwards",
  "source": "source/css/2_gt301v4m-60.pretty.css:337-364; source/js/0ad0wel9cyv30.js"
 },
 {
  "id": "gold_sheen",
  "layer": ".easel.ph2 .sheen",
  "property": "translateX",
  "values": [
   "-130%",
   "130%"
  ],
  "duration_s": 1.3,
  "curve": "css_ease",
  "fill": "forwards",
  "source": "source/css/2_gt301v4m-60.pretty.css:310-332"
 },
 {
  "id": "glod_status_pulse",
  "layer": ".glod-pulse-dot, active step dot",
  "property": "scale / opacity",
  "values": {
   "scale": [
    1,
    1.25,
    1
   ],
   "opacity": [
    0.85,
    1,
    0.85
   ]
  },
  "duration_s": 2.6,
  "curve": "ease_in_out",
  "loop": "infinite",
  "source": "source/css/37m388zf6rymp.pretty.css:182-201, 290-295"
 },
 {
  "id": "glod_fire",
  "layer": "canvas (createGlodScene)",
  "property": "flame height/width flicker, glow alpha, sparks",
  "values": {
   "flicker": "0.5 + 0.32 sin(5.7t) + 0.18 sin(2.3t + 1.4)",
   "layers": "4 flame tongues #c8441f/#ef7527/#ffab3d/#ffe9b8, height wobble ±5.5 % at 2.7/3.5/4.3/5.1 rad/s, sway ±10 % width at 1.6/2.2/2.9/3.4 rad/s",
   "sparks": "#ffdf9e, up to 38, rise 32-72 px/s x scale, sway 7 sin(ph + 2.1 life), life 2.4-5.2 s",
   "fire_levels": {
    "unlit": 0,
    "low": 0.55,
    "mid": 1,
    "high": 1.25
   },
   "level_slew": "0.35 per second"
  },
  "loop": "continuous rAF; ambient variant throttled to >=28 ms per frame; paused when tab hidden; reduced motion = one static frame",
  "source": "source/js/1pgfdvt65g9p-.js (see derived/motion/js-motion-excerpts.js)"
 },
 {
  "id": "glod_book_reveal",
  "layer": ".glod-book (finale; dormant in /start)",
  "property": "opacity / scale / rotate",
  "values": {
   "opacity": [
    0,
    1
   ],
   "scale": [
    0.92,
    1
   ],
   "rotate": -1.2
  },
  "duration_s": 1.1,
  "curve": "soft_spring",
  "source": "source/css/37m388zf6rymp.pretty.css:801-815"
 },
 {
  "id": "reveal_on_scroll",
  "layer": ".reveal sections (home)",
  "property": "opacity / translateY",
  "values": {
   "opacity": [
    0,
    1
   ],
   "y": [
    26,
    0
   ]
  },
  "duration_s": 0.7,
  "curve": "settle",
  "note": "DORMANT: all three sections ship server-rendered as 'reveal in', so the transition never plays",
  "source": "source/css/3q17cp_jgfwol.pretty.css:1099-1109"
 }
];

/** Cubic-bezier easing as a pure function (same maths as CSS / Remotion Easing.bezier). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - t;
      const d = dx(u);
      if (Math.abs(e) < 1e-7) return sy(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0, hi = 1;
    u = t;
    for (let i = 0; i < 40; i++) {
      const x = sx(u);
      if (Math.abs(x - t) < 1e-7) break;
      if (x < t) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return sy(u);
  };
}

export type CurveName = keyof typeof CURVES;
export const EASE: Record<CurveName, (t: number) => number> = Object.fromEntries(
  (Object.keys(CURVES) as CurveName[]).map((k) => [k, cubicBezier(...CURVES[k])]),
) as Record<CurveName, (t: number) => number>;

/** Seconds -> frames. */
export const sec = (s: number, fps = 30): number => Math.round(s * fps);

/** CSS-style yoyo loop: 0% = a, 50% = b, 100% = a, easing applied per half (as CSS keyframes do). */
export function yoyo(tSec: number, periodS: number, a: number, b: number, phaseS = 0, ease: (t: number) => number = EASE.inOut): number {
  const u = ((((tSec + phaseS) % periodS) + periodS) % periodS) / periodS;
  return u < 0.5 ? a + (b - a) * ease(u / 0.5) : b + (a - b) * ease((u - 0.5) / 0.5);
}

/** Hero idle state at time t (s): the three floating objects and the star layer. */
export const heroIdle = (tSec: number) => ({
  fb1: { rotateDeg: yoyo(tSec, IDLE.coverFloat1.periodS, ...IDLE.coverFloat1.rotateDeg), yPx: yoyo(tSec, IDLE.coverFloat1.periodS, ...IDLE.coverFloat1.yPx) },
  fb2: { rotateDeg: yoyo(tSec, IDLE.coverFloat2.periodS, ...IDLE.coverFloat2.rotateDeg), yPx: yoyo(tSec, IDLE.coverFloat2.periodS, ...IDLE.coverFloat2.yPx) },
  badge: { rotateDeg: yoyo(tSec, IDLE.badgeFloat.periodS, ...IDLE.badgeFloat.rotateDeg), yPx: yoyo(tSec, IDLE.badgeFloat.periodS, ...IDLE.badgeFloat.yPx) },
  starsOpacity: yoyo(tSec, IDLE.starTwinkle.periodS, ...IDLE.starTwinkle.opacity),
});

// ---------------------------------------------------------------- assets (paths relative to the library root)
export const ASSET_ROOT_FROM_THIS_FILE = "..";
export const assetUrl = (path: string, base: string = ASSET_ROOT_FROM_THIS_FILE): string => `${base}/${path}`;

export interface Scene { id: string; image: string; audio: string; narrationS: number; narrationLufs: number }
/** Sample book "Iris och den sparade platsen" [Iris and the Saved Place]: 14 beats, 1264x848 spreads, narrator "grandpa".
 *  Branch tree: S1 -> S2 -> {S3A -> S4A -> {S5AA -> S6AA | S5AB -> S6AB} | S3B -> S4B -> {S5BA -> S6BA | S5BB -> S6BB}}.
 *  Durations/loudness: derived/audio/audio-specs.csv. */
export const SCENES: readonly Scene[] = [
  { id: "S1", image: "assets/share/iris-sparade-platsen/assets/S1.webp", audio: "assets/share/iris-sparade-platsen/assets/S1.mp3", narrationS: 67.04, narrationLufs: -18.7 },
  { id: "S2", image: "assets/share/iris-sparade-platsen/assets/S2.webp", audio: "assets/share/iris-sparade-platsen/assets/S2.mp3", narrationS: 67.44, narrationLufs: -19.5 },
  { id: "S3A", image: "assets/share/iris-sparade-platsen/assets/S3A.webp", audio: "assets/share/iris-sparade-platsen/assets/S3A.mp3", narrationS: 64.28, narrationLufs: -19.7 },
  { id: "S3B", image: "assets/share/iris-sparade-platsen/assets/S3B.webp", audio: "assets/share/iris-sparade-platsen/assets/S3B.mp3", narrationS: 66.08, narrationLufs: -19.5 },
  { id: "S4A", image: "assets/share/iris-sparade-platsen/assets/S4A.webp", audio: "assets/share/iris-sparade-platsen/assets/S4A.mp3", narrationS: 53.28, narrationLufs: -18.5 },
  { id: "S4B", image: "assets/share/iris-sparade-platsen/assets/S4B.webp", audio: "assets/share/iris-sparade-platsen/assets/S4B.mp3", narrationS: 57.24, narrationLufs: -18.9 },
  { id: "S5AA", image: "assets/share/iris-sparade-platsen/assets/S5AA.webp", audio: "assets/share/iris-sparade-platsen/assets/S5AA.mp3", narrationS: 62.28, narrationLufs: -19.6 },
  { id: "S5AB", image: "assets/share/iris-sparade-platsen/assets/S5AB.webp", audio: "assets/share/iris-sparade-platsen/assets/S5AB.mp3", narrationS: 63.2, narrationLufs: -19.8 },
  { id: "S5BA", image: "assets/share/iris-sparade-platsen/assets/S5BA.webp", audio: "assets/share/iris-sparade-platsen/assets/S5BA.mp3", narrationS: 69.16, narrationLufs: -19.1 },
  { id: "S5BB", image: "assets/share/iris-sparade-platsen/assets/S5BB.webp", audio: "assets/share/iris-sparade-platsen/assets/S5BB.mp3", narrationS: 65.04, narrationLufs: -19.4 },
  { id: "S6AA", image: "assets/share/iris-sparade-platsen/assets/S6AA.webp", audio: "assets/share/iris-sparade-platsen/assets/S6AA.mp3", narrationS: 63.6, narrationLufs: -19.3 },
  { id: "S6AB", image: "assets/share/iris-sparade-platsen/assets/S6AB.webp", audio: "assets/share/iris-sparade-platsen/assets/S6AB.mp3", narrationS: 65.6, narrationLufs: -19.9 },
  { id: "S6BA", image: "assets/share/iris-sparade-platsen/assets/S6BA.webp", audio: "assets/share/iris-sparade-platsen/assets/S6BA.mp3", narrationS: 58.52, narrationLufs: -19.3 },
  { id: "S6BB", image: "assets/share/iris-sparade-platsen/assets/S6BB.webp", audio: "assets/share/iris-sparade-platsen/assets/S6BB.mp3", narrationS: 72.52, narrationLufs: -19.9 },
];

export interface AudioBed { id: string; group: "ambience" | "music"; labelSv: string; labelEn: string; path: string; durationS: number; lufs: number; truePeakDbtp: number }
/** Waiting-room beds (glöd stage). Seamless 30 s loops; in-app default gain -14.89 dB, slider max 0.4 linear.
 *  Catalogue: source/js/1pgfdvt65g9p-.js @36419; specs: derived/audio/audio-specs.csv; default bed "hearth". */
export const AUDIO_BEDS: readonly AudioBed[] = [
  { id: "hearth", group: "ambience", labelSv: "Brasa", labelEn: "Fireplace", path: "assets/audio/atmosphere/v1/hearth.mp3", durationS: 30.0, lufs: -24.4, truePeakDbtp: -2.6 },
  { id: "rain", group: "ambience", labelSv: "Fönsterregn", labelEn: "Window rain", path: "assets/audio/atmosphere/v1/rain.mp3", durationS: 30.0, lufs: -24.7, truePeakDbtp: -3.2 },
  { id: "forest", group: "ambience", labelSv: "Sagoskogen", labelEn: "Enchanted forest", path: "assets/audio/atmosphere/v1/forest.mp3", durationS: 30.0, lufs: -24.4, truePeakDbtp: -3.1 },
  { id: "musicbox", group: "music", labelSv: "Speldosa", labelEn: "Music box", path: "assets/audio/atmosphere/v1/musicbox.mp3", durationS: 30.0, lufs: -24.3, truePeakDbtp: -11.0 },
  { id: "harp", group: "music", labelSv: "Månharpa", labelEn: "Moonlit harp", path: "assets/audio/atmosphere/v1/harp.mp3", durationS: 30.0, lufs: -24.3, truePeakDbtp: -9.3 },
  { id: "fire", group: "music", labelSv: "Glödljus", labelEn: "Ember glow", path: "assets/audio/atmosphere/v1/fire.mp3", durationS: 30.0, lufs: -24.4, truePeakDbtp: -5.6 },
];
/** Landing narrator sample: "Morfar" (sv) / "Grandpa Erik" (en). */
export const VOICE_SAMPLES = { sv: { path: "assets/audio/landing-voice/grandpa-sample.mp3", durationS: 13.0, lufs: -26.6 }, en: { path: "assets/audio/landing-voice/grandpa-sample-en.mp3", durationS: 12.0, lufs: -26.8 } } as const;

export const ASSETS = {
  "backgrounds": {
    "natt": "assets/assets/nebula-hero.webp",
    "nattObjectPosition": "center 30%",
    "morgonDesktop": "assets/assets/morgon-aurora-desktop.webp",
    "morgonMobile": "assets/assets/morgon-aurora-mobile.webp",
    "scrimRgba1920": "derived/theming/night-stack/element__scrim-rgba__1920x1080.png",
    "scrimRgba3840": "derived/theming/night-stack/element__scrim-rgba__3840x2160.png",
    "starfieldRgba1920": "derived/theming/night-stack/element__starfield-rgba__1920x1080__peak-opacity.png",
    "starfieldRgba3840": "derived/theming/night-stack/element__starfield-rgba__3840x2160__peak-opacity.png",
    "nattFullStack1440": "derived/theming/night-stack/plate__full-stack__desktop.webp"
  },
  "logo": {
    "mark": "assets/assets/tf-logo.webp",
    "markOnly": "derived/brand/logo-parts/tf-logo__mark-only.png",
    "trimmed": "derived/brand/logo-parts/tf-logo__trimmed.png",
    "wordmarkOnly": "derived/brand/logo-parts/tf-logo__wordmark-only.png",
    "lockupNatt": "derived/brand/lockups/nav-lockup__natt__transparent@3x.png",
    "lockupMorgon": "derived/brand/lockups/nav-lockup__morgon__transparent@3x.png",
    "appIcon512": "assets/icons/icon-512.png",
    "ogImage": "assets/brand/opengraph-image.png"
  },
  "covers": {
    "tornet": "assets/assets/cover-tornet.webp",
    "filten": "assets/assets/cover-filten.webp",
    "nextBook": "assets/landing/cover-next-book.webp",
    "sampleBook": "assets/share/iris-sparade-platsen/assets/cover.webp"
  },
  "landing": {
    "heroPortrait": "assets/landing/iris/hero-portrait.webp",
    "sceneChoice": "assets/landing/iris/scene-choice.webp",
    "coverThumb": "assets/landing/iris/cover-thumb.webp",
    "endings": [
      "assets/landing/iris/ending-1.webp",
      "assets/landing/iris/ending-2.webp",
      "assets/landing/iris/ending-3.webp",
      "assets/landing/iris/ending-4.webp"
    ],
    "adventurePicks": [
      "assets/landing/cards/pick-1.webp",
      "assets/landing/cards/pick-2.webp",
      "assets/landing/cards/pick-3.webp"
    ],
    "surpriseUs": "assets/images/create/surprise-us.webp",
    "narratorMorfar": "assets/landing/voice/narrator-morfar.webp",
    "avatarNoah": "assets/assets/avatar-noah.jpg",
    "avatarSixten": "assets/assets/avatar-sixten.jpg",
    "endingsMapNatt": "derived/icons/endings-map-clean__natt.webp",
    "endingsMapMorgon": "derived/icons/endings-map-clean__morgon.webp"
  }
} as const;

