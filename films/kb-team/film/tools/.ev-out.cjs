"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// tools/remotion-shim.cjs
var require_remotion_shim = __commonJS({
  "tools/remotion-shim.cjs"(exports2, module2) {
    "use strict";
    var React2 = require("react");
    var real = require(require("node:path").resolve(__dirname, "../node_modules/remotion"));
    var box = (p) => React2.createElement("div", { style: p.style }, p.children);
    module2.exports = {
      ...real,
      useCurrentFrame: () => globalThis.__frame ?? 0,
      useVideoConfig: () => ({ fps: 60, width: 1920, height: 1080, durationInFrames: 3912, id: "Film" }),
      delayRender: () => 0,
      continueRender: () => {
      },
      AbsoluteFill: box,
      Sequence: box,
      Img: (p) => React2.createElement("img", { src: p.src, style: p.style }),
      staticFile: (s) => "/" + s
    };
  }
});

// src/Film.tsx
var import_remotion13 = __toESM(require_remotion_shim());

// src/timeline.ts
var FPS = 60;
var DUR_FRAMES = 3003;
var PKGS = [
  { id: "R01", f0: 0, f1: 92, cuts: [64, 75], shots: "A B: the opening words and the image card; three screens" },
  { id: "R02", f0: 93, f1: 187, cuts: [130], shots: "D E: the words with the portraits; the logo" },
  { id: "R03", f0: 188, f1: 264, cuts: [192, 196, 200, 205, 254], shots: "F G H: four filmed flash cuts; the caret and the typed words; the macro letters" },
  { id: "R04", f0: 265, f1: 384, cuts: [295], shots: "I J K L: the message box and the click; the glyphs; the pieces flying in; the card at work" },
  { id: "R05", f0: 385, f1: 474, cuts: [387, 393, 396, 399, 402, 405, 408, 411, 414, 417, 420, 423, 426, 429, 431, 434], shots: "M N O: the full-screen flash cuts; the macro letters; the second message" },
  { id: "R06", f0: 475, f1: 556, cuts: [478, 484, 513, 528], shots: "P Q R S: the circles; the browser; the filmed customer; the hands and the climbing row" },
  { id: "R07", f0: 557, f1: 662, cuts: [606, 610, 618, 622, 639], shots: "T U V W: the dark message box with attachments; sketch, drawing, wireframe; the finished UI; the filmed founder" },
  { id: "R08", f0: 663, f1: 732, cuts: [679, 699], shots: "X Y Z: the UI close-up; the browser with the dashboard; the chart close-up" },
  { id: "R09", f0: 733, f1: 832, cuts: [748, 760, 771, 787, 810], shots: "AA-AD AE AF: four filmed people with a line of text; the one button; the burst of cards" },
  { id: "R10", f0: 833, f1: 961, cuts: [847, 871, 900, 925], shots: "AG AH AI AJ: the collage; the window that becomes full-bleed; the close canvas; the wide canvas" },
  { id: "R11", f0: 962, f1: 1079, cuts: [1007, 1050], shots: "AK AL AM: the update with check marks; the macro sentence; the button in the corner" },
  { id: "R12", f0: 1080, f1: 1200, cuts: [1152, 1164], shots: "AN AO AP: the filmed close with typed words; the glyph row; the end logo" }
];

// src/shots/R01.tsx
var import_remotion3 = __toESM(require_remotion_shim());

// src/kit.tsx
var import_react = require("react");
var import_remotion2 = __toESM(require_remotion_shim());

// src/hand.tsx
var import_remotion = __toESM(require_remotion_shim());

// src/handTips.json
var handTips_default = { "-40_-40": [0.538, 0.3667], "-40_-35": [0.4283, 0.3633], "-40_-30": [0.425, 0.36], "-40_-25": [0.4217, 0.3567], "-40_-20": [0.42, 0.35], "-40_-15": [0.4167, 0.3467], "-40_-10": [0.4167, 0.34], "-40_-5": [0.415, 0.3367], "-40_0": [0.415, 0.33], "-40_5": [0.415, 0.3267], "-40_10": [0.4133, 0.32], "-40_15": [0.4167, 0.3167], "-40_20": [0.4183, 0.31], "-40_25": [0.42, 0.3033], "-40_30": [0.425, 0.3], "-40_35": [0.43, 0.2933], "-40_40": [0.4333, 0.29], "-35_-40": [0.4317, 0.3333], "-35_-35": [0.4267, 0.33], "-35_-30": [0.4217, 0.3267], "-35_-25": [0.42, 0.32], "-35_-20": [0.4167, 0.3167], "-35_-15": [0.415, 0.3133], "-35_-10": [0.4133, 0.3067], "-35_-5": [0.4133, 0.3033], "-35_0": [0.4117, 0.2967], "-35_5": [0.4117, 0.2933], "-35_10": [0.4117, 0.2867], "-35_15": [0.4133, 0.2833], "-35_20": [0.4167, 0.2767], "-35_25": [0.42, 0.2733], "-35_30": [0.4233, 0.2667], "-35_35": [0.4283, 0.2633], "-35_40": [0.435, 0.26], "-30_-40": [0.4283, 0.3], "-30_-35": [0.4233, 0.2967], "-30_-30": [0.4183, 0.2933], "-30_-25": [0.415, 0.29], "-30_-20": [0.4133, 0.2833], "-30_-15": [0.4133, 0.28], "-30_-10": [0.41, 0.2767], "-30_-5": [0.4117, 0.27], "-30_0": [0.41, 0.2667], "-30_5": [0.41, 0.26], "-30_10": [0.41, 0.2567], "-30_15": [0.4133, 0.25], "-30_20": [0.415, 0.2467], "-30_25": [0.42, 0.2433], "-30_30": [0.4233, 0.2367], "-30_35": [0.4283, 0.2333], "-30_40": [0.4333, 0.23], "-25_-40": [0.425, 0.27], "-25_-35": [0.42, 0.2667], "-25_-30": [0.4167, 0.2633], "-25_-25": [0.4133, 0.2567], "-25_-20": [0.4117, 0.2533], "-25_-15": [0.4083, 0.25], "-25_-10": [0.4083, 0.2433], "-25_-5": [0.4083, 0.24], "-25_0": [0.4067, 0.2367], "-25_5": [0.4083, 0.23], "-25_10": [0.4083, 0.2267], "-25_15": [0.41, 0.2233], "-25_20": [0.4133, 0.2167], "-25_25": [0.4167, 0.2133], "-25_30": [0.4217, 0.21], "-25_35": [0.4283, 0.2067], "-25_40": [0.4333, 0.2033], "-20_-40": [0.4233, 0.24], "-20_-35": [0.4167, 0.2367], "-20_-30": [0.4133, 0.2333], "-20_-25": [0.4083, 0.23], "-20_-20": [0.4067, 0.2233], "-20_-15": [0.4067, 0.22], "-20_-10": [0.405, 0.2167], "-20_-5": [0.4033, 0.2133], "-20_0": [0.405, 0.21], "-20_5": [0.405, 0.2033], "-20_10": [0.4067, 0.2], "-20_15": [0.41, 0.1967], "-20_20": [0.4117, 0.1933], "-20_25": [0.415, 0.1867], "-20_30": [0.42, 0.1833], "-20_35": [0.4267, 0.18], "-20_40": [0.4317, 0.1767], "-15_-40": [0.4217, 0.2133], "-15_-35": [0.415, 0.21], "-15_-30": [0.4083, 0.2067], "-15_-25": [0.405, 0.2033], "-15_-20": [0.4033, 0.1967], "-15_-15": [0.4017, 0.1933], "-15_-10": [0.4, 0.19], "-15_-5": [0.4017, 0.1867], "-15_0": [0.4, 0.1833], "-15_5": [0.4033, 0.18], "-15_10": [0.4033, 0.1767], "-15_15": [0.4067, 0.1733], "-15_20": [0.41, 0.17], "-15_25": [0.415, 0.1667], "-15_30": [0.42, 0.1633], "-15_35": [0.4233, 0.16], "-15_40": [0.43, 0.1567], "-10_-40": [0.4183, 0.1867], "-10_-35": [0.41, 0.1833], "-10_-30": [0.4067, 0.18], "-10_-25": [0.4033, 0.1767], "-10_-20": [0.4, 0.1733], "-10_-15": [0.3983, 0.1733], "-10_-10": [0.3967, 0.17], "-10_-5": [0.3967, 0.1667], "-10_0": [0.3983, 0.1633], "-10_5": [0.3983, 0.16], "-10_10": [0.4017, 0.1567], "-10_15": [0.405, 0.1533], "-10_20": [0.4067, 0.15], "-10_25": [0.4117, 0.1467], "-10_30": [0.4167, 0.1433], "-10_35": [0.4233, 0.14], "-10_40": [0.4283, 0.1367], "-5_-40": [0.4183, 0.1667], "-5_-35": [0.41, 0.1633], "-5_-30": [0.4033, 0.16], "-5_-25": [0.3983, 0.1567], "-5_-20": [0.395, 0.1533], "-5_-15": [0.3933, 0.1533], "-5_-10": [0.3933, 0.15], "-5_-5": [0.3933, 0.1467], "-5_0": [0.3933, 0.1433], "-5_5": [0.395, 0.14], "-5_10": [0.3983, 0.14], "-5_15": [0.4017, 0.1367], "-5_20": [0.4067, 0.1333], "-5_25": [0.41, 0.13], "-5_30": [0.4167, 0.13], "-5_35": [0.42, 0.1267], "-5_40": [0.425, 0.1233], "0_-40": [0.4167, 0.1467], "0_-35": [0.4083, 0.1433], "0_-30": [0.4033, 0.1433], "0_-25": [0.395, 0.14], "0_-20": [0.3917, 0.14], "0_-15": [0.3883, 0.1367], "0_-10": [0.3883, 0.1333], "0_-5": [0.3883, 0.1333], "0_0": [0.39, 0.13], "0_5": [0.3917, 0.1267], "0_10": [0.395, 0.1267], "0_15": [0.4, 0.1233], "0_20": [0.405, 0.1233], "0_25": [0.4067, 0.12], "0_30": [0.4117, 0.1167], "0_35": [0.4167, 0.1167], "0_40": [0.4183, 0.1167], "5_-40": [0.415, 0.1333], "5_-35": [0.4083, 0.13], "5_-30": [0.4017, 0.13], "5_-25": [0.395, 0.1267], "5_-20": [0.3917, 0.1267], "5_-15": [0.3883, 0.1267], "5_-10": [0.3833, 0.1233], "5_-5": [0.385, 0.1233], "5_0": [0.3867, 0.12], "5_5": [0.3883, 0.12], "5_10": [0.39, 0.1167], "5_15": [0.395, 0.1167], "5_20": [0.3983, 0.1167], "5_25": [0.4033, 0.1133], "5_30": [0.405, 0.1133], "5_35": [0.4083, 0.1133], "5_40": [0.4133, 0.11], "10_-40": [0.4133, 0.1233], "10_-35": [0.4067, 0.1233], "10_-30": [0.4, 0.12], "10_-25": [0.395, 0.12], "10_-20": [0.3917, 0.12], "10_-15": [0.3867, 0.12], "10_-10": [0.385, 0.12], "10_-5": [0.3817, 0.1167], "10_0": [0.3817, 0.1167], "10_5": [0.385, 0.1167], "10_10": [0.3867, 0.1167], "10_15": [0.3883, 0.1167], "10_20": [0.39, 0.1167], "10_25": [0.3933, 0.1133], "10_30": [0.3967, 0.1133], "10_35": [0.4017, 0.1133], "10_40": [0.4083, 0.1133], "15_-40": [0.4117, 0.1167], "15_-35": [0.405, 0.1167], "15_-30": [0.3983, 0.1167], "15_-25": [0.3933, 0.1167], "15_-20": [0.39, 0.1167], "15_-15": [0.385, 0.1167], "15_-10": [0.3817, 0.1167], "15_-5": [0.38, 0.1167], "15_0": [0.38, 0.1167], "15_5": [0.3783, 0.1167], "15_10": [0.3767, 0.1167], "15_15": [0.38, 0.12], "15_20": [0.3833, 0.12], "15_25": [0.3867, 0.12], "15_30": [0.39, 0.12], "15_35": [0.3967, 0.12], "15_40": [0.4033, 0.12], "20_-40": [0.4083, 0.11], "20_-35": [0.4033, 0.1133], "20_-30": [0.3967, 0.1133], "20_-25": [0.3933, 0.1133], "20_-20": [0.39, 0.1133], "20_-15": [0.385, 0.1167], "20_-10": [0.3833, 0.1167], "20_-5": [0.3817, 0.1167], "20_0": [0.3767, 0.12], "20_5": [0.3733, 0.12], "20_10": [0.3717, 0.1233], "20_15": [0.37, 0.1233], "20_20": [0.37, 0.1233], "20_25": [0.3767, 0.1267], "20_30": [0.3817, 0.1267], "20_35": [0.39, 0.13], "20_40": [0.395, 0.13], "25_-40": [0.4083, 0.1133], "25_-35": [0.4067, 0.1133], "25_-30": [0.3983, 0.1167], "25_-25": [0.3967, 0.1167], "25_-20": [0.39, 0.12], "25_-15": [0.3867, 0.12], "25_-10": [0.38, 0.1233], "25_-5": [0.375, 0.1267], "25_0": [0.3717, 0.1267], "25_5": [0.3683, 0.13], "25_10": [0.365, 0.1333], "25_15": [0.365, 0.1367], "25_20": [0.365, 0.1367], "25_25": [0.3667, 0.14], "25_30": [0.37, 0.1433], "25_35": [0.3767, 0.1467], "25_40": [0.3817, 0.1467], "30_-40": [0.4133, 0.12], "30_-35": [0.405, 0.1233], "30_-30": [0.4, 0.1267], "30_-25": [0.3917, 0.13], "30_-20": [0.3867, 0.13], "30_-15": [0.38, 0.1333], "30_-10": [0.3733, 0.1367], "30_-5": [0.37, 0.14], "30_0": [0.365, 0.1433], "30_5": [0.3633, 0.1467], "30_10": [0.3617, 0.15], "30_15": [0.3617, 0.1567], "30_20": [0.36, 0.16], "30_25": [0.3617, 0.1633], "30_30": [0.3633, 0.1667], "30_35": [0.3683, 0.17], "30_40": [0.375, 0.1733], "35_-40": [0.41, 0.1367], "35_-35": [0.4033, 0.14], "35_-30": [0.3933, 0.1433], "35_-25": [0.3867, 0.1467], "35_-20": [0.3783, 0.15], "35_-15": [0.3733, 0.1567], "35_-10": [0.3683, 0.16], "35_-5": [0.3633, 0.1633], "35_0": [0.36, 0.17], "35_5": [0.3567, 0.1733], "35_10": [0.3567, 0.18], "35_15": [0.3567, 0.1833], "35_20": [0.3567, 0.19], "35_25": [0.36, 0.1933], "35_30": [0.3617, 0.2], "35_35": [0.3667, 0.2033], "35_40": [0.3717, 0.21], "40_-40": [0.4067, 0.16], "40_-35": [0.3967, 0.1633], "40_-30": [0.3883, 0.17], "40_-25": [0.38, 0.1733], "40_-20": [0.3717, 0.18], "40_-15": [0.365, 0.1867], "40_-10": [0.36, 0.19], "40_-5": [0.3567, 0.1967], "40_0": [0.3533, 0.2033], "40_5": [0.3533, 0.21], "40_10": [0.3517, 0.2167], "40_15": [0.3533, 0.2233], "40_20": [0.355, 0.23], "40_25": [0.355, 0.2367], "40_30": [0.36, 0.2433], "40_35": [0.365, 0.2467], "40_40": [0.37, 0.2533] };

// src/hand.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
var f = (at12) => typeof at12 === "number" ? at12 * 30 : Number(at12) * 30;
var STEPS = Array.from({ length: 17 }, (_, i) => -40 + 5 * i);
var TIP = { x: 0.39, y: 0.135 };
var WRIST = { x: 0.5, y: 0.875 };
var Hand = ({ x, y, tiltX = 0, tiltY = 0, press = 0, size = 150, opacity = 1, rot = 0 }) => {
  if (opacity <= 1e-3) return null;
  const cl = (v2) => Math.max(-40, Math.min(40, v2));
  const ax = cl(tiltX) / 5 + 8, ay = cl(tiltY) / 5 + 8;
  const i0 = Math.min(15, Math.floor(ax)), j0 = Math.min(15, Math.floor(ay)), u = ax - i0, v = ay - j0;
  const img = (i, j, o) => o <= 3e-3 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_remotion.Img, { src: (0, import_remotion.staticFile)(`hand/h_${STEPS[i]}_${STEPS[j]}.png`), style: { position: "absolute", left: 0, top: 0, width: size, height: size, opacity: o } }, `${i}_${j}`);
  const sc = 1 - 0.12 * press;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
    position: "absolute",
    left: 0,
    top: 0,
    width: size,
    height: size,
    opacity,
    willChange: "transform",
    transformOrigin: `${WRIST.x * 100}% ${WRIST.y * 100}%`,
    transform: `translate3d(${(x - TIP.x * size).toFixed(3)}px, ${(y - TIP.y * size).toFixed(3)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)}, ${(sc * (1 - 0.08 * press)).toFixed(4)})`,
    filter: `drop-shadow(0 ${Math.max(1, 14 - 12 * press).toFixed(1)}px ${Math.max(2, 20 - 16 * press).toFixed(1)}px rgba(2,4,14,${Math.min(0.4, Math.max(0.1, 0.2 + 0.16 * press)).toFixed(3)}))`
  }, children: [
    img(i0, j0, 1),
    img(i0 + 1, j0, u),
    img(i0, j0 + 1, v * (1 - u)),
    img(i0 + 1, j0 + 1, u * v)
  ] });
};
var tipOf = (tiltX, tiltY) => {
  const cl = (v2) => Math.max(-40, Math.min(40, v2)), ax = cl(tiltX) / 5 + 8, ay = cl(tiltY) / 5 + 8;
  const i0 = Math.min(15, Math.floor(ax)), j0 = Math.min(15, Math.floor(ay)), u = ax - i0, v = ay - j0;
  const at12 = (i, j) => handTips_default[`${STEPS[i]}_${STEPS[j]}`];
  const a = at12(i0, j0), b = at12(i0 + 1, j0), c = at12(i0, j0 + 1), d = at12(i0 + 1, j0 + 1), m = (k) => (a[k] * (1 - u) + b[k] * u) * (1 - v) + (c[k] * (1 - u) + d[k] * u) * v;
  return { x: m(0), y: m(1) };
};
var PRESS = { tiltX: -40, tiltY: -10, rot: -9, dy: 4 };
var pressShift = (() => {
  const r = tipOf(0, 0), p = tipOf(PRESS.tiltX, PRESS.tiltY), sc = 1 - 0.12, sy = sc * (1 - 0.08), a = PRESS.rot * Math.PI / 180;
  const vx = (p.x - WRIST.x) * sc, vy = (p.y - WRIST.y) * sy;
  return { x: vx * Math.cos(a) - vy * Math.sin(a) - (r.x - WRIST.x), y: vx * Math.sin(a) + vy * Math.cos(a) - (r.y - WRIST.y) };
})();
var spring = (t, response, damping = 0.5) => {
  if (t <= 0) return 0;
  const w0 = 2 * Math.PI / response, wd = w0 * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + damping * w0 / wd * Math.sin(wd * t));
};
var glideTime = (dist) => Math.max(0.55, Math.min(1.6, 0.45 + dist / 1e3));
var EASE_IN_OUT = import_remotion.Easing.bezier(0.42, 0, 0.18, 1);
var glideEase = (u) => {
  const q = EASE_IN_OUT(clamp01(u));
  return q + 0.015 * Math.sin(Math.PI * clamp01((u - 0.72) / 0.28)) * clamp01((u - 0.72) / 0.1);
};
var REL = 0.32;
var shifted = (keysIn, size) => (
  // a click target is held with the fingertip hovering short of it by the press travel (see pressShift)
  keysIn.map((kk) => kk.click ? { ...kk, x: kk.x - pressShift.x * size, y: kk.y - pressShift.y * size - PRESS.dy } : kk)
);
var handPlan = (keysIn, size = 150) => {
  const keys = shifted(keysIn, size), out = [];
  let free = -1e9;
  for (let i = 1; i < keys.length; i++) {
    const kk = keys[i], at12 = f(kk.at) / 30, early = kk.early ?? 0.5;
    const dist = Math.hypot(kk.x - keys[i - 1].x, kk.y - keys[i - 1].y), want = Math.max(kk.dur ?? 0, glideTime(dist));
    let e = at12 - early, s0 = e - want;
    if (s0 < free) {
      e = Math.min(at12 - 0.1, free + want);
      s0 = Math.max(free, e - want);
    }
    if (e < s0 + 0.05) e = s0 + 0.05;
    out.push({ i, at: at12, s: s0, e, want, dist, rest: at12 - e, compressed: e - s0 < want * 0.9 });
    free = Math.max(e, at12 + (kk.click ? REL : 0));
  }
  return { keys, segs: out };
};
var warned = /* @__PURE__ */ new Set();
var posAt = (g, keysIn, size) => {
  const { keys, segs } = handPlan(keysIn, size), t = g / 30;
  let x = keys[0].x, y = keys[0].y;
  for (const sg of segs) {
    if (sg.compressed || keys[sg.i].click && sg.rest < 0.2) {
      const id = `${sg.i}@${sg.at.toFixed(2)}@${Math.round(sg.dist)}`;
      if (!warned.has(id)) {
        warned.add(id);
        console.warn(`[hand] key ${sg.i} at ${sg.at.toFixed(2)} s: glide ${(sg.e - sg.s).toFixed(2)} s for ${Math.round(sg.dist)} px (needs ${sg.want.toFixed(2)} s), rest ${sg.rest.toFixed(2)} s`);
      }
    }
    if (t <= sg.s) break;
    const q = glideEase((t - sg.s) / (sg.e - sg.s));
    x = keys[sg.i - 1].x + (keys[sg.i].x - keys[sg.i - 1].x) * q;
    y = keys[sg.i - 1].y + (keys[sg.i].y - keys[sg.i - 1].y) * q;
  }
  return { x, y };
};
var clickAt = (g, keys) => {
  let p = 0;
  for (const kk of keys) {
    if (!kk.click) continue;
    const t = g / 30 - f(kk.at) / 30;
    if (t < -0.03 || t > 1.4) continue;
    const v = t < 0.08 ? clamp01((t + 0.03) / 0.11) : t < 0.15 ? 1 : 1 - spring(t - 0.15, 0.4, 0.42);
    if (Math.abs(v) > Math.abs(p)) p = v;
  }
  return p;
};
var handAt = (g, keys, opts = {}) => {
  const size = opts.size ?? 150;
  const p = posAt(g, keys, size), a = posAt(g - 2, keys, size), b = posAt(g + 2, keys, size);
  const vx = (b.x - a.x) / 4 * 30, vy = (b.y - a.y) / 4 * 30;
  const press = clickAt(g, keys), q = 1 - Math.min(1, Math.abs(press)), fl = (opts.float ?? 3) * q, t = g / 30;
  const lean = (v) => Math.max(-20, Math.min(20, v / 65));
  return {
    x: p.x + fl * 0.6 * Math.sin(t * 1.7),
    y: p.y + fl * Math.sin(t * 2.3 + 1) + PRESS.dy * press,
    tiltY: lean(vx) + 4 * q * Math.sin(t * 1.1) + PRESS.tiltY * press,
    tiltX: -lean(vy) * 0.6 + PRESS.tiltX * press + 3 * q * Math.sin(t * 1.4 + 0.6),
    rot: Math.max(-10, Math.min(10, vx / 120 + vy / 280)) + PRESS.rot * press,
    press,
    size
  };
};

// src/kit.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var C = { paper: "#F6F6F4", ink: "#293A51", cyan: "#38C8FF", dark: "#111A27", dark2: "#1B2636", ui: "#E9E8E4", line: "rgba(41,58,81,.14)", sub: "#7A8494", mint: "#22C7A0", violet: "#7C6CFF", indigo: "#4F7BFF", amber: "#FFB547", coral: "#FF7A66", green: "#22B573", white: "#FFFFFF" };
var F = "Montserrat, sans-serif";
var SH = "0 30px 70px rgba(41,58,81,.16), 0 4px 14px rgba(41,58,81,.08)";
var FACES = [["Montserrat", "montserrat-var-latin.woff2", "100 900"], ["Montserrat", "montserrat-var-latin-ext.woff2", "100 900"], ["Copperplate CC", "copperplate-cc-heavy.otf", "800"]];
var useFonts = () => {
  const [ok, setOk] = (0, import_react.useState)(false);
  const [h] = (0, import_react.useState)(() => (0, import_remotion2.delayRender)("fonts"));
  (0, import_react.useEffect)(() => {
    const el = document.createElement("style");
    el.textContent = FACES.map(([f2, file, w]) => `@font-face{font-family:'${f2}';src:url(${(0, import_remotion2.staticFile)("fonts/" + file)});font-weight:${w}}`).join("\n");
    document.head.appendChild(el);
    Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 60px Montserrat`))).then(() => {
      setOk(true);
      (0, import_remotion2.continueRender)(h);
    });
  }, [h]);
  return ok;
};
var abs = (x, y, w, h, more = {}) => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });
var Ground = ({ tone = "paper", children }) => {
  const bg = { paper: `radial-gradient(120% 100% at 50% 45%, #FBFBFA 0%, ${C.paper} 60%, #EEEEEB 100%)`, vig: "radial-gradient(90% 90% at 50% 50%, #FFFFFF 0%, #EFEFF1 55%, #D6D7DB 100%)", ui: C.ui, dark: C.dark, cyan: C.cyan }[tone];
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.AbsoluteFill, { style: { background: bg, fontFamily: F, color: C.ink, overflow: "hidden" }, children });
};
var Tx = ({ x, y, s, w = 500, c = C.ink, children, style }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { position: "absolute", left: x, top: y, fontSize: s, fontWeight: w, color: c, letterSpacing: -s * 0.03, lineHeight: 1.08, whiteSpace: "nowrap", ...style }, children });
var Port = ({ who, x, y, w, h, cap, rot = 0, o = 1 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(x, y, w, void 0, { transform: `rotate(${rot}deg)`, opacity: o }), children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: w, height: h, borderRadius: 6, overflow: "hidden", boxShadow: "0 14px 34px rgba(41,58,81,.18)" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.Img, { src: (0, import_remotion2.staticFile)(`team/${who}.jpg`), style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" } }) }),
  cap && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 10, fontSize: 15, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: 7, height: 7, borderRadius: 4, background: C.cyan } }),
    cap
  ] })
] });
var Tile = ({ x, y, s }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.Img, { src: (0, import_remotion2.staticFile)("logo/kb-logo-tile.svg"), style: abs(x - s / 2, y - s / 2, s, s, { borderRadius: s * 0.075 }) });
var Arrow = ({ s, c }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: s, height: s, viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 19V6M6 12l6-6 6 6", fill: "none", stroke: c, strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
var Msg = ({ x, y, w, text, dark, big = 1, children }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(x, y, w, void 0, { background: dark ? C.dark2 : C.white, borderRadius: 16 * big, boxShadow: dark ? "none" : "0 20px 50px rgba(41,58,81,.10)", border: dark ? "1px solid rgba(255,255,255,.08)" : "none", padding: `${30 * big}px ${36 * big}px ${24 * big}px` }), children: [
  children,
  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 30 * big, fontWeight: 500, lineHeight: 1.36, color: dark ? "#E8EDF4" : C.ink, letterSpacing: -0.4, minHeight: 82 * big }, children: [
    text,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { display: "inline-block", width: 2.5 * big, height: 32 * big, background: dark ? "#fff" : C.ink, marginLeft: 3, verticalAlign: "-5px" } })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 16 * big, marginTop: 18 * big, fontSize: 21 * big, fontWeight: 600, color: dark ? "#C5CEDB" : C.ink }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 30 * big, fontWeight: 400 }, children: "+" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: 1, height: 26 * big, background: dark ? "rgba(255,255,255,.15)" : C.line } }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.Img, { src: (0, import_remotion2.staticFile)("logo/kb-logo-tile.svg"), style: { width: 28 * big, height: 28 * big, borderRadius: 5 } }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "K.B team" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: "auto", fontWeight: 500 }, children: "Send" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 44 * big, height: 44 * big, borderRadius: 11 * big, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Arrow, { s: 24 * big, c: C.ink }) })
  ] })
] });
var Over = ({ text }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(560, 470, 820, void 0, { color: "#fff", fontSize: 40, fontWeight: 500, lineHeight: 1.3, letterSpacing: -0.6, textShadow: "0 2px 18px rgba(0,0,0,.45)" }), children: [
  text,
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(740, 108, 40, 40, { borderRadius: 10, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Arrow, { s: 22, c: C.ink }) })
] });
var Glyph = ({ k, s, c = C.ink }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: s, height: s, viewBox: "0 0 100 100", children: [
  k === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { fill: c, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "50", cy: "50", r: "15" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "50", cy: "15", r: "13" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "50", cy: "85", r: "13" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "15", cy: "50", r: "13" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "85", cy: "50", r: "13" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "44", y: "15", width: "12", height: "70" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "15", y: "44", width: "70", height: "12" })
  ] }),
  k === 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { fill: "none", stroke: c, strokeWidth: "15", strokeLinejoin: "round", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M36 14 L10 50 L36 86" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M64 14 L90 50 L64 86" })
  ] }),
  k === 2 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { fill: c, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "6", y: "6", width: "88", height: "88", rx: "24" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M50 76V28M30 46l20-20 20 20", fill: "none", stroke: "#F6F6F4", strokeWidth: "11", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }),
  k === 3 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { fill: c, d: "M50 2 C55 32 68 45 98 50 C68 55 55 68 50 98 C45 68 32 55 2 50 C32 45 45 32 50 2Z" }),
  k === 4 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("g", { fill: c, children: [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: 8 + i * 30, y: 8 + j * 30, width: "24", height: "24", rx: "6" }, `${i}${j}`))) })
] });
var Bar = ({ x, y, w, h, c = "#DADDE3", r }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(x, y, w, h, { background: c, borderRadius: r ?? h / 2 }) });
var Win = ({ x, y, w, h, dark, children, bar = true }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(x, y, w, h, { background: dark ? "#141D2B" : C.white, borderRadius: 16, boxShadow: SH, overflow: "hidden" }), children: [
  bar && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: 40, background: dark ? "#0F1722" : "#F1F2F4", display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }, children: ["#FF6059", "#FFBD2E", "#28C941"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: 11, height: 11, borderRadius: 6, background: c } }, c)) }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { position: "relative", width: "100%", height: h - (bar ? 40 : 0) }, children })
] });
var Tool = ({ n, x, y, s, navy, rot = 0 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(x, y, s, s, { borderRadius: s * 0.22, background: navy ? C.ink : C.white, boxShadow: "0 12px 30px rgba(41,58,81,.14)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${rot}deg)` }), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.Img, { src: (0, import_remotion2.staticFile)(`tools/${n}.png`), style: { width: "62%", height: "62%", objectFit: "contain" } }) });
var Check = ({ s = 30 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: s, height: s, borderRadius: s / 2, background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: s * 0.6, height: s * 0.6, viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5 12.5l4.5 4.5L19 7.5", fill: "none", stroke: "#fff", strokeWidth: "3.2", strokeLinecap: "round", strokeLinejoin: "round" }) }) });
var TEAM = ["robin", "tom", "youri", "karl", "cedric"];
var ROLE = { robin: "Founder & CEO", tom: "Co-Founder & CTO", youri: "Software Engineering", karl: "Commercial Technology", cedric: "Fractional CSO & Advisor" };
var FlowCard = ({ x, y, s = 1, done = 2 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(x, y, 420 * s, 780 * s, { background: C.white, borderRadius: 34 * s, boxShadow: SH, padding: 30 * s }), children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 22 * s, fontWeight: 700, letterSpacing: 1.2 * s, color: C.ink }, children: "FOLLOW-UPS" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 17 * s, color: C.sub, marginTop: 4 * s, fontWeight: 500 }, children: "runs by itself" }),
  ["New lead", "Follow-up sent", "CRM updated", "Team notified"].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 22 * s, height: 124 * s, borderRadius: 22 * s, background: i < done ? "#E9F8F1" : "#F2F4F7", border: `2px solid ${i < done ? "#BFE9D5" : "transparent"}`, display: "flex", alignItems: "center", gap: 18 * s, padding: `0 ${22 * s}px` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 64 * s, height: 64 * s, borderRadius: 18 * s, background: [C.ink, C.cyan, C.indigo, C.mint][i], display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Glyph, { k: [0, 2, 4, 3][i], s: 34 * s, c: "#fff" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 25 * s, fontWeight: 600 }, children: t }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginLeft: "auto" }, children: i < done ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Check, { s: 34 * s }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 34 * s, height: 34 * s, borderRadius: 17 * s, border: `3px solid #C9CFD8` } }) })
  ] }, t))
] });
var Rank = ({ x, y, w, at: at12 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(x, y, w), children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: "ui-monospace, Menlo, monospace" }, children: "RANKING" }),
  Array.from({ length: 7 }, (_, i) => {
    const me = i === at12;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 14, height: 84, borderRadius: 12, background: me ? "#F4F7FA" : "#1B2636", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", boxShadow: me ? "0 14px 40px rgba(56,200,255,.35)" : "none" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 34, fontWeight: 500, color: me ? C.ink : "#C5CEDB", width: 34, fontFamily: "ui-monospace, Menlo, monospace" }, children: i + 1 }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 34, height: 34, borderRadius: 8, background: me ? C.cyan : ["#4F7BFF", "#22C7A0", "#FFB547", "#7C6CFF", "#FF7A66", "#8FA0B6", "#4F7BFF"][i] } }),
      me ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 30, fontWeight: 700, color: C.ink }, children: "Your business" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 260 - i % 3 * 50, height: 14, borderRadius: 7, background: "#33425A" } }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginLeft: "auto", fontSize: 24, fontWeight: 600, color: me ? C.green : "#5E6E86", fontFamily: "ui-monospace, Menlo, monospace" }, children: me ? "\u25B2 5" : "\u2014" })
    ] }, i);
  })
] });
var Bars = ({ x, y, w, h, n = 14, c = C.indigo }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(x, y, w, h, { display: "flex", alignItems: "flex-end", gap: w / n * 0.28 }), children: Array.from({ length: n }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, height: `${30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + i / n * 0.45)}%`, background: i === n - 3 ? C.cyan : c, borderRadius: "5px 5px 0 0" } }, i)) });
var AppUI = ({ s = 1, wire }) => {
  const g = wire ? "#D5D9DF" : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative", width: 1500 * s, height: 800 * s, transform: `scale(${s})`, transformOrigin: "0 0" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(0, 0, 320, 800, { background: wire ? "#EEF0F3" : "#F4F6F9", borderRight: `1px solid ${C.line}` }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(30, 30, 56, 56, { borderRadius: 14, background: g ?? C.ink }) }),
      [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar, { x: 30, y: 130 + i * 64, w: 210 - i % 2 * 50, h: 18, c: i === 0 && !wire ? C.cyan : "#D5D9DF" }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(360, 34, 620, 44, { fontSize: 38, fontWeight: 700 }), children: wire ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar, { x: 0, y: 8, w: 340, h: 26, c: "#C9CED6" }) : "Bookings" }),
    [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(360 + i * 280, 110, 256, 150, { borderRadius: 20, background: g ?? [C.ink, C.cyan, "#EEF3FF"][i], border: wire ? "2px dashed #B9C0CA" : "none" }), children: !wire && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar, { x: 24, y: 26, w: 120, h: 12, c: i === 0 ? "rgba(255,255,255,.4)" : "rgba(41,58,81,.3)" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(24, 62, 200, 60, { fontSize: 50, fontWeight: 700, color: i === 0 ? "#fff" : C.ink }), children: ["248", "92%", "4.8"][i] })
    ] }) }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(360, 290, 816, 470, { borderRadius: 22, background: wire ? "#EEF0F3" : "#FFFFFF", border: wire ? "2px dashed #B9C0CA" : `1px solid ${C.line}` }), children: !wire && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bars, { x: 40, y: 70, w: 736, h: 360 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(1210, 110, 260, 650, { borderRadius: 22, background: wire ? "#EEF0F3" : "#F4F6F9", border: wire ? "2px dashed #B9C0CA" : "none" }), children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: abs(20, 24 + i * 122, 220, 104, { borderRadius: 16, background: wire ? "#E1E4E9" : "#fff" }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: abs(16, 20, 64, 64, { borderRadius: 14, background: g ?? [C.cyan, C.mint, C.amber, C.violet, C.coral][i] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar, { x: 96, y: 30, w: 100, h: 12, c: "#C9CED6" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Bar, { x: 96, y: 58, w: 70, h: 10 })
    ] }, i)) })
  ] });
};
var FPS2 = 60;
var clamp = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
var mix = (a, b, p) => a + (b - a) * p;
var ease = { inOut: import_remotion2.Easing.bezier(0.65, 0, 0.35, 1), out: import_remotion2.Easing.bezier(0.16, 1, 0.3, 1), in: import_remotion2.Easing.bezier(0.5, 0, 0.75, 0), smooth: import_remotion2.Easing.bezier(0.42, 0, 0.18, 1) };
var E = (t, t0, d, f2 = ease.inOut) => f2(clamp((t - t0) / d));
var S = (t, t0, cfg = {}) => t < t0 ? 0 : (0, import_remotion2.spring)({ frame: (t - t0) * FPS2, fps: FPS2, config: { damping: 14, stiffness: 170, mass: 0.9, ...cfg } });
var rs = (refFrames) => refFrames / 24;
var typed = (text, t, t0, cps) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps + 1e-6))));
var Caret = ({ t, h, w = Math.max(2, h * 0.045), c = C.ink, typing, style }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { display: "inline-block", width: w, height: h, background: c, marginLeft: h * 0.06, verticalAlign: "-0.12em", opacity: typing || t % 1.06 < 0.53 ? 1 : 0, ...style } });
var Fringe = ({ o = 0.05 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.AbsoluteFill, { style: { backgroundImage: `repeating-linear-gradient(90deg, rgba(255,60,60,${o}) 0 2px, rgba(60,255,120,${o}) 2px 4px, rgba(60,120,255,${o}) 4px 6px)`, mixBlendMode: "multiply" } });
var Footage = ({ name, at: at12, scale = 1, x = 0, y = 0, dim = 0, grade = "contrast(1.06) saturate(1.08) sepia(0.10) brightness(0.98)", style }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_remotion2.AbsoluteFill, { style: { overflow: "hidden", background: "#000", ...style }, children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.AbsoluteFill, { style: { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`, filter: grade, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.Freeze, { frame: Math.max(0, Math.round(at12 * FPS2)), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.OffthreadVideo, { src: (0, import_remotion2.staticFile)(`footage/${name}.mp4`), muted: true, style: { width: 1920, height: 1080, objectFit: "cover" } }) }) }),
  dim > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remotion2.AbsoluteFill, { style: { background: `rgba(10,16,26,${dim})` } })
] });
var HandAt = ({ t, keys, size = 190 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Hand, { ...handAt(t * 30, keys, { size }) });
var pressAt = (t, c) => t < c + 0.03 ? 0 : Math.max(0, Math.sin(Math.PI * clamp((t - c - 0.03) / 0.34)));

// src/shots/R01.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var T = (n) => n / 24;
var EPS = 1e-6;
var fast = { damping: 20, stiffness: 400, mass: 0.5 };
var snap = { damping: 20, stiffness: 800, mass: 0.3 };
var pop = (t, n) => S(t, T(n), fast);
var bump = (x) => x <= 0 || x >= 1 ? 0 : Math.sin(Math.PI * x);
var Pin = ({ x, y, k = 1, rot = 0, o = 1, children }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", left: x, top: y, width: 0, height: 0, opacity: o, transform: `rotate(${rot}deg) scale(${k})`, willChange: "transform" }, children });
var CX = 1020;
var CY = 540;
var SHEETS = [
  { who: "cedric", n: 15, w: 344, h: 320, rot: -3.5, dx: -5, dy: 4 },
  { who: "karl", n: 21, w: 366, h: 342, rot: 3, dx: 5, dy: -4 },
  { who: "tom", n: 26, w: 384, h: 358, rot: -0.6, dx: 0, dy: 0 },
  { who: "robin", n: 30, w: 400, h: 372, rot: 2.2, dx: 3, dy: -2 }
];
var WIN = { cx: 1120, cy: 530, s0: 0.39 };
var grow = (n) => {
  const x = Math.max(0, n - 36.3);
  return 1 - 0.4 * (1 + 0.966 * x) * Math.exp(-0.966 * x) - 0.6 * Math.exp(-0.409 * x);
};
var bez = (u, p) => {
  const v = 1 - u;
  return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]);
};
var UP = [[690, 360], [790, 360], [790, 200], [900, 200]];
var DOWN = [[690, 360], [790, 360], [790, 520], [900, 520]];
var PULSES = [44, 50, 56, 62];
var Flow = ({ t }) => {
  const n = t * 24;
  const d1 = E(t, T(35.5), T(2.5)), d2 = E(t, T(38), T(3.5));
  const kIn = pop(t, 35), kUp = pop(t, 41), kDown = pop(t, 43);
  const hit = (at12) => PULSES.reduce((a, s) => a + bump((n - s - at12) / 2.6), 0);
  const line = (d, p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d, fill: "none", stroke: C.cyan, strokeWidth: "6", pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - p });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(0, 0, 1300, 720, { background: "#F7F9FB", backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { style: abs(0, 0), width: "1300", height: "720", children: [
      d1 > 0 && line("M270 360 H520", d1),
      d2 > 0 && line("M690 360 C790 360 790 200 900 200", d2),
      d2 > 0 && line("M690 360 C790 360 790 520 900 520", d2),
      PULSES.map((s) => {
        const a = (n - s) / 5, b = (n - s - 5.5) / 5;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("g", { fill: C.ink, children: [
          a > 0 && a < 1 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: mix(270, 520, a), cy: 360, r: 8 }),
          b > 0 && b < 1 && [UP, DOWN].map((p, i) => {
            const [x, y] = bez(ease.inOut(b), p);
            return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: x, cy: y, r: 8 }, i);
          })
        ] }, s);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: 190, y: 360, k: kIn * (1 + 0.05 * hit(0)), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tool, { n: "pipedrive", x: -80, y: -80, s: 160, navy: true }) }),
    PULSES.map((s) => {
      const r = (n - s - 5) / 4;
      return r > 0 && r < 1 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(520, 275, 170, 170, { borderRadius: 38, border: `5px solid ${C.cyan}`, opacity: 0.7 * (1 - r), transform: `scale(${1 + 0.4 * ease.out(r)})` }) }, s) : null;
    }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: 605, y: 360, k: 1 + 0.05 * hit(5), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(-85, -85, 170, 170, { borderRadius: 38, background: C.white, border: `5px solid ${C.cyan}`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_remotion3.Img, { src: (0, import_remotion3.staticFile)("logo/kb-logo-tile.svg"), style: { width: 96, height: 96, borderRadius: 14 } }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: 980, y: 200, k: kUp * (1 + 0.06 * hit(10.5)), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tool, { n: "n8n-logo2", x: -80, y: -80, s: 160 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: 980, y: 520, k: kDown * (1 + 0.06 * hit(10.5)), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tool, { n: "odoo-1", x: -80, y: -80, s: 160, navy: true }) })
  ] });
};
var A = ({ t }) => {
  const n = t * 24;
  const open = S(t, T(15), snap);
  const half = 172 + 11 * S(t, T(21), snap) + 9 * S(t, T(26), snap) + 8 * S(t, T(30), snap) + 54 * S(t, T(34), snap) + 6 * clamp((n - 15) / 19);
  const push2 = open * (half + 30);
  const go1 = E(t, T(35.6), 0.12, ease.out), go2 = E(t, T(37.6), 0.12, ease.out);
  const in1 = E(t, 0, 0.22, ease.out), in2 = E(t, T(5), 0.11, ease.out), in3 = E(t, T(8), 0.16, ease.out);
  const oL = 1 - 0.55 * clamp((t - T(35.5)) / 0.05) - 0.45 * clamp((t - T(37.5)) / 0.085), oR = 1 - clamp((t - T(37.8)) / 0.1);
  const word = (x, y, o) => ({ display: "inline-block", transform: `translate3d(${x}px, ${y}px, 0)`, opacity: o, willChange: "transform" });
  const g = grow(n), land = S(t, T(34), snap);
  const sw = mix(WIN.s0 * mix(0.6, 1, land), 1, g);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Ground, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Tx, { x: 720, y: 506, s: 66, w: 600, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: word(100 * (1 - in2) - push2 - 60 * go1 - 40 * go2, 10 * (1 - in1), oL), children: "The" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: word(40 * (1 - in2) - push2 - 60 * go1 - 40 * go2, 0, clamp((t - T(5) - 0.012) / 0.04) * oL), children: "right" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: word(-8 * (1 - in3) + push2 + 110 * go1 + 70 * go2, 10 * (1 - in3) + 24 * go2, clamp((t - T(8)) / 0.04) * oR), children: "team" })
    ] }),
    n < 41 && SHEETS.map((s, i) => {
      const t0 = T(s.n), dt = t - t0;
      if (dt < 0) return null;
      const k = i === 0 ? mix(0.25, 1, open) : mix(1.08, 1, S(t, t0, snap));
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: CX + s.dx, y: CY + s.dy, k: k * (1 + 0.03 * dt), rot: s.rot + (i % 2 ? 0.7 : -0.7) * dt, o: clamp(dt / 0.05), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Port, { who: s.who, x: -s.w / 2, y: -s.h / 2, w: s.w, h: s.h }) }, s.who);
    }),
    t + EPS >= T(34) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: clamp((t - T(34)) / 0.04), transform: `translate3d(${mix(CX, WIN.cx, g)}px, ${mix(CY, WIN.cy, g)}px, 0) rotate(${-2 * (1 - g)}deg) scale(${sw})`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Win, { x: -650, y: -380, w: 1300, h: 760, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Flow, { t }) }) })
  ] });
};
var MONO = "ui-monospace, Menlo, monospace";
var B2 = ({ t }) => {
  const n = t * 24;
  const k = 1 + 0.024 * Math.exp(-(n - 64) / 2.1);
  const p = S(t, T(65.4), { damping: 18, stiffness: 300, mass: 0.6 });
  const glow = 0.35 + 0.3 * bump((n - 68) / 5);
  const visitors = Math.round(mix(27, 38, E(t, T(64), 0.36, ease.out)));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Ground, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Pin, { x: 800, y: 530, k, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Win, { x: -650, y: -380, w: 1300, h: 760, dark: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: abs(60, 40, 620), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: MONO }, children: "RANKING" }),
      Array.from({ length: 7 }, (_, i) => {
        const me = i === 1, dy = i === 1 ? 98 * (1 - p) : i === 2 ? -98 * (1 - p) : 0;
        const place = i === 1 ? p < 0.5 ? 3 : 2 : i === 2 ? p < 0.5 ? 2 : 3 : i + 1;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative", zIndex: me ? 2 : 1, marginTop: 14, height: 84, borderRadius: 12, background: me ? "#F4F7FA" : "#1B2636", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", boxShadow: me ? `0 14px 40px rgba(56,200,255,${glow})` : "none", transform: `translate3d(0, ${dy}px, 0)`, willChange: "transform" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 34, fontWeight: 500, color: me ? C.ink : "#C5CEDB", width: 34, fontFamily: MONO }, children: place }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 34, height: 34, borderRadius: 8, background: me ? C.cyan : ["#4F7BFF", "#22C7A0", "#FFB547", "#7C6CFF", "#FF7A66", "#8FA0B6", "#4F7BFF"][i] } }),
          me ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 30, fontWeight: 700, color: C.ink }, children: "Your business" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 260 - i % 3 * 50, height: 14, borderRadius: 7, background: "#33425A" } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginLeft: "auto", fontSize: 24, fontWeight: 600, color: me ? C.green : "#5E6E86", fontFamily: MONO }, children: me ? p < 0.5 ? "\u25B2 4" : "\u25B2 5" : "\u2014" })
        ] }, i);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: abs(740, 60, 500, 600, { borderRadius: 20, background: "#1B2636" }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tx, { x: 36, y: 32, s: 22, w: 600, c: "#9FB0C6", children: "Visitors" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Tx, { x: 36, y: 66, s: 76, w: 700, c: "#fff", children: [
        "+",
        visitors,
        "%"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(36, 220, 428, 340, { display: "flex", alignItems: "flex-end", gap: 428 / 12 * 0.28 }), children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1, height: `${30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + i / 12 * 0.45)}%`, background: i === 9 ? C.cyan : C.indigo, borderRadius: "5px 5px 0 0", transformOrigin: "50% 100%", transform: `scaleY(${mix(0.4, 1, S(t, T(64) + i * 0.024, fast))})` } }, i)) })
    ] })
  ] }) }) });
};
var B3 = ({ t }) => {
  const n = t * 24;
  const s85 = E(t, T(85) - 0.02, 0.13, ease.out), s87 = E(t, T(87) - 0.02, 0.12, ease.out), s90 = E(t, T(90) - 0.02, 0.12, ease.out);
  const s = (1 + 0.03 * Math.exp(-(n - 75) / 1.44) - 0.012 * clamp((n - 79) / 6)) * mix(1, 0.83, s85) * mix(1, 0.902, s87) * mix(1, 0.874, s90);
  const top = mix(mix(540 - 430 * s, 261, s87), 286, s90);
  const fold = E(t, T(86.7), 0.09);
  const tap = bump((n - 80.5) / 3);
  const say4 = S(t, T(90.6), fast);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Ground, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "absolute", left: 960, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: `translate3d(0, ${top}px, 0) scale(${s})`, willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(-225, 0, 450, 860, { filter: "drop-shadow(0 30px 70px rgba(41,58,81,.16)) drop-shadow(0 4px 14px rgba(41,58,81,.08))" }), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: abs(0, 0, 450, 860, { background: C.white, clipPath: `inset(0px 0px ${350 * fold}px 0px round ${mix(44, 9.3, fold)}px)` }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: abs(0, 0, 450, 470, { background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tx, { x: 36, y: 40, s: 24, w: 600, c: "#fff", children: "Good morning" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tx, { x: 36, y: 330, s: 60, w: 700, c: "#fff", children: "Book a table" })
        ] }),
        [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(30 + i * 134, 500, 122, 150, { borderRadius: 20, background: ["#EEF3FF", "#E6F7FF", "#E9F8F1"][i], transform: `scale(${pop(t, 75.4 + i * 1.1)})` }) }, i)),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: abs(30, 690, 390, 110, { borderRadius: 28, background: C.ink, color: "#fff", fontSize: 32, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.045 * tap})`, boxShadow: `0 0 0 ${10 * tap}px rgba(56,200,255,${0.35 * tap})` }), children: "Confirm booking" }),
        fold > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_remotion3.Img, { src: (0, import_remotion3.staticFile)("team/youri.jpg"), style: abs(0, 0, 450, 510, { objectFit: "cover", objectPosition: "50% 22%", opacity: fold }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: abs(-225, 526, 450, void 0, { fontSize: 23.2, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 10.8, whiteSpace: "nowrap", opacity: E(t, T(90), 0.07) }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { width: 10.8, height: 10.8, borderRadius: 6, background: C.cyan } }),
        ROLE.youri
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tx, { x: 636, y: 380, s: 132, w: 600, style: { lineHeight: 1.02, opacity: clamp((t - T(90.6)) / 0.05), transform: `translate3d(0, ${16 * (1 - say4)}px, 0)`, willChange: "transform" }, children: "For" })
  ] });
};
var Comp = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_remotion3.AbsoluteFill, { style: { background: C.paper } });
  if (t + EPS >= T(75)) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(B3, { t });
  if (t + EPS >= T(64)) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(B2, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(A, { t });
};
var PKG = {
  id: "R01",
  Comp,
  sfx: [
    { t: T(15), kind: "pop", note: "the portrait card opens between the words" },
    { t: T(21), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(26), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(30), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(36.3), kind: "rise", note: "the card grows into the first screen", ref: 37 },
    { t: T(64), kind: "tick", note: "cut to the ranking window" },
    { t: T(75), kind: "tick", note: "cut to the product card" },
    { t: T(85), kind: "swish", note: "the product card shrinks into the portrait" }
  ]
};

// src/shots/R02.tsx
var import_remotion4 = __toESM(require_remotion_shim());
var import_jsx_runtime4 = require("react/jsx-runtime");
var F0 = 93;
var at = (n) => rs(n - F0);
var say = (filmSeconds) => filmSeconds - rs(F0);
var CUT = at(130);
var SPOT = { robin: [150, 170, 210, 230], tom: [1010, 770, 190, 210], youri: [1395, 120, 235, 260], karl: [1560, 560, 200, 220], cedric: [330, 700, 190, 210] };
var ORDER = ["robin", "youri", "karl", "cedric", "tom"];
var POP = (who) => at(93) + 0.02 + ORDER.indexOf(who) * 0.165;
var ROW = (i) => [445 + i * 210, 445, 190, 190];
var WORDS = [["For", 0, say(3.78)], ["what", 0, say(4.06)], ["comes", 1, say(4.26)], ["next", 1, say(4.52)]];
var Comp2 = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_remotion4.AbsoluteFill, { style: { background: C.paper } });
  const row = E(t, CUT - 0.02, 0.34, ease.out);
  const close = E(t, at(141), 0.26, ease.inOut);
  const tile = S(t, at(144), { damping: 13, stiffness: 200 });
  const lines = E(t, at(173), 0.3, ease.out);
  const out = E(t, at(180), 0.33, ease.in);
  const drift = 1 + 0.012 * clamp(t / CUT);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Ground, { children: [
    t < CUT && [0, 1].map((ln) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: abs(0, 380 + ln * 140, 1920, 150, { display: "flex", justifyContent: "center", gap: 34, fontSize: 132, fontWeight: 600, letterSpacing: -4, lineHeight: 1.08, transform: `translate3d(${ln === 0 ? 40 : -46}px, 0, 0)` }), children: WORDS.filter((w) => w[1] === ln).map(([w, , t0], i, arr) => {
      const p = S(t, t0 - 0.04, { damping: 12, stiffness: 210 }), nextIn = i + 1 < arr.length ? S(t, arr[i + 1][2] - 0.04, { damping: 14 }) : 0;
      const give = ln === 0 ? S(t, WORDS[2][2] - 0.04, { damping: 14 }) : 0;
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { display: "inline-block", opacity: clamp(p * 3), transform: `translate3d(${(-10 * nextIn).toFixed(2)}px, ${((1 - p) * 34 - 6 * give).toFixed(2)}px, 0) rotate(${((1 - p) * -2).toFixed(2)}deg)`, willChange: "transform" }, children: w }, w);
    }) }, ln)),
    TEAM.map((who, i) => {
      const [x0, y0, w0, h0] = SPOT[who], [x1, y1, w1, h1] = ROW(i);
      const pop2 = S(t, POP(who), { damping: 11, stiffness: 190 });
      const cx = mix(mix(x0 + w0 / 2, x1 + w1 / 2, row), 960, close), cy = mix(mix(y0 + h0 / 2, y1 + h1 / 2, row), 540, close);
      const w = mix(w0, w1, row), h = mix(h0, h1, row), sc = mix(0.55, 1, pop2) * mix(1, 200 / 190, close) * (t < CUT ? drift : 1);
      if (pop2 <= 1e-3 || tile >= 0.999) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, transform: `translate3d(${(cx - w / 2).toFixed(2)}px, ${(cy - h / 2).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`, opacity: clamp(pop2 * 3) * (1 - clamp(tile * 1.6)), zIndex: 5 - i, willChange: "transform" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { width: w, height: h, borderRadius: mix(6, 15, close), overflow: "hidden", boxShadow: "0 14px 34px rgba(41,58,81,.18)" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_remotion4.Img, { src: (0, import_remotion4.staticFile)(`team/${who}.jpg`), style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginTop: 10, fontSize: 15, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", opacity: clamp((pop2 - 0.6) * 3) * (1 - clamp(row * 4)) }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { width: 7, height: 7, borderRadius: 4, background: C.cyan } }),
          ROLE[who]
        ] })
      ] }, who);
    }),
    t >= at(144) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: abs(700, 0, 1, 1080, { background: C.line, transformOrigin: "50% 0", transform: `scaleY(${lines.toFixed(4)})`, opacity: 1 - out }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: abs(0, 730, 1920, 1, { background: C.line, transformOrigin: "0 50%", transform: `scaleX(${E(t, at(175), 0.3, ease.out).toFixed(4)})`, opacity: 1 - out }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.8, 1, tile) * (1 + 0.5 * out)).toFixed(4)})`, opacity: clamp(tile * 2.4) * (1 - 0.85 * out), filter: out > 0.01 ? `blur(${(out * 10).toFixed(2)}px)` : void 0, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Tile, { x: 960, y: 540, s: 200 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_remotion4.AbsoluteFill, { style: { background: "#FBFBFA", opacity: 0.5 * out } })
    ] })
  ] });
};
var sfx = [
  { t: POP("robin"), kind: "pop", note: "first portrait" },
  { t: POP("karl"), kind: "pop", note: "third portrait" },
  { t: POP("tom"), kind: "pop", note: "fifth portrait" },
  { t: CUT, kind: "slide", note: "the portraits travel into a row" },
  { t: at(145), kind: "thud", note: "the row becomes the K.B tile" },
  { t: at(180), kind: "swish", note: "the logo softens into the paper" }
];
var PKG2 = { id: "R02", Comp: Comp2, sfx };

// src/shots/R03.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var F02 = 188;
var at2 = (n) => rs(n - F02);
var EPS2 = 1e-6;
var reached = (t, n) => t + EPS2 >= at2(n);
var frameNo = (t) => Math.floor(t * 60 + 0.25);
var count = (keys, t) => {
  let k = 0;
  while (k < keys.length && reached(t, keys[k])) k++;
  return k;
};
var INK = "#1F2A3A";
var FLASH = [["F1", 188, 23.976], ["F2", 192, 23.976], ["F3", 196, 25], ["F4", 200, 25]];
var Flash = ({ t }) => {
  let i = 0;
  while (i < FLASH.length - 1 && reached(t, FLASH[i + 1][1])) i++;
  const [name, f2, fps] = FLASH[i];
  const j = Math.floor(Math.max(0, frameNo(t) - frameNo(at2(f2))) / 2);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Footage, { name, at: (Math.round(0.3 * fps) + j + 0.5) / fps, scale: 1.03 + 5e-3 * j });
};
var G_PAN = 1;
var G_TEXT = "Can you help";
var G_KEYS = [219, 220, 222, 224, 225, 230, 232, 233, 234, 237, 239, 241];
var G_EM = 96;
var G_LS = -0.03 * G_EM;
var G_GAP = G_EM / 6;
var G_CW = G_EM / 24;
var G_CH = 1.29 * G_EM;
var G_TOP = 538 - 0.54 * G_EM;
var G_W = 6.544 * G_EM + G_TEXT.length * G_LS;
var G_C = 0.709 * G_EM + G_LS;
var G_X_END = (1920 - (G_W + G_GAP + G_CW)) / 2;
var G_X_CARET = 960 - G_GAP - G_CW / 2;
var G_K = 2.95;
var G_V0 = 60;
var G_FA = frameNo(at2(222));
var G_FB = frameNo(at2(243));
var G_D = Math.round(G_X_CARET - Math.round(G_C) - G_X_END);
var stairs = (v1) => {
  const acc = [0], n = G_FB - G_FA;
  for (let i = 1; i <= n; i++) {
    const g = (Math.exp(G_K * (i - 0.5) / n) - 1) / (Math.exp(G_K) - 1);
    acc.push(acc[i - 1] + Math.max(1, Math.round((G_V0 + (v1 - G_V0) * g) / 60)));
  }
  return acc;
};
var G_STAIRS = (() => {
  let v1 = 600, st = stairs(v1);
  while (st[st.length - 1] < G_D && v1 < 6e3) {
    v1 += 2;
    st = stairs(v1);
  }
  return st;
})();
var TypedLine = ({ t }) => {
  const n = count(G_KEYS, t);
  const k = Math.min(G_STAIRS.length - 1, Math.max(0, frameNo(t) - G_FA));
  const x = Math.round(G_PAN ? n === 0 ? G_X_CARET : G_X_CARET - Math.round(G_C) - G_STAIRS[k] : G_X_END);
  const caretOn = n > 0 || !(reached(t, 212) && !reached(t, 217));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Ground, { tone: "vig", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { position: "absolute", left: 0, top: G_TOP, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: G_EM, fontWeight: 400, letterSpacing: G_LS, lineHeight: 1.08, whiteSpace: "pre", color: INK }, children: [
    G_TEXT.slice(0, n),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { position: "absolute", left: "100%", top: -G_EM / 8, marginLeft: G_GAP, width: G_CW, height: G_CH, background: INK, opacity: caretOn ? 1 : 0 } })
  ] }) });
};
var M1 = { word: "autom", keys: [245, 247, 248, 250, 251], em: 575, base: 783, xEnd: -15, lone: 185, caretFrom: 244, to: 254 };
var M2 = { word: "follo", keys: [256, 257, 258, 260, 262], em: 860, base: 883, xEnd: -40, lone: 95, caretFrom: 254, to: 265 };
var Macro = ({ t, m }) => {
  const n = count(m.keys, t);
  const drift = 2 * Math.max(0, frameNo(at2(m.to)) - frameNo(t));
  const gap = 0.08 * m.em;
  const x = (n === 0 ? m.lone - gap : m.xEnd) + drift;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Ground, { tone: "vig", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { position: "absolute", left: 0, top: m.base - 0.8985 * m.em, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: m.em, fontWeight: 400, letterSpacing: -0.0395 * m.em, lineHeight: 1.08, whiteSpace: "pre", color: INK }, children: [
      m.word.slice(0, n),
      reached(t, m.caretFrom) && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { position: "absolute", left: "100%", top: 0.0235 * m.em, marginLeft: gap, width: 0.028 * m.em, height: 0.93 * m.em, background: INK } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Fringe, {})
  ] });
};
var Comp3 = ({ t }) => {
  useFonts();
  if (!reached(t, 205)) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Flash, { t });
  if (!reached(t, 243)) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TypedLine, { t });
  if (!reached(t, 254)) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Macro, { t, m: M1 });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Macro, { t, m: M2 });
};
var PKG3 = {
  id: "R03",
  Comp: Comp3,
  sfx: [
    { t: at2(188), kind: "tick", ref: 188, note: "flash cut F1" },
    { t: at2(192), kind: "tick", ref: 192, note: "flash cut F2" },
    { t: at2(196), kind: "tick", ref: 196, note: "flash cut F3" },
    { t: at2(200), kind: "tick", ref: 200, note: "flash cut F4" },
    { t: at2(219), kind: "type", ref: 219, note: "0.92" },
    { t: at2(245), kind: "type", ref: 245, note: "0.25" },
    { t: at2(256), kind: "type", ref: 256, note: "0.25" }
  ]
};

// src/shots/R04.tsx
var import_remotion5 = __toESM(require_remotion_shim());
var import_jsx_runtime6 = require("react/jsx-runtime");
var F03 = 265;
var at3 = (n) => rs(n - F03);
var TEXT = "Can you help us automate our follow-ups and keep the CRM up to date?";
var CPS = 15;
var T0 = -(TEXT.length - 12) / CPS;
var SEND = { x: 1457, y: 552 };
var CLICK = at3(288) - 0.11;
var HAND = [{ at: -1, x: 1760, y: 1240 }, { at: CLICK, x: SEND.x, y: SEND.y, click: true, early: 0.22 }];
var I = ({ t }) => {
  const press = pressAt(t, CLICK), ring = clamp((t - CLICK - 0.11) / 0.5);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Ground, { tone: "ui", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 500px", transform: `scale(${(1 + 0.012 * t - 6e-3 * press).toFixed(4)})`, willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Msg, { x: 405, y: 400, w: 1110, text: typed(TEXT, t, T0, CPS) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(SEND.x - 22, SEND.y - 22, 44, 44, { borderRadius: 11, background: "#fff", opacity: 0.55 * press }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(SEND.x - 60, SEND.y - 60, 120, 120, { borderRadius: 60, border: `4px solid ${C.cyan}`, boxSizing: "border-box", opacity: ring > 0 && ring < 1 ? 0.8 * (1 - ring) : 0, transform: `scale(${(0.4 + 0.9 * ease.out(ring)).toFixed(4)})` }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(HandAt, { t, keys: HAND, size: 210 })
  ] });
};
var TOOLS = [
  ["pipedrive", 170, 150, 190, true, -6, -700, -300],
  ["n8n-logo2", 390, 520, 170, false, 5, -800, 100],
  ["makecom-removebg-preview", 150, 770, 200, false, -4, -600, 500],
  ["odoo-1", 1420, 170, 200, true, 6, 700, -300],
  ["resend", 1560, 540, 170, true, -5, 800, 100],
  ["supabase", 1330, 800, 180, false, 4, 600, 500]
];
var DOTS = [[330, 110], [640, 330], [1250, 420], [1700, 420], [620, 900], [1240, 760]];
var ROWS_AT = [at3(342), at3(354), at3(366), at3(376)];
var JKL = ({ t }) => {
  const n = t * 24 + F03;
  const kIn = at3(312), lIn = at3(336), outline = E(t, at3(378), 0.28, ease.in);
  const card = S(t, kIn + 0.06, { damping: 15, stiffness: 150 }), small = E(t, lIn - 0.04, 0.3, ease.out);
  const done = ROWS_AT.filter((r) => t >= r).length, bump2 = ROWS_AT.reduce((s, r) => s + Math.max(0, Math.sin(Math.PI * clamp((t - r) / 0.3))), 0);
  const first = S(t, at3(307), { damping: 11, stiffness: 220 });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Ground, { tone: "ui", children: [
    n < 301 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(810, 390), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Glyph, { k: 0, s: 300 }) }),
    n >= 301 && n < 307 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(810, 390), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Glyph, { k: 3, s: 300 }) }),
    n >= 307 && n < 312 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { position: "absolute", left: 0, top: 0, transformOrigin: "960px 540px", transform: `scale(${mix(0.5, 1, first).toFixed(4)})`, width: 1920, height: 1080 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Tool, { n: "pipedrive", x: 875, y: 455, s: 170, navy: true }) }),
    t >= kIn && TOOLS.map(([name, x, y, s, navy, rot, dx, dy], i) => {
      const p = S(t, kIn + i * 0.045, { damping: 15, stiffness: 140 }), away = E(t, lIn - 0.06, 0.22, ease.in);
      const ox = dx * (1 - p) + dx * 0.9 * away, oy = dy * (1 - p) + dy * 0.9 * away;
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, transform: `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`, opacity: clamp(p * 2.5) * (1 - away), willChange: "transform" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { position: "absolute", left: dx * 0.06, top: dy * 0.06, opacity: 0.22, filter: "blur(14px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Tool, { n: name, x, y, s: s * 1.25, navy, rot }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Tool, { n: name, x, y, s, navy, rot })
      ] }, name);
    }),
    t >= kIn && DOTS.map(([x, y], i) => {
      const p = S(t, at3(326) + i * 0.045, { damping: 9, stiffness: 260 });
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(x, y, 30, 30, { borderRadius: 15, background: C.cyan, transform: `scale(${p.toFixed(4)})`, opacity: 1 - E(t, lIn - 0.06, 0.2, ease.in) }) }, i);
    }),
    t >= kIn && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.72, 1, card) * mix(1, 0.9, small) * (1 + 0.012 * bump2) * (1 + 0.55 * outline)).toFixed(4)})`, opacity: clamp(card * 2.2), willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { opacity: 1 - 0.85 * outline }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FlowCard, { x: 750, y: 150, done }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: abs(750, 150, 420, 780, { borderRadius: 34, border: `3px solid ${C.ink}`, boxSizing: "border-box", opacity: 0.5 * outline }) })
    ] })
  ] });
};
var Comp4 = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_remotion5.AbsoluteFill, { style: { background: C.ui } });
  return t < at3(295) ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(I, { t }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(JKL, { t });
};
var sfx2 = [
  { t: 0, kind: "type", note: "0.8 the end of the message" },
  { t: CLICK + 0.11, kind: "click", note: "send" },
  { t: at3(295), kind: "tick", note: "glyph" },
  { t: at3(301), kind: "tick", note: "glyph" },
  { t: at3(307), kind: "pop", note: "the first tool" },
  { t: at3(312), kind: "swish", note: "the tools fly in" },
  { t: ROWS_AT[0], kind: "pop", note: "row 1 done" },
  { t: ROWS_AT[1], kind: "pop", note: "row 2 done" },
  { t: ROWS_AT[2], kind: "pop", note: "row 3 done" },
  { t: ROWS_AT[3], kind: "success", note: "the flow runs by itself" }
];
var PKG4 = { id: "R04", Comp: Comp4, sfx: sfx2 };

// src/shots/R05.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var F04 = 385;
var at4 = (n) => (n - F04) / 24;
var refAt = (t) => F04 + t * 24 + 1e-4;
var CY2 = -1;
var NO = -2;
var LOOKS = [
  { top: C.ink, av: C.cyan },
  { top: "#EEF3FF", av: C.indigo },
  { top: "#E9F8F1", av: C.mint },
  { top: "#F1EEFF", av: C.violet },
  { top: "#FFF4E0", av: C.amber },
  { top: "#FFECE8", av: C.coral },
  { top: C.dark2, av: C.mint },
  { top: C.ink, av: C.amber }
];
var BARS = [[300, 220, 260, 180], [260, 300, 190, 240], [320, 200, 240, 150], [280, 240, 300, 200]];
var PILL = [180, 150, 210, 180];
var Card = ({ k }) => {
  if (k === NO) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { flex: 1 } });
  if (k === CY2) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { flex: 1, borderRadius: 20, background: C.cyan, boxShadow: SH } });
  const look = LOOKS[Math.floor(k / 10)], b = k % 10;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { flex: 1, borderRadius: 20, background: C.white, boxShadow: SH, position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: abs(0, 0, 400, 300, { background: look.top }), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: abs(40, 60, 150, 150, { borderRadius: 75, background: look.av }) }) }),
    BARS[b].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Bar, { x: 36, y: 350 + i * 70, w, h: 22, c: i === 0 ? C.ink : "#D5D9DF" }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: abs(36, 690, PILL[b], 70, { borderRadius: 35, background: C.green }) })
  ] });
};
var Row = ({ y, cards }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: abs(-60, y, 2040, 820, { display: "flex", gap: 22 }), children: cards.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Card, { k }, i)) });
var GRID = [
  { f: 385, mid: [NO, CY2, 20, CY2, NO] },
  { f: 387, mid: [CY2, 10, 20, 0, CY2] },
  // the storyboard frame
  { f: 390, mid: [CY2, 41, 20, 32, CY2] },
  { f: 393, top: [52, 1, 33, 13, 40], mid: [31, 53, 20, 72, 12], bot: [CY2, 43, 61, 22, CY2] },
  { f: 396, top: [13, 42, 0, 51, 23], mid: [62, 11, 20, 43, 1], bot: [CY2, 70, 32, 13, CY2] },
  { f: 399, top: [21, 63, 50, 32, 71], mid: [40, 2, 20, 51, 33], bot: [3, 52, 11, 60, 42] },
  { f: 402, top: [72, 30, 12, 3, 53], mid: [13, 71, 20, 30, 62], bot: [31, 23, 40, 72, 1] },
  { f: 405, top: [43, 51, 62, 20, 10], mid: [2, 33, 51, 12, 40], bot: [60, 11, 3, 43, 22] },
  { f: 408, top: [30, 2, 73, 41, 61], mid: [52, 21, 3, 63, 10], bot: [12, 40, 31, 53, 70] },
  { f: 411, top: [61, 22, 43, 10, 32], mid: [71, 42, 30, 11, 53], bot: [23, 0, 52, 33, 11] },
  { f: 414, mid: [33, 52, 61, 41, 13] },
  { f: 417, mid: [NO, 10, 20, 0, NO] }
  // the three placeholders of f385, filled
];
var ShotM = ({ n }) => {
  let g = GRID[0];
  for (const s of GRID) if (n >= s.f) g = s;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Ground, { children: [
    g.top && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Row, { y: 130 - 842, cards: g.top }),
    g.bot && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Row, { y: 130 + 842, cards: g.bot }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Row, { y: 130, cards: g.mid })
  ] });
};
var CROPS = [{ f: 420, txt: "f", dx: -600 }, { f: 423, txt: "fo", dx: -110 }, { f: 426, txt: "ou", dx: 0 }, { f: 429, txt: "un", dx: 0 }, { f: 431, txt: "nd", dx: 0 }];
var ShotN = ({ n }) => {
  let c = CROPS[0];
  for (const s of CROPS) if (n >= s.f) c = s;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Ground, { tone: "vig", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tx, { x: -110, y: -140, s: 1500, w: 500, c: "#111A27", style: { letterSpacing: -60, transform: `translate3d(${c.dx}px, 0, 0)` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { visibility: "hidden" }, children: "ou" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { position: "absolute", right: 0, top: 0 }, children: c.txt })
  ] }) });
};
var HEAD = "We want to be found by the right customers, in search and";
var PAD = 10;
var ShotO = ({ t }) => {
  const a = typed(" in AI", t, at4(433), 12), b = typed(" answers.", t, at4(447), 12);
  const text = HEAD + a + (b.length > 1 ? "\xA0".repeat(PAD) : "") + b;
  const dx = 10 * E(t, at4(469.5), 5 / 24, ease.inOut);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Ground, { tone: "ui", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${dx.toFixed(2)}px, 0, 0)`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Msg, { x: 405, y: 400, w: 1110, text }) }) });
};
var Comp5 = ({ t }) => {
  const ok = useFonts();
  const n = refAt(t);
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Ground, { tone: n >= 434 ? "ui" : n >= 420 ? "vig" : "paper" });
  if (n >= 434) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ShotO, { t });
  if (n >= 420) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ShotN, { n });
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ShotM, { n });
};
var sfx3 = [
  // M: one tick on every flash cut (f390 is the change inside the second shot)
  ...[385, 387, 390, 393, 396, 399, 402, 405, 408, 411, 414, 417].map((f2) => ({ t: at4(f2), kind: "tick", note: "flash cut", ref: f2 })),
  // N: one key on each cut, as the letter appears
  ...[420, 423, 426, 429, 431].map((f2, i) => ({ t: at4(f2), kind: "type", note: i === 3 ? "0.08" : "0.12", ref: f2 })),
  // O: the sentence is typed on in two runs
  { t: at4(435), kind: "type", note: "0.46", ref: 435 },
  { t: at4(449), kind: "type", note: "0.70", ref: 449 }
];
var PKG5 = { id: "R05", Comp: Comp5, sfx: sfx3 };

// src/shots/R06.tsx
var import_remotion6 = __toESM(require_remotion_shim());
var import_jsx_runtime8 = require("react/jsx-runtime");
var F05 = 475;
var at5 = (n) => (n - F05) / 24;
var refAt2 = (t) => F05 + t * 24 + 1e-4;
var RAMP = at5(481);
var V0 = 216;
var V1 = 480;
var slid = (s) => s <= RAMP ? V0 * s + (V1 - V0) * s * s / (2 * RAMP) : V0 * RAMP + (V1 - V0) * RAMP / 2 + V1 * (s - RAMP);
var ShotP = ({ t, n }) => {
  const dx = slid(RAMP) - slid(t);
  const label = { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: C.ink };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Ground, { tone: "dark", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(0, 300, 1920, 6, { background: "#1E2A3C" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(0, 800, 1920, 6, { background: "#1E2A3C" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${dx.toFixed(2)}px, 0, 0)`, willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(-140, 620, 420, 420, { borderRadius: 210, background: C.violet }) }),
      n >= 478 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(560, 210, 620, 620, { ...label, borderRadius: 310, background: C.cyan, fontSize: 200 }), children: "?" }),
      n >= 481 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(1330, -160, 600, 600, { ...label, borderRadius: 300, background: C.mint, fontSize: 150, paddingTop: 120 }), children: "AI" })
    ] })
  ] });
};
var LINES = ["Technical SEO", "Page structure", "Metadata", "Internal links", "Structured information"];
var DOTS2 = [[150, 300, 150, C.cyan], [420, 240, 110, C.mint], [640, 360, 130, C.violet], [880, 260, 100, C.amber], [1040, 380, 120, C.coral]];
var beat = (i) => at5(483.5 + 2.5 * i);
var LIT = beat(5);
var Q_END = at5(513);
var DRIFT = 60;
var Face = ({ bg, icon, title, sub, o = 1 }) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 24, background: bg, display: "flex", alignItems: "center", gap: 30, paddingLeft: 40, opacity: o }, children: [
  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { width: 110, height: 110, borderRadius: 26, background: icon } }),
  /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 46, fontWeight: 700, color: title }, children: "Your business" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 26, color: sub, fontWeight: 500, marginTop: 6 }, children: "the first result" })
  ] })
] });
var ShotQ = ({ t }) => {
  const lit = E(t, LIT, 0.14, ease.out), since = Math.max(0, t - LIT);
  const glow = lit * (0.12 + 0.5 * Math.exp(-since / 0.28) + 0.05 * Math.sin(since * 9));
  const cardS = 0.985 + 0.015 * S(t, LIT, { stiffness: 320, damping: 15 });
  const note = E(t, LIT, 0.2, ease.out);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Ground, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Win, { x: 110, y: 90, w: 1700, h: 900, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: abs(0, 0, 470, 860, { background: "#FAFBFC", borderRight: `1px solid ${C.line}`, padding: 30 }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_remotion6.Img, { src: (0, import_remotion6.staticFile)("logo/kb-logo-tile.svg"), style: { width: 34, height: 34, borderRadius: 6 } }),
        "K.B team"
      ] }),
      LINES.map((txt, i) => {
        const p = E(t, beat(i), 0.16, ease.out), tick = S(t, beat(i) + 0.04, { stiffness: 420, damping: 17 });
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 23, fontWeight: 500, opacity: p, transform: `translate3d(0, ${((1 - p) * 14).toFixed(2)}px, 0)` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: { display: "inline-flex", transform: `scale(${tick.toFixed(4)})` }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Check, { s: 28 }) }),
          txt
        ] }, txt);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { marginTop: 34, padding: 22, borderRadius: 16, background: "#EEF3FF", fontSize: 21, lineHeight: 1.4, fontWeight: 500, opacity: note, transform: `translate3d(0, ${((1 - note) * 16).toFixed(2)}px, 0)` }, children: "Your pages now read clearly to search engines, AI tools and people." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: abs(470, 0, 1230, 860, { background: C.dark, overflow: "hidden" }), children: [
      DOTS2.map(([x, y, s, c], i) => {
        const a = beat(i);
        if (t < a) return null;
        const lane = y + s / 2 - DRIFT * (Q_END - t);
        const cy = mix(105, lane, E(t, a, 0.5, ease.out));
        const pop2 = S(t, a, { stiffness: 260, damping: 15 });
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(x, -s / 2, s, s, { borderRadius: 999, background: c, transform: `translate3d(0, ${cy.toFixed(2)}px, 0) scale(${pop2.toFixed(4)})`, willChange: "transform" }) }, i);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(60, 60, 1110, 90, { borderRadius: 45, background: "#1B2636", display: "flex", alignItems: "center", paddingLeft: 40, fontSize: 30, color: "#C5CEDB", fontWeight: 500 }), children: "best near me" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: abs(60, 560, 1110, 240, { borderRadius: 24, transform: `scale(${cardS.toFixed(4)})`, boxShadow: `0 0 90px rgba(56,200,255,${glow.toFixed(3)})` }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Face, { bg: "#1B2636", icon: "#2C3B52", title: "#8494AB", sub: "#5B6A82" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Face, { bg: "#F4F7FA", icon: C.cyan, title: C.ink, sub: C.sub, o: lit })
      ] })
    ] })
  ] }) });
};
var ShotR = ({ t }) => {
  const s = t - at5(513);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Footage, { name: "R", at: 0.75 + s, scale: 1 + 0.02 * s });
};
var MONO2 = "ui-monospace, Menlo, monospace";
var PITCH = 98;
var HOPS = [534.5, 538.25, 542, 545.25, 548.5].map(at5);
var hop = (t, k) => S(t, HOPS[k], { stiffness: 900, damping: 36 });
var RIVALS = [["#4F7BFF", 260], ["#22C7A0", 210], ["#7C6CFF", 260], ["#FF7A66", 210], ["#8FA0B6", 160], ["#4F7BFF", 260], ["#FFB547", 160]];
var rowBox = (y, more) => ({ position: "absolute", left: 0, right: 0, top: 14, height: 84, borderRadius: 12, display: "flex", alignItems: "center", gap: 26, padding: "0 28px", willChange: "transform", transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, ...more });
var ShotS = ({ t }) => {
  const s = t - at5(528);
  const zoom = 1 + 0.02 * s;
  const hops = HOPS.map((_, k) => hop(t, k)), done = hops.filter((h) => h > 0.5).length;
  const lift = E(t, at5(532), 0.14, ease.out) * (1 - E(t, at5(552.5), 0.22, ease.inOut));
  const landed = Math.max(0, t - at5(552));
  const glow = 0.35 + 0.22 * lift + (t >= at5(552) ? 0.3 * Math.exp(-landed / 0.25) : 0);
  const tickAt = done > 0 ? HOPS[done - 1] + 0.045 : -9, tick = t >= tickAt ? Math.exp(-(t - tickAt) / 0.09) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_remotion6.AbsoluteFill, { style: { background: C.dark, fontFamily: F }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: abs(0, 0, 760, 1080, { overflow: "hidden" }), children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Footage, { name: "S", at: 0.55 + s, scale: zoom, x: -420 - 560 * (zoom - 1) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: abs(860, 90, 960), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: MONO2 }, children: "RANKING" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { position: "relative", height: 7 * PITCH }, children: [
        RIVALS.map(([c, w], j) => {
          const passed = j >= 2 ? hops[6 - j] : 0;
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: rowBox((j + passed) * PITCH, { background: "#1B2636", opacity: j === 6 ? 1 - E(t, HOPS[0], 0.24, ease.out) : 1 }), children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 34, fontWeight: 500, color: "#C5CEDB", width: 34, fontFamily: MONO2 }, children: j + 1 + (passed > 0.5 ? 1 : 0) }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { width: 34, height: 34, borderRadius: 8, background: c } }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { width: w, height: 14, borderRadius: 7, background: "#33425A" } }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { marginLeft: "auto", fontSize: 24, fontWeight: 600, color: "#5E6E86", fontFamily: MONO2 }, children: "\u2014" })
          ] }, j);
        }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: rowBox((7 - hops.reduce((a, b) => a + b, 0)) * PITCH, { background: "#F4F7FA", boxShadow: `0 14px 40px rgba(56,200,255,${glow.toFixed(3)})`, transform: `translate3d(0, ${((7 - hops.reduce((a, b) => a + b, 0)) * PITCH).toFixed(2)}px, 0) scale(${(1 + 0.03 * lift).toFixed(4)})` }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 34, fontWeight: 500, color: C.ink, width: 34, fontFamily: MONO2 }, children: 8 - done }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { width: 34, height: 34, borderRadius: 8, background: C.cyan } }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { fontSize: 30, fontWeight: 700, color: C.ink }, children: "Your business" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { marginLeft: "auto", fontSize: 24, fontWeight: 600, color: done > 0 ? C.green : "#8FA0B6", fontFamily: MONO2, transform: `scale(${(1 + 0.2 * tick).toFixed(4)})`, transformOrigin: "100% 50%" }, children: done > 0 ? `\u25B2 ${done}` : "\u2014" })
        ] })
      ] })
    ] })
  ] });
};
var Comp6 = ({ t }) => {
  const ok = useFonts();
  const n = refAt2(t);
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Ground, { tone: n >= 484 && n < 513 ? "paper" : "dark" });
  if (n >= 528) return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ShotS, { t });
  if (n >= 513) return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ShotR, { t });
  if (n >= 484) return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ShotQ, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ShotP, { t, n });
};
var sfx4 = [
  // P: the two circles that appear
  { t: at5(478), kind: "pop", note: "the ? circle appears", ref: 478 },
  { t: at5(481), kind: "pop", note: "the AI circle appears", ref: 481 },
  // Q: a line and a circle on each beat, then the card lights up
  ...[484, 486, 488.5, 491, 493.5].map((f2, i) => ({ t: at5(f2), kind: "pop", note: `checklist line ${i + 1} and a circle`, ref: Math.round(f2), db: -6 })),
  { t: LIT, kind: "sparkle", note: "the Your business card lights up", ref: 496 },
  // S: the row hops up five places and lands
  ...HOPS.map((h, i) => ({ t: h, kind: "slide", note: `the row takes place ${7 - i}`, ref: Math.round(F05 + h * 24), db: -4 })),
  { t: at5(552), kind: "pop", note: "it lands third, \u25B2 5", ref: 552 }
];
var PKG6 = { id: "R06", Comp: Comp6, sfx: sfx4 };

// src/shots/R07.tsx
var import_remotion7 = __toESM(require_remotion_shim());
var import_jsx_runtime9 = require("react/jsx-runtime");
var F06 = 557;
var at6 = (n) => (n - F06) / 24;
var from = (t, n) => t >= at6(n) - 1e-6;
var PEN = "#5B6470";
var DRAW = [
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "18", y: "14", width: "60", height: "68", rx: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M26 30h44M26 44h30M26 58h38" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "29", y: "10", width: "38", height: "76", rx: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "35", y: "19", width: "26", height: "20", rx: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M35 47h26M35 55h17" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "35", y: "63", width: "11", height: "13", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "50", y: "63", width: "11", height: "13", rx: "2" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "12", y: "16", width: "32", height: "24", rx: "5" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "52", y: "56", width: "32", height: "24", rx: "5" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M44 28h14q10 0 10 10v16M61 47l7 8 7-8" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M14 80h68" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "20", y: "52", width: "11", height: "28", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "36", y: "38", width: "11", height: "42", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "52", y: "46", width: "11", height: "34", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "68", y: "22", width: "11", height: "58", rx: "2" })
  ] })
];
var Sheet = ({ k, s, shadow }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { width: s, height: s, borderRadius: s / 8, background: "#F4F1EA", boxShadow: shadow ? "0 12px 28px rgba(0,0,0,.42)" : "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { width: s, height: s, viewBox: "0 0 96 96", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("g", { fill: "none", stroke: PEN, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: DRAW[k] }) }) });
var OPEN = at6(575);
var CHIP_IN = [at6(577), at6(580), at6(578), at6(582)];
var CHIP_LOAD = [at6(590), at6(599), at6(595), at6(601)];
var CLICK2 = 0.72;
var HAND_KEYS = [{ at: 0, x: 1631, y: 758 }, { at: CLICK2, x: 1542, y: 552, click: true, early: 0.2 }, { at: 2.6, x: 2100, y: 640 }];
var BUNDLE = [[-282, -26, -7], [-188, -56, 5], [-92, -20, -4], [10, 14, 6]];
var CHIP_X = (i) => 442 + 112 * i;
var CHIP_Y = 411;
var ShotT = ({ t }) => {
  const top = 502 - 122 * S(t, OPEN, { damping: 24, stiffness: 320 });
  const h = handAt(t * 30, HAND_KEYS, { size: 210 });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Ground, { tone: "dark", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("svg", { width: 1920, height: 1080, style: abs(0, 0), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: 405, y: top, width: 1110, height: 702 - top, rx: 16, fill: C.dark2 }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: 405.5, y: top + 0.5, width: 1109, height: 701 - top, rx: 15.5, fill: "none", stroke: "rgba(255,255,255,.08)" })
    ] }),
    [0, 1, 2, 3].map((i) => {
      const on = clamp((t - CHIP_IN[i]) / 0.05), lo = clamp((t - CHIP_LOAD[i]) / 0.07);
      if (on <= 0) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(CHIP_X(i), CHIP_Y, 96, 96, { transform: `scale(${mix(0.5, 1, S(t, CHIP_IN[i], { damping: 13, stiffness: 240 }))})`, opacity: on, willChange: "transform" }), children: [
        lo < 1 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(0, 0, 96, 96, { borderRadius: 12, border: "2px solid rgba(255,255,255,.25)", opacity: 1 - lo }), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("svg", { width: "92", height: "92", viewBox: "0 0 96 96", style: { transform: `rotate(${t * 540 + i * 100}deg)` }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "48", cy: "48", r: "13", fill: "none", stroke: "rgba(255,255,255,.72)", strokeWidth: "3.2", strokeLinecap: "round", strokeDasharray: "54 82" }) }) }),
        lo > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(0, 0, 96, 96, { opacity: lo, transform: `scale(${mix(0.78, 1, S(t, CHIP_LOAD[i], { damping: 13, stiffness: 260 }))})` }), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Sheet, { k: i, s: 96 }) })
      ] }, i);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(442, 533, 1036, void 0, { fontSize: 30, fontWeight: 500, lineHeight: 1.36, color: "#E8EDF4", letterSpacing: -0.4 }), children: [
      "Turn these sketches into an app our customers can use.",
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Caret, { t, h: 32, w: 2.5, c: "#fff", style: { marginLeft: 3, verticalAlign: "-5px" } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(442, 633, 1036, 44, { display: "flex", alignItems: "center", gap: 16, fontSize: 21, fontWeight: 600, color: "#C5CEDB" }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontSize: 30, fontWeight: 400 }, children: "+" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { width: 1, height: 26, background: "rgba(255,255,255,.15)" } }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.Img, { src: (0, import_remotion7.staticFile)("logo/kb-logo-tile.svg"), style: { width: 28, height: 28, borderRadius: 5 } }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "K.B team" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { marginLeft: "auto", fontWeight: 500 }, children: "Send" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { width: 44, height: 44, borderRadius: 11, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Arrow, { s: 24, c: C.ink }) })
    ] }),
    [0, 2, 1, 3].map((i) => {
      const L = CHIP_IN[i] - 0.02, p = E(t, L, 0.16, ease.out), o = 1 - clamp((t - L - 0.02) / 0.1);
      if (o <= 0) return null;
      const [dx, dy, rot] = BUNDLE[i], x = mix(h.x + dx, CHIP_X(i) + 48, 0.3 * p), y = mix(h.y + dy, CHIP_Y + 48, 0.3 * p);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(0, 0, 118, 118, { transform: `translate3d(${(x - 59).toFixed(3)}px, ${(y - 59).toFixed(3)}px, 0) rotate(${(rot * (1 - p)).toFixed(3)}deg) scale(${mix(1, 0.7, p).toFixed(4)})`, opacity: o, willChange: "transform" }), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Sheet, { k: i, s: 118, shadow: true }) }, i);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Hand, { ...h })
  ] });
};
var Sketch = ({ seed, more }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("svg", { width: "1920", height: "1080", viewBox: "0 0 1920 1080", style: { position: "absolute", left: 0, top: 0, filter: `url(#r07rough${seed})` }, children: [
  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("filter", { id: `r07rough${seed}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("feTurbulence", { baseFrequency: "0.02", numOctaves: "2", seed }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("feDisplacementMap", { in: "SourceGraphic", scale: "7" })
  ] }) }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "none", stroke: "#4C5360", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "660", y: "120", width: "420", height: "820", rx: "50" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "200", width: "340", height: "230", rx: "16" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M700 480h340M700 540h250M700 600h300" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "820", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "940", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "720", y: "840", width: "300", height: "60", rx: "30" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1130 300 C1250 260 1300 300 1420 280M1130 330h260M1130 520 C1200 500 1330 540 1460 510M1130 550h200" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M560 640 C470 600 420 700 330 660M300 690l30-30 12 40" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "1300", cy: "760", r: "90" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1240 760l40 40 80-90" }),
    more && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ellipse", { cx: "870", cy: "742", rx: "206", ry: "96", transform: "rotate(-3 870 742)" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1120 262C1095 268 1078 284 1058 306M1058 306l6-27M1058 306l27-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1028 872C1100 884 1160 862 1206 824M1206 824l-29 2M1206 824l-8 28" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M206 642h178M216 658h120" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1130 600q22-16 44 0t44 0 44 0 44 0 44 0M1130 640q22-16 44 0t44 0 44 0" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M230 300q22-16 44 0t44 0 44 0 44 0M230 340q22-16 44 0t44 0M230 380q22-16 44 0t44 0 44 0" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M452 418l13 28 31 4-23 21 7 31-28-16-28 16 7-31-23-21 31-4z" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "250", y: "738", width: "150", height: "224", rx: "22" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M276 790h98M276 826h70M276 896h98" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M640 890C570 912 500 900 418 884M418 884l25-13M418 884l19 21" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1436 690l22 22M1458 690l-22 22M1150 930h250M1150 964h170" })
    ] })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "#4C5360", fontFamily: "'Comic Sans MS', cursive", fontSize: "44", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "1130", y: "240", children: "book in 2 taps" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "1130", y: "470", children: "show what's free" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "210", y: "620", children: "our app" })
  ] })
] });
var Drawing = () => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("svg", { width: "1920", height: "1080", viewBox: "0 0 1920 1080", style: { position: "absolute", left: 0, top: 0, fontFamily: F }, children: [
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "none", stroke: C.ink, strokeWidth: "2.6", strokeLinejoin: "round", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "660", y: "120", width: "420", height: "820", rx: "50" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "200", width: "340", height: "230", rx: "16" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M700 200l340 230M1040 200L700 430", strokeWidth: "1.2", opacity: ".55" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "820", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "940", y: "680", width: "100", height: "120", rx: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "720", y: "840", width: "300", height: "60", rx: "30" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "250", y: "650", width: "150", height: "290", rx: "22", strokeWidth: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "446", y: "650", width: "26", height: "290", rx: "11", strokeWidth: "2" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "rgba(41,58,81,.24)", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "472", width: "340", height: "16", rx: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "532", width: "250", height: "16", rx: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "700", y: "592", width: "300", height: "16", rx: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "274", y: "700", width: "102", height: "64", rx: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "274", y: "786", width: "102", height: "12", rx: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "274", y: "812", width: "70", height: "12", rx: "6" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "none", stroke: C.ink, strokeWidth: "1.6", opacity: ".72", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M596 120v820M582 120h28M582 940h28M660 62h420M660 48v28M1080 48v28M250 986h150M250 974v24M400 974v24" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M1048 315h112M958 540h202M1048 740h112M1028 870h132", strokeDasharray: "6 7" })
  ] }),
  [315, 540, 740, 870].map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "1184", cy: y, r: "24", fill: "#FAFAF7", stroke: C.ink, strokeWidth: "2.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "1184", y: y + 8, textAnchor: "middle", fontSize: "23", fontWeight: "600", fill: C.ink, children: i + 1 })
  ] }, i)),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: C.ink, fontSize: "36", fontWeight: "500", letterSpacing: "-0.8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "1234", y: "327", children: "show what's free" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "1234", y: "882", children: "book in 2 taps" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { fill: "rgba(41,58,81,.24)", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "1234", y: "532", width: "230", height: "16", rx: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "1234", y: "732", width: "160", height: "16", rx: "8" })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "210", y: "236", fontSize: "56", fontWeight: "700", fill: C.ink, letterSpacing: "-1.7", children: "our app" }),
  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M210 264h330", stroke: C.ink, strokeWidth: "2.6" }),
  [0, 1, 2, 3].map((i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: "226", cy: 326 + i * 60, r: "15", fill: "none", stroke: C.ink, strokeWidth: "1.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: "226", y: 332 + i * 60, textAnchor: "middle", fontSize: "17", fontWeight: "600", fill: C.ink, children: i + 1 }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("rect", { x: "260", y: 319 + i * 60, width: [230, 160, 200, 130][i], height: "14", rx: "7", fill: "rgba(41,58,81,.2)" })
  ] }, i))
] });
var GRID2 = "linear-gradient(rgba(41,58,81,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(41,58,81,.055) 1px, transparent 1px)";
var push = (s) => ({ transform: `scale(${s.toFixed(5)})`, willChange: "transform" });
var ShotU = ({ t }) => {
  const p = 1 + 0.03 * (t - at6(606));
  if (from(t, 618)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { background: "#F7F8FA" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: push(1 + 0.028 * (t - at6(622))), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(210, 140), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(AppUI, { wire: true }) }) }) });
  if (from(t, 613)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { background: "#FAFAF7" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { backgroundImage: GRID2, backgroundSize: "60px 60px", ...push(p) }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Drawing, {}) }) });
  if (from(t, 610)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { background: "#ECE8DE" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { transformOrigin: "50% 48%", ...push(1.13 * p) }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Sketch, { seed: 7, more: true }) }) });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: { background: "#F3F0E9" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: push(p), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Sketch, { seed: from(t, 609) ? 23 : from(t, 607) ? 11 : 3 }) }) });
};
var BAR_H = (i, n) => 30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + i / n * 0.45);
var LiveApp = ({ tl }) => {
  const nums = [String(Math.round(mix(229, 248, E(tl, 0, 0.6, ease.out)))), `${Math.round(mix(85, 92, E(tl, 0.04, 0.58, ease.out)))}%`, mix(4.2, 4.8, E(tl, 0.08, 0.54, ease.out)).toFixed(1)];
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: { position: "relative", width: 1500, height: 800 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(0, 0, 320, 800, { background: "#F4F6F9", borderRight: `1px solid ${C.line}` }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(30, 30, 56, 56, { borderRadius: 14, background: C.ink }) }),
      [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Bar, { x: 30, y: 130 + i * 64, w: 210 - i % 2 * 50, h: 18, c: i === 0 ? C.cyan : "#D5D9DF" }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(360, 34, 620, 44, { fontSize: 38, fontWeight: 700 }), children: "Bookings" }),
    [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(360 + i * 280, 110, 256, 150, { borderRadius: 20, background: [C.ink, C.cyan, "#EEF3FF"][i] }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Bar, { x: 24, y: 26, w: 120, h: 12, c: i === 0 ? "rgba(255,255,255,.4)" : "rgba(41,58,81,.3)" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(24, 62, 200, 60, { fontSize: 50, fontWeight: 700, color: i === 0 ? "#fff" : C.ink }), children: nums[i] })
    ] }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(360, 290, 816, 470, { borderRadius: 22, background: "#FFFFFF", border: `1px solid ${C.line}` }), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(40, 70, 736, 360, { display: "flex", alignItems: "flex-end", gap: 736 / 14 * 0.28 }), children: Array.from({ length: 14 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { flex: 1, height: `${BAR_H(i, 14)}%`, background: i === 11 ? C.cyan : C.indigo, borderRadius: "5px 5px 0 0", transformOrigin: "50% 100%", transform: `scaleY(${mix(0.3, 1, S(tl, 0.02 + i * 0.02, { damping: 15, stiffness: 200 })).toFixed(4)})` } }, i)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(1210, 110, 260, 650, { borderRadius: 22, background: "#F4F6F9" }), children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(20, 24 + i * 122, 220, 104, { borderRadius: 16, background: "#fff" }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(16, 20, 64, 64, { borderRadius: 14, background: [C.cyan, C.mint, C.amber, C.violet, C.coral][i] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Bar, { x: 96, y: 30, w: 100, h: 12, c: "#C9CED6" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Bar, { x: 96, y: 58, w: 70, h: 10 })
    ] }, i)) })
  ] });
};
var HOT = [[520, 130], [1010, 240], [800, 560], [1420, 420]];
var HOT_T = (i) => 0.06 + i * 0.125;
var ShotV = ({ t }) => {
  const tl = t - at6(622);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Ground, { tone: "ui", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_remotion7.AbsoluteFill, { style: push(1 + 0.028 * tl), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Win, { x: 170, y: 110, w: 1580, h: 860, bar: false, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(40, 30), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(LiveApp, { tl }) }),
    HOT.map(([x, y], i) => {
      const t0 = HOT_T(i), r = E(tl, t0, 0.6, ease.out), live = clamp((tl - t0 - 0.2) / 0.2);
      if (tl < t0) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: abs(x, y, 44, 44), children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(0, 0, 44, 44, { borderRadius: 22, border: `3px solid ${C.cyan}`, transform: `scale(${mix(1, 2.7, r).toFixed(4)})`, opacity: 0.7 * (1 - r) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: abs(0, 0, 44, 44, { borderRadius: 22, background: C.cyan, border: "5px solid #fff", boxShadow: "0 6px 16px rgba(41,58,81,.25)", transform: `scale(${(S(tl, t0, { damping: 11, stiffness: 260 }) * (1 + 0.07 * live * Math.sin((tl - t0) * 9))).toFixed(4)})` }) })
      ] }, i);
    })
  ] }) }) });
};
var ShotW = ({ t }) => {
  const tl = t - at6(639), k = 1 - E(tl, 0, 0.5, ease.out);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Footage, { name: "W", at: 0.1 + tl, scale: 1.02 + 0.07 * k + 0.015 * (1 - tl), x: 44 * k });
};
var Comp7 = ({ t }) => {
  useFonts();
  if (from(t, 639)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ShotW, { t });
  if (from(t, 622)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ShotV, { t });
  if (from(t, 606)) return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ShotU, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ShotT, { t });
};
var PKG7 = {
  id: "R07",
  Comp: Comp7,
  sfx: [
    { t: CLICK2 + 0.11, kind: "click", note: "the hand drops the four sketches on the message box", ref: 577 },
    { t: at6(590), kind: "pop", note: "attachment 1 has loaded", ref: 590 },
    { t: at6(595), kind: "pop", note: "attachment 3 has loaded", ref: 595 },
    { t: at6(599), kind: "pop", note: "attachment 2 has loaded", ref: 599 },
    { t: at6(601), kind: "pop", note: "attachment 4 has loaded", ref: 601 },
    { t: at6(606), kind: "tick", note: "flash cut: the pencil sketch", ref: 606 },
    { t: at6(610), kind: "tick", note: "flash cut: more notes drawn on", ref: 610 },
    { t: at6(613), kind: "tick", note: "flash: the clean drawing", ref: 613 },
    { t: at6(618), kind: "tick", note: "flash cut: the wireframe", ref: 618 },
    { t: at6(622) + HOT_T(0), kind: "sparkle", note: "the finished product: the hotspots pulse in", ref: 622 },
    { t: at6(639), kind: "swish", note: "cut to the filmed founder: the picture settles", ref: 639 }
  ]
};

// src/shots/R08.tsx
var import_remotion8 = __toESM(require_remotion_shim());
var import_jsx_runtime10 = require("react/jsx-runtime");
var F07 = 663;
var at7 = (n) => rs(n - F07);
var TEXT2 = "Now add online booking, so customers can order in two taps";
var CPS2 = 22;
var T02 = -(TEXT2.length - 13) / CPS2;
var X = ({ t }) => {
  const shown = typed(TEXT2, t, T02, CPS2), typing = shown.length < TEXT2.length;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Ground, { tone: "ui", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "700px 600px", transform: `scale(${(1 + 0.03 * t).toFixed(4)})`, willChange: "transform" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(60, 60, 1480, 960, { background: "#FBFBFA", borderRadius: 28 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(1600, 0, 320, 1080, { background: C.dark }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 150, y: 130, s: 50, w: 600, children: "Suggestions" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(140, 240, 1500, 100, { display: "flex", gap: 26 }), children: ["Add onboarding emails", "Sync payments"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { height: 100, borderRadius: 24, background: "#EEEDE9", fontSize: 44, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }, children: s }, s)) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(120, 420, 1400, 540, { borderRadius: 34, background: C.white, boxShadow: SH }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(180, 480, 1280, 200, { fontSize: 56, fontWeight: 500, lineHeight: 1.3, letterSpacing: -1.2 }), children: [
      shown,
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { display: "inline-block", position: "relative", width: 0, height: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Caret, { t, h: 60, w: 4, c: C.cyan, typing, style: { position: "absolute", left: 6, top: -48, marginLeft: 0 } }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(180, 820, 1280, 90, { display: "flex", alignItems: "center", gap: 28, fontSize: 50, fontWeight: 600 }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { fontWeight: 400, fontSize: 64 }, children: "+" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_remotion8.Img, { src: (0, import_remotion8.staticFile)("logo/kb-logo-tile.svg"), style: { width: 62, height: 62, borderRadius: 10 } }),
      "K.B team",
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { marginLeft: "auto", fontWeight: 500 }, children: "Send" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { width: 96, height: 96, borderRadius: 22, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Arrow, { s: 52, c: "#fff" }) })
    ] })
  ] }) });
};
var Dash = ({ grow: grow2, tip, pct, rate }) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { position: "relative", width: 1920, height: 1080, background: C.dark, fontFamily: "Montserrat, sans-serif" }, children: [
  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 120, y: 90, s: 36, w: 600, c: "#C5CEDB", children: "New customers" }),
  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(120, 170, 1180, 680, { borderRadius: 24, background: "#1B2636", overflow: "hidden" }), children: [
    [0, 1, 2, 3].map((i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(70, 90 + i * 130, 1040, 1, { background: "rgba(255,255,255,.07)" }) }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(0, 0, 1180, 680, { transformOrigin: "50% 610px", transform: `scaleY(${grow2.toFixed(4)})`, willChange: "transform" }), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Bars, { x: 70, y: 90, w: 1040, h: 520, n: 18, c: C.indigo }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { position: "absolute", left: 0, top: 130, transform: `translate3d(${mix(470, 890, tip).toFixed(2)}px, ${(-40 * Math.sin(tip * Math.PI)).toFixed(2)}px, 0)`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { width: 150, height: 84, borderRadius: 14, background: "#F4F7FA", fontSize: 30, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }, children: [
      (11.8 + 3.5 * tip).toFixed(1),
      "K"
    ] }) })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(1360, 170, 440, 320, { borderRadius: 24, background: "#1B2636" }), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 40, y: 36, s: 26, w: 500, c: "#9FB0C6", children: "Chosen again" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 40, y: 110, s: 130, w: 700, c: "#fff", children: `${pct}%` })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(1360, 530, 440, 320, { borderRadius: 24, background: "#1B2636" }), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 40, y: 36, s: 26, w: 500, c: "#9FB0C6", children: "Rating" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Tx, { x: 40, y: 110, s: 130, w: 700, c: C.cyan, children: rate.toFixed(1) })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(120, 890, 1680, 120, { borderRadius: 24, background: "#1B2636" }), children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(50 + i * 410, 46, 300 - i % 2 * 70, 26, { borderRadius: 13, background: i === 0 ? C.cyan : "#33425A" }) }, i)) })
] });
var Y = ({ t }) => {
  const u = t - at7(679), k = 1230 / 1920;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Ground, { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1100px 540px", transform: `scale(${(1.02 + 0.035 * u).toFixed(4)})`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(Win, { x: 110, y: 90, w: 1700, h: 900, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: abs(0, 0, 470, 860, { background: "#FAFBFC", borderRight: `1px solid ${C.line}`, padding: 30 }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_remotion8.Img, { src: (0, import_remotion8.staticFile)("logo/kb-logo-tile.svg"), style: { width: 34, height: 34, borderRadius: 6 } }),
        "K.B team"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { marginTop: 26, padding: 20, borderRadius: 16, background: "#EEEDE9", fontSize: 20, lineHeight: 1.4, fontWeight: 500 }, children: TEXT2 }),
      ["Booking flow added", "Payments connected"].map((s, i) => {
        const p = E(u, 0.12 + i * 0.3, 0.2, ease.out);
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 22, fontWeight: 500, opacity: p, transform: `translate3d(0, ${((1 - p) * 12).toFixed(2)}px, 0)` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Check, { s: 28 }),
          s
        ] }, s);
      }),
      [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { marginTop: i ? 14 : 34, width: [360, 300, 220][i], height: 14, borderRadius: 7, background: "#DADDE3" } }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: abs(470, 0, 1230, 860, { background: C.dark, overflow: "hidden" }), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { position: "absolute", left: 0, top: 84, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${k})` }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Dash, { grow: mix(0.55, 0.8, E(u, 0, 0.8, ease.out)), tip: 0, pct: 72, rate: 4.6 }) }) })
  ] }) }) });
};
var Z = ({ t }) => {
  const u = t - at7(699);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_remotion8.AbsoluteFill, { style: { background: C.dark }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 520px", transform: `scale(${(1.03 + 0.03 * u).toFixed(4)})`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Dash, { grow: mix(0.8, 1, E(u, 0, 0.7, ease.out)), tip: E(u, 0.15, 1.15, ease.inOut), pct: u < 0.55 ? 72 : u < 1.05 ? 73 : 74, rate: u < 0.4 ? 4.6 : u < 0.9 ? 4.7 : 4.8 }) }) });
};
var Comp8 = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_remotion8.AbsoluteFill, { style: { background: C.ui } });
  if (t < at7(679)) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(X, { t });
  if (t < at7(699)) return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Y, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Z, { t });
};
var sfx5 = [
  { t: 0, kind: "type", note: "0.55 the instruction's last words" },
  { t: at7(679) + 0.12, kind: "pop", note: "the first check in the K.B panel" },
  { t: at7(699), kind: "sparkle", note: "the dashboard comes alive" },
  { t: at7(699) + 1.05, kind: "pop", note: "74%" }
];
var PKG8 = { id: "R08", Comp: Comp8, sfx: sfx5 };

// src/shots/R09.tsx
var import_remotion9 = __toESM(require_remotion_shim());
var import_jsx_runtime11 = require("react/jsx-runtime");
var F08 = 733;
var at8 = (n) => rs(n - F08);
var EPS3 = 1e-6;
var MONO3 = "ui-monospace, Menlo, monospace";
var FILMED = [
  { name: "AA", f: 733, dim: 0.28, shade: 0.26, text: "Can you help us automate our follow-ups and keep the CRM up to date?" },
  { name: "AB", f: 748, dim: 0.36, shade: 0.32, text: "Turn these sketches into an app our customers can use." },
  { name: "AC", f: 760, dim: 0.34, shade: 0.14, text: "We want to be found by the right customers, in search and in AI answers." },
  { name: "AD", f: 771, dim: 0.36, shade: 0.36, text: "Build us one dashboard for the whole operation." }
];
var Filmed = ({ t }) => {
  let k = 0;
  for (let i = 1; i < FILMED.length; i++) if (t >= at8(FILMED[i].f) - EPS3) k = i;
  const s = FILMED[k], tl = Math.max(0, t - at8(s.f));
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_remotion9.AbsoluteFill, { style: { fontFamily: F }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Footage, { name: s.name, at: 0.1 + tl, scale: 1 + 0.02 * tl, dim: s.dim }, s.name),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_remotion9.AbsoluteFill, { style: { background: `radial-gradient(46% 30% at 50% 48.5%, rgba(10,16,26,${s.shade}) 0%, rgba(10,16,26,0) 100%)` } }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Over, { text: s.text })
  ] });
};
var T_AE = at8(787);
var T_AF = at8(810);
var CLICK3 = 2.52;
var KEYS = [{ at: 0, x: 1640, y: 1400 }, { at: CLICK3, x: 1040, y: 640, click: true, early: 0.21 }];
var CAM = [1928.356, -9204.539, 41333.325, -78500.845, 69078.999, -22570.495];
var cam = (t) => {
  const u = Math.max(0, (t - at8(796)) / 1.5);
  let s = 0, p = u;
  for (const c of CAM) {
    p *= u;
    s += c * p;
  }
  return s;
};
var BTN = { x: 960, y: 540 };
var POP2 = { damping: 22, stiffness: 420, mass: 0.7 };
var FROM_BUTTON = [800, 810, 812, 814, 816];
var Card2 = ({ t, f: f2, cx, cy, btn, children }) => {
  const t0 = at8(f2);
  if (t < t0 - EPS3) return null;
  const p = S(t, t0 - 0.06, POP2), q = 1 - p;
  const fx = btn ? BTN.x : mix(cx, BTN.x, 0.3), fy = btn ? BTN.y : cy + 200;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: {
    position: "absolute",
    left: 0,
    top: 0,
    transformOrigin: `${cx}px ${cy}px`,
    willChange: "transform",
    transform: `translate3d(${((fx - cx) * q).toFixed(2)}px, ${((fy - cy) * q).toFixed(2)}px, 0) rotate(${(q * (cx < BTN.x ? -8 : 8)).toFixed(2)}deg) scale(${mix(btn ? 0.12 : 0.5, 1, p).toFixed(4)})`
  }, children });
};
var Dot = ({ t, f: f2, x, y, s, c }) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: f2, cx: x, cy: y, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(x - s / 2, y - s / 2, s, s, { borderRadius: s / 2, background: c }) }) });
var Ring = ({ t, t0, d = 0.6, grow: grow2 = 0.5, o = 0.5 }) => {
  const x = (t - t0) / d;
  if (x <= 0 || x >= 1) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(810, 390, 300, 300, { borderRadius: 66, border: `6px solid ${C.cyan}`, opacity: o * (1 - x), transform: `scale(${(1 + grow2 * ease.out(x)).toFixed(4)})`, willChange: "transform" }) });
};
var Button = ({ t }) => {
  const rel = t - (CLICK3 + 0.37);
  const rebound = rel < 0 ? 0 : 0.0265 * Math.sin(rel * 2 * Math.PI / 0.3) * Math.exp(-rel * 9);
  const kick = FROM_BUTTON.reduce((a, f2) => {
    const x = (t - at8(f2)) / 0.24;
    return a + (x > 0 && x < 1 ? 0.06 * Math.sin(Math.PI * x) * (1 - x) : 0);
  }, 0);
  const sc = 1 - 0.06 * pressAt(t, CLICK3) + rebound + kick;
  const fill = E(t, CLICK3 + 0.05, 0.2, ease.out);
  const face = { position: "absolute", left: 0, top: 0, width: 300, height: 300, borderRadius: 66, display: "flex", alignItems: "center", justifyContent: "center" };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: abs(810, 390, 300, 300, { transform: `scale(${sc.toFixed(4)})`, willChange: "transform" }), children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { ...face, boxShadow: "0 30px 70px rgba(41,58,81,.26)", opacity: 1 - fill } }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { ...face, boxShadow: "0 30px 70px rgba(56,200,255,.45)", opacity: fill } }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { ...face, background: C.ink }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Arrow, { s: 150, c: "#fff" }) }),
    fill > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { ...face, background: C.cyan, clipPath: fill < 1 ? `circle(${(fill * 350).toFixed(1)}px at 230px 250px)` : void 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Arrow, { s: 150, c: C.ink }) })
  ] });
};
var CLIENTS = ["abroad-internships", "tale-forge", "venga-travel", "worldwiders", "olea-hospitality", "mindmymind"];
var Tower = ({ t }) => {
  const d = cam(t), v = cam(t + 1 / 120) - cam(t - 1 / 120);
  const blur = Math.max(0, v - 24) * 0.1;
  const bars = mix(0.2, 1, S(t, T_AF + 0.04, { damping: 15, stiffness: 150 }));
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Ground, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_remotion9.AbsoluteFill, { style: { opacity: E(t, CLICK3 + 0.1, 1.2), background: "radial-gradient(120% 95% at 50% 105%, rgba(56,200,255,.20) 0%, rgba(56,200,255,.07) 55%, rgba(56,200,255,0) 100%)" } }),
    blur > 0.2 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "0", height: "0", style: { position: "absolute" }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("filter", { id: "r09blur", x: "0", y: "0", width: "1", height: "1", colorInterpolationFilters: "sRGB", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("feGaussianBlur", { stdDeviation: `0 ${blur.toFixed(2)}` }) }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { position: "absolute", left: 0, top: -160, width: 1920, height: 1400, overflow: "hidden", filter: blur > 0.2 ? "url(#r09blur)" : void 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { position: "absolute", left: 0, top: 160, transform: `translate3d(0, ${d.toFixed(2)}px, 0)`, willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Ring, { t, t0: CLICK3 + 0.11 }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Ring, { t, t0: CLICK3 + 0.43, grow: 0.42, o: 0.35 }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Ring, { t, t0: T_AF, d: 0.5, grow: 1.1, o: 0.6 }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 830, cx: 1440, cy: -1630, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(1250, -1810, 380, 360, { borderRadius: 6, background: "#8B95A5" }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "380", height: "360", viewBox: "0 0 320 303", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M60 90 C160 40 240 110 150 150 C60 190 250 190 180 250", fill: "none", stroke: C.ink, strokeWidth: "7" }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 829, cx: 870, cy: -1340, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(660, -1500, 420, 320, { borderRadius: 6, background: "#2A3648" }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "420", height: "320", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("ellipse", { cx: "210", cy: "160", rx: "150", ry: "64", fill: "none", stroke: "#fff", strokeWidth: "6", strokeDasharray: "2 22", strokeLinecap: "round", transform: "rotate(-20 210 160)" }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Dot, { t, f: 828, x: 1480, y: -1290, s: 46, c: C.cyan }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Dot, { t, f: 829, x: 590, y: -1330, s: 40, c: C.amber }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Dot, { t, f: 829, x: 1180, y: -1395, s: 34, c: C.coral }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 826, cx: 390, cy: -1020, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(170, -1190, 440, 340, { borderRadius: 22, background: `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})` }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 827, cx: 1230, cy: -1010, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Port, { who: "robin", x: 1060, y: -1230, w: 340, h: 440, rot: 3 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 825, cx: 660, cy: -855, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(380, -980, 560, 250, { borderRadius: 22, background: C.white, boxShadow: SH, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 22 }), children: CLIENTS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { borderRadius: 12, background: "#F4F6F9", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_remotion9.Img, { src: (0, import_remotion9.staticFile)(`clients/${n}-logo.png`), style: { maxWidth: "78%", maxHeight: "62%", objectFit: "contain" } }) }, n)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 824, cx: 1370, cy: -615, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: abs(1200, -740, 340, 250, { borderRadius: 22, background: C.ink }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Bar, { x: 34, y: 34, w: 110, h: 12, c: "rgba(255,255,255,.4)" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Bar, { x: 34, y: 58, w: 64, h: 10, c: "rgba(255,255,255,.2)" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(170, 62, 130, 130), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Glyph, { k: 3, s: 130, c: C.cyan }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 819, cx: 840, cy: -540, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: abs(560, -700, 560, 320, { borderRadius: 22, background: "#F7F9FB", boxShadow: SH }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "560", height: "320", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { d: "M110 160 H240 M330 160 C380 160 380 90 440 90 M330 160 C380 160 380 230 440 230", fill: "none", stroke: C.cyan, strokeWidth: "5" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Tool, { n: "pipedrive", x: 40, y: 120, s: 80, navy: true }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Tool, { n: "n8n-logo2", x: 440, y: 50, s: 80 }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Tool, { n: "odoo-1", x: 440, y: 190, s: 80, navy: true }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(245, 118, 84, 84, { borderRadius: 20, border: `4px solid ${C.cyan}`, background: "#fff" }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 810, cx: 640, cy: -120, btn: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(330, -320, 620, 400, { borderRadius: 22, background: C.dark }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(0, 0, 620, 400, { transformOrigin: "50% 350px", transform: `scaleY(${bars.toFixed(4)})` }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Bars, { x: 50, y: 60, w: 520, h: 290, n: 12 }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 816, cx: 1270, cy: -195, btn: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: abs(1010, -360, 520, 330, { borderRadius: 22, background: "#F4F1EA", boxShadow: SH, padding: 44 }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 150, fontWeight: 600, fontFamily: MONO3, letterSpacing: -6 }, children: "100+" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 26, letterSpacing: 3, fontWeight: 600, color: C.sub }, children: "AUTOMATIONS BUILT" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 800, cx: 1010, cy: 150, btn: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Port, { who: "karl", x: 860, y: 0, w: 300, h: 300, rot: -3 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 814, cx: 1445, cy: 180, btn: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(1230, 30, 430, 300, { borderRadius: 22, background: C.indigo }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: abs(50, 50, 200, 200, { borderRadius: 100, background: "#DCE6FF" }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Card2, { t, f: 812, cx: 610, cy: 280, btn: true, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: abs(420, 150, 380, 260, { borderRadius: 22, background: C.white, boxShadow: SH, padding: 40 }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 120, fontWeight: 600, fontFamily: MONO3 }, children: "25" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { fontSize: 22, letterSpacing: 3, fontWeight: 600, color: C.sub }, children: "CLIENT PROJECTS" })
      ] }) }),
      d < 760 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { t }),
      d < 700 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(HandAt, { t, keys: KEYS, size: 330 })
    ] }) })
  ] });
};
var Comp9 = ({ t }) => t < T_AE - EPS3 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Filmed, { t }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Tower, { t });
var PKG9 = {
  id: "R09",
  Comp: Comp9,
  sfx: [
    { t: CLICK3 + 0.11, kind: "click", note: "the hand presses the one button; it floods cyan", ref: 794 },
    { t: at8(800), kind: "pop", note: "the first card jumps out of the button", ref: 800 },
    { t: T_AF, kind: "pop", note: "the burst: the chart, then three more cards two frames apart", ref: 810 },
    { t: T_AF, kind: "rise", note: "0.95", ref: 810 },
    { t: at8(819), kind: "pop", note: "the next card, at the top edge", ref: 819 },
    { t: at8(824), kind: "swish", note: "the fast run of cards, one a frame, f824-f830", ref: 824 }
  ]
};

// src/shots/R10.tsx
var import_remotion10 = __toESM(require_remotion_shim());
var import_jsx_runtime12 = require("react/jsx-runtime");
var F09 = 833;
var at9 = (n) => rs(n - F09);
var GRAD = `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})`;
var CARDS = [
  [380, 250, 560, 460, -520, 120, null, GRAD],
  [880, 110, 320, 320, 80, -420, /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { width: "320", height: "320", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("ellipse", { cx: "160", cy: "160", rx: "110", ry: "50", fill: "none", stroke: "#fff", strokeWidth: "6", strokeDasharray: "2 22", strokeLinecap: "round", transform: "rotate(-20 160 160)" }) }, "a"), "#2A3648"],
  [1140, 380, 240, 300, 480, -60, null, C.mint],
  [1380, 300, 190, 190, 520, -240, null, C.cyan],
  [950, 640, 190, 190, -80, 460, /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(40, 40, 110, 110, { borderRadius: 55, background: C.ink }) }, "b"), "#F4F1EA"],
  [1290, 540, 320, 320, 420, 380, /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { width: "320", height: "320", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M60 90 C160 40 240 110 150 150 C60 190 250 190 180 250", fill: "none", stroke: C.ink, strokeWidth: "7" }) }, "c"), "#8B95A5"]
];
var AG = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Ground, { tone: "dark", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(0.97 + 0.05 * t).toFixed(4)})`, willChange: "transform" }, children: CARDS.map(([x, y, w, h, dx, dy, inner, bg], i) => {
  const p = S(t, 0.01 + i * 0.035, { damping: 15, stiffness: 150 });
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(x, y, w, h, { background: bg, opacity: clamp(p * 2.5), transform: `translate3d(${(dx * (1 - p)).toFixed(2)}px, ${(dy * (1 - p)).toFixed(2)}px, 0) rotate(${((1 - p) * (i % 2 ? 6 : -6)).toFixed(2)}deg)`, willChange: "transform" }), children: inner }, i);
}) }) });
var SMALL = ["#2A3648", C.mint, C.cyan, "#8B95A5", C.indigo, "#F4F1EA"];
var AH = ({ t }) => {
  const u = t - at9(847), bold = t >= at9(871), v = t - at9(871), inn = S(u, 0, { damping: 16, stiffness: 160 });
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Ground, { tone: "dark", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.965, 1, inn) + 0.012 * u).toFixed(4)})`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(400, 130, 1120, 820, { background: "#F1EFEA", borderRadius: 6, overflow: "hidden" }), children: !bold ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(40, 110, 540, 520, { background: GRAD }) }),
    SMALL.map((c, i) => {
      const p = S(u, 0.05 + i * 0.04, { damping: 14 });
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(620 + i % 3 * 160, 110 + Math.floor(i / 3) * 270, 144, 200, { background: c, border: i === 5 ? `1px solid ${C.line}` : "none", opacity: clamp(p * 2), transform: `translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)` }) }, i);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tx, { x: 40, y: 660, s: 40, w: 500, children: "Your product" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(40, 760, 1040, 6, { background: "#D5D9DF" }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { width: 1040, height: 6, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${(0.2 + 0.06 * u).toFixed(4)})` } }) })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(-40, -40, 1200, 900, { background: GRAD, transformOrigin: "50% 50%", transform: `scale(${(1.08 - 0.05 * E(v, 0, 0.5, ease.out) + 0.01 * v).toFixed(4)})` }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(0, 0, 1120, 820, { background: "radial-gradient(70% 60% at 30% 35%, rgba(255,255,255,.28), transparent 70%)" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tx, { x: 56, y: 520, s: 92, w: 600, c: "#fff", style: { opacity: E(v, 0.03, 0.2, ease.out), transform: `translate3d(0, ${((1 - E(v, 0.03, 0.35, ease.out)) * 30).toFixed(2)}px, 0)` }, children: "Your product" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(56, 650, 1008, 6, { background: "rgba(255,255,255,.35)" }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { width: 1008, height: 6, background: "#fff", transformOrigin: "0 50%", transform: `scaleX(${(0.3 + 0.07 * v).toFixed(4)})` } }) }),
    SMALL.map((c, i) => {
      const p = S(v, 0.06 + i * 0.035, { damping: 14 });
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(56 + i * 172, 690, 152, 104, { background: c, opacity: clamp(p * 2), transform: `translate3d(0, ${((1 - p) * 40).toFixed(2)}px, 0)`, boxShadow: "0 10px 26px rgba(17,26,39,.25)" }) }, i);
    })
  ] }) }) }) });
};
var CLIENTS2 = ["abroad-internships", "tale-forge", "venga-travel", "worldwiders", "olea-hospitality", "mindmymind", "jongleren-es", "custom-staffing"];
var Cursor = ({ x, y, label }) => {
  const c = label === "You" ? C.coral : C.indigo;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`, willChange: "transform" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { width: "34", height: "34", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M3 2l7 19 3-8 8-3z", fill: c }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(26, 26, void 0, void 0, { background: c, color: "#fff", fontSize: 20, fontWeight: 700, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" }), children: label })
  ] });
};
var Board = ({ u }) => {
  const n25 = Math.round(mix(18, 25, E(u, 0, 0.9, ease.out))), n100 = Math.round(mix(72, 100, E(u, 0.1, 1, ease.out)));
  const cur = (x0, y0, x1, y1, a, d) => {
    const p = E(u, a, d, ease.inOut);
    return [mix(x0, x1, p), mix(y0, y1, p)];
  };
  const k1 = cur(420, 250, 505, 330, 0.1, 0.8), k2 = cur(1250, 300, 1130, 395, 0.5, 0.9), k3 = cur(760, 900, 640, 815, 0.3, 1);
  const k1b = cur(0, 0, 240, 150, 1.2, 1.2), k2b = cur(0, 0, -170, 210, 1.5, 1.1), k3b = cur(0, 0, 330, -60, 1.4, 1.2);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { position: "relative", width: 1920, height: 1080 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(-900, -700, 3720, 2480, { backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: "36px 36px" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(60, 60, 430, 250, { borderRadius: 16, background: C.dark, overflow: "hidden" }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(0, 0, 430, 250, { transformOrigin: "50% 230px", transform: `scaleY(${mix(0.6, 1, E(u, 0, 0.8, ease.out)).toFixed(4)})` }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Bars, { x: 30, y: 40, w: 370, h: 190, n: 10 }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: abs(540, 40, 560, 320, { borderRadius: 16, background: "#F7F9FB", boxShadow: SH }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("svg", { width: "560", height: "320", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("path", { d: "M110 160 H240 M330 160 C380 160 380 90 440 90 M330 160 C380 160 380 230 440 230", fill: "none", stroke: C.cyan, strokeWidth: "5" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tool, { n: "pipedrive", x: 40, y: 120, s: 80, navy: true }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tool, { n: "n8n-logo2", x: 440, y: 50, s: 80 }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tool, { n: "odoo-1", x: 440, y: 190, s: 80, navy: true }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(245, 118, 84, 84, { borderRadius: 20, border: `4px solid ${C.cyan}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_remotion10.Img, { src: (0, import_remotion10.staticFile)("logo/kb-logo-tile.svg"), style: { width: 46, height: 46, borderRadius: 7 } }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: abs(1150, 60, 300, 300, { borderRadius: 16, background: C.cyan, padding: 30, fontSize: 96, fontWeight: 700, boxSizing: "border-box" }), children: [
      n25,
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { fontSize: 22, fontWeight: 600 }, children: "client projects" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: abs(1500, 60, 380, 300, { borderRadius: 16, background: C.ink, padding: 30, fontSize: 96, fontWeight: 700, color: "#fff", boxSizing: "border-box" }), children: [
      n100,
      n100 >= 100 ? "+" : "",
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { fontSize: 22, fontWeight: 600 }, children: "automations" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: abs(60, 370, 300, 420, { borderRadius: 30, background: C.white, boxShadow: SH }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(0, 0, 300, 220, { borderRadius: "30px 30px 0 0", background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Bar, { x: 30, y: 260, w: 200, h: 18, c: C.ink }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Bar, { x: 30, y: 300, w: 140, h: 14 })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(420, 420, 700, 380, { borderRadius: 16, background: C.dark, padding: 30, boxSizing: "border-box", overflow: "hidden" }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Rank, { x: 30, y: 30, w: 640, at: 0 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(1180, 420, 700, 380, { borderRadius: 16, background: C.white, boxShadow: SH, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: 26, boxSizing: "border-box" }), children: CLIENTS2.map((n) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { borderRadius: 12, background: "#F4F6F9", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_remotion10.Img, { src: (0, import_remotion10.staticFile)(`clients/${n}-logo.png`), style: { maxWidth: "78%", maxHeight: "62%", objectFit: "contain" } }) }, n)) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(60, 850, 560, 260, { borderRadius: 16, background: "#FFF6C9", padding: 30, fontSize: 30, fontWeight: 600, boxSizing: "border-box" }), children: "Next: the customer app" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(680, 850, 520, 260, { borderRadius: 16, background: C.mint }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: abs(1260, 850, 620, 260, { borderRadius: 16, background: C.white, boxShadow: SH }), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Bars, { x: 40, y: 40, w: 540, h: 200, n: 16, c: C.cyan }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Cursor, { x: k1[0] + k1b[0], y: k1[1] + k1b[1], label: "K.B" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Cursor, { x: k2[0] + k2b[0], y: k2[1] + k2b[1], label: "K.B" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Cursor, { x: k3[0] + k3b[0], y: k3[1] + k3b[1], label: "You" })
  ] });
};
var AIJ = ({ t }) => {
  const u = t - at9(900), wide = t >= at9(925), v = t - at9(925);
  const sc = wide ? 1 - 0.035 * E(v, 0, 1.6, ease.out) - 4e-3 * v : 2 - 0.06 * u;
  const ox = wide ? 960 : 520, oy = wide ? 540 : 250;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Ground, { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${sc.toFixed(4)})`, willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Board, { u }) }) });
};
var Comp10 = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_remotion10.AbsoluteFill, { style: { background: C.dark } });
  if (t < at9(847)) return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AG, { t });
  if (t < at9(900)) return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AH, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(AIJ, { t });
};
var sfx6 = [
  { t: 0, kind: "swish", note: "the collage flies in" },
  { t: at9(847), kind: "pop", note: "the product window" },
  { t: at9(871), kind: "rise", note: "the bolder version" },
  { t: at9(900), kind: "swish", note: "the board, close" },
  { t: at9(925), kind: "slide", note: "the whole board" }
];
var PKG10 = { id: "R10", Comp: Comp10, sfx: sfx6 };

// src/shots/R11.tsx
var import_remotion11 = __toESM(require_remotion_shim());
var import_jsx_runtime13 = require("react/jsx-runtime");
var F010 = 962;
var at10 = (n) => rs(n - F010);
var say2 = (filmSeconds) => filmSeconds - rs(F010);
var Cur = ({ t, h, w, up, gap, c }) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { display: "inline-block", position: "relative", width: 0, height: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Caret, { t, h, w, c, typing: true, style: { position: "absolute", left: gap, top: -up, marginLeft: 0 } }) });
var ROWS = ["Process audit with your team", "Built in the open, with your team", "Training and onboarding"];
var ROW_AT = [963, 967, 972];
var PUSH = [[962, 52], [966, 86], [971, 86], [986, 138], [1004, 72]];
var RISE = PUSH.slice(0, 4).reduce((s, [, d]) => s + d, 0);
var INV0 = at10(993) - 1 / 18;
var OLD = [
  [150, -342, 300, 20, "#C9CED6"],
  [218, -262, 1010, 18],
  [218, -224, 700, 18],
  [218, -148, 1040, 18],
  [218, -110, 980, 18],
  [218, -72, 520, 18]
];
var AK = ({ t }) => {
  const y = PUSH.reduce((s, [f2, d]) => s - d * E(t, at10(f2), 0.3, ease.out), RISE);
  const next = t >= at10(1004) + 0.04;
  const cur = t >= at10(987) ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Cur, { t, h: 62, w: 4, up: 49, gap: 8 }) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Ground, { tone: "ui", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(60, 0, 1400, 1080, { background: "#FBFBFA" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(1620, 0, 300, 1080, { background: C.dark }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, willChange: "transform" }, children: [
      OLD.map(([x, yy, w, h, c], i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Bar, { x, y: yy, w, h, c }, i)),
      [-262, -148].map((yy) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(152, yy - 3, 24, 24, { borderRadius: 12, background: C.cyan }) }, yy)),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 150, y: 90, s: 30, w: 700, c: C.sub, style: { letterSpacing: 3 }, children: "WHAT WE DID" }),
      ROWS.map((txt, i) => {
        const r = at10(ROW_AT[i]), ring = clamp((t - r - 0.05) / 0.55);
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: abs(150, 160 + i * 86, 1200, 60, { display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 500, opacity: E(t, r, 0.08, ease.out), transform: `translate3d(0, ${(16 * (1 - E(t, r, 0.3, ease.out))).toFixed(2)}px, 0)` }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { position: "relative", width: 44, height: 44, flex: "none" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(0, 0, 44, 44, { borderRadius: 22, border: `3px solid ${C.green}`, boxSizing: "border-box", opacity: 0.55 * (1 - ring), transform: `scale(${(1 + 0.85 * ease.out(ring)).toFixed(4)})` }) }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(0, 0, 44, 44, { transform: `scale(${mix(0.45, 1, S(t, r, { damping: 11, stiffness: 240 })).toFixed(4)})` }), children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Check, { s: 44 }) })
          ] }),
          txt
        ] }, txt);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Tx, { x: 150, y: 470, s: 52, w: 500, children: [
        typed("Involved.", t, INV0, 18),
        !next && cur
      ] }),
      next && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 150, y: 542, s: 52, w: 500, children: cur })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 150, y: 640, s: 42, w: 600, children: "Suggestions" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(140, 730, 1300, 100, { display: "flex", gap: 26 }), children: ["Plan the next release", "Review the numbers"].map((txt) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { height: 96, borderRadius: 24, background: "#EEEDE9", fontSize: 40, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }, children: txt }, txt)) })
  ] });
};
var cubicOut = (x) => 1 - (1 - x) ** 3;
var CPS3 = 40;
var SAID = [["From day", say2(42.3) - 0.02 - 1 / CPS3], [" one", say2(42.64) - 0.045 - 1 / CPS3], [" onwards.", say2(42.98) - 0.045 - 1 / CPS3]];
var HAND_AL = [{ at: 0, x: 1229, y: 1144 }, { at: 5.14, x: 1651, y: 376, early: 0, dur: 2.266 }];
var AL = ({ t }) => {
  const y = 65 * (1 - E(t, at10(1007), 0.16, cubicOut)) + 20 * (at10(1050) - t);
  const ink = "#1F2A3A";
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Ground, { tone: "vig", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { position: "absolute", left: 0, top: 0, transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, willChange: "transform" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 70, y: 300, s: 190, w: 400, c: ink, style: { letterSpacing: -5 }, children: "Involved." }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Tx, { x: 70, y: 540, s: 190, w: 400, c: ink, style: { letterSpacing: -5 }, children: [
        SAID.map(([w, s]) => typed(w, t, s, CPS3)).join(""),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Cur, { t, h: 190, w: 9, up: 163, gap: 14, c: ink })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Fringe, { o: 0.04 }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(HandAt, { t, keys: HAND_AL, size: 330 })
  ] });
};
var CLICK4 = 4.6;
var HAND_AM = [{ at: 0, x: 391, y: 2348 }, { at: CLICK4, x: 1578, y: 532, click: true, early: 0.21 }];
var AM = ({ t }) => {
  const over = S(t, at10(1057), { damping: 18, stiffness: 190 });
  const down = E(t, CLICK4 + 0.075, 0.05, ease.out) * (1 - E(t, CLICK4 + 0.16, 0.11));
  const k = 0.14 * over + 0.86 * down;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Ground, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(-40, 150, 1700, 1e3, { background: "#EDEEF0", borderRadius: 40 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(-40, 380, 1700, 800, { background: C.white }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(-40, 600, 1700, 600, { background: C.dark }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 300, y: 236, s: 70, w: 400, children: "\xD7" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tx, { x: 560, y: 236, s: 70, w: 300, c: "#9AA3AF", children: "+" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(420, 430, 300, 110, { display: "flex" }), children: ["robin", "tom", "youri"].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_remotion11.Img, { src: (0, import_remotion11.staticFile)(`team/${w}.jpg`), style: { width: 110, height: 110, borderRadius: 55, objectFit: "cover", objectPosition: "50% 20%", border: "6px solid #fff", marginLeft: i ? -34 : 0 } }, w)) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: abs(790, 420, 820, 130, {
      borderRadius: 30,
      background: `rgb(${mix(41, 96, k).toFixed(0)}, ${mix(58, 121, k).toFixed(0)}, ${mix(81, 156, k).toFixed(0)})`,
      color: "#fff",
      fontSize: 54,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      letterSpacing: -1,
      boxShadow: `0 ${(16 * over * (1 - down)).toFixed(1)}px ${(34 * over * (1 - down)).toFixed(1)}px rgba(41,58,81,${(0.22 * over * (1 - down)).toFixed(3)})`,
      transform: `scale(${(1 + 0.02 * over - 0.035 * down).toFixed(4)})`,
      willChange: "transform"
    }), children: "Book a Free Discovery Call" }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(HandAt, { t, keys: HAND_AM, size: 300 })
  ] });
};
var Comp11 = ({ t }) => {
  useFonts();
  return t >= at10(1050) ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AM, { t }) : t >= at10(1007) ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AL, { t }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AK, { t });
};
var sfx7 = [
  { t: at10(964), kind: "pop", note: "check row 1 lands", ref: 964, db: -8 },
  { t: at10(968), kind: "pop", note: "check row 2 lands", ref: 968, db: -8 },
  { t: at10(973), kind: "pop", note: "check row 3 lands", ref: 973, db: -8 },
  { t: at10(993), kind: "type", note: "0.45", ref: 988 },
  // "Involved."
  { t: say2(42.3) - 0.02, kind: "type", note: "0.2", ref: 1009 },
  // "From day"
  { t: say2(42.64) - 0.02, kind: "type", note: "0.08", ref: 1013 },
  // "one"
  { t: say2(42.98) - 0.02, kind: "type", note: "0.2", ref: 1017 },
  // "onwards."
  { t: CLICK4 + 0.11, kind: "click", note: "the hand clicks the button", ref: 1075 }
];
var PKG11 = { id: "R11", Comp: Comp11, sfx: sfx7 };

// src/shots/R12.tsx
var import_remotion12 = __toESM(require_remotion_shim());
var import_jsx_runtime14 = require("react/jsx-runtime");
var F011 = 1080;
var at11 = (n) => rs(n - F011);
var say3 = (filmSeconds) => filmSeconds - rs(F011);
var LINE = "Your next chapter";
var TYPE0 = say3(45.5);
var CPS4 = 17.5;
var AN = ({ t }) => {
  const shown = typed(LINE, t, TYPE0, CPS4), typing = t >= TYPE0 && shown.length < LINE.length;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_remotion12.AbsoluteFill, { style: { fontFamily: F }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Footage, { name: "AN", at: 0.1 + t, scale: 1.03 + 0.014 * t, dim: 0.44 }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", color: "#fff", fontSize: 132, fontWeight: 600, letterSpacing: -5, whiteSpace: "pre", textShadow: "0 4px 30px rgba(0,0,0,.35)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: shown }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { display: "inline-block", position: "relative", width: 0, height: 0 }, children: t >= TYPE0 - 0.5 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Caret, { t, h: 128, w: 7, c: C.cyan, typing, style: { position: "absolute", left: 10, top: -108, marginLeft: 0 } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { opacity: 0 }, children: LINE.slice(shown.length) })
    ] })
  ] });
};
var SLOT = 96;
var ROW_X = 960 - 2.5 * SLOT;
var Row2 = ({ t, c, close = 0 }) => {
  const n = Math.max(0, (t - at11(1152)) * 24);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_jsx_runtime14.Fragment, { children: [0, 1, 2, 3, 4].map((i) => {
    const k = (i * 2 + Math.floor((n + i * 1.3) / 2.5)) % 5;
    const dx = (2 - i) * SLOT * close;
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: abs(ROW_X + i * SLOT, 540 - SLOT / 2, SLOT, SLOT, { display: "flex", alignItems: "center", justifyContent: "center", transform: `translate3d(${dx.toFixed(2)}px, 0, 0) scale(${(1 - 0.5 * close).toFixed(4)})`, opacity: 1 - close, willChange: "transform" }), children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Glyph, { k, s: 62, c }) }, i);
  }) });
};
var AO = ({ t }) => {
  const n = Math.max(0, (t - at11(1152)) * 24), hi = Math.floor(n / 2.4) % 5;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Ground, { tone: "ui", children: [
    [[ROW_X - 40, 440], [ROW_X + 5 * SLOT + 32, 440], [ROW_X - 40, 632], [ROW_X + 5 * SLOT + 32, 632]].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: abs(x, y, 8, 8, { background: C.cyan }) }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: abs(ROW_X + hi * SLOT + 11, 540 - 37, 74, 74, { borderRadius: 8, background: C.cyan }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Row2, { t, c: C.ink })
  ] });
};
var AP = ({ t }) => {
  const t0 = at11(1164), close = E(t, t0, 0.3, ease.inOut), tile = S(t, t0 + 0.12, { damping: 12, stiffness: 190 });
  const ring = clamp((t - t0 - 0.45) / 0.9);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Ground, { tone: "cyan", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Row2, { t, c: C.ink, close }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: abs(960 - 115, 540 - 115, 230, 230, { borderRadius: 30, border: "3px solid rgba(41,58,81,.55)", boxSizing: "border-box", opacity: ring > 0 && ring < 1 ? 0.6 * (1 - ring) : 0, transform: `scale(${(1 + 0.7 * ease.out(ring)).toFixed(4)})` }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.55, 1, tile) * (1 + 0.012 * Math.max(0, t - t0 - 0.5))).toFixed(4)})`, opacity: clamp(tile * 2.2), willChange: "transform" }, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Tile, { x: 960, y: 540, s: 230 }) })
  ] });
};
var Comp12 = ({ t }) => {
  const ok = useFonts();
  if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_remotion12.AbsoluteFill, { style: { background: "#000" } });
  if (t < at11(1152)) return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AN, { t });
  if (t < at11(1164)) return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AO, { t });
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(AP, { t });
};
var sfx8 = [
  { t: TYPE0, kind: "type", note: "0.97 the closing words" },
  { t: at11(1152), kind: "sparkle", note: "the glyph row" },
  { t: at11(1164), kind: "swish", note: "the end screen" },
  { t: at11(1164) + 0.2, kind: "thud", note: "the K.B tile lands" }
];
var PKG12 = { id: "R12", Comp: Comp12, sfx: sfx8 };

// src/Film.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var ALL = [PKG, PKG2, PKG3, PKG4, PKG5, PKG6, PKG7, PKG8, PKG9, PKG10, PKG11, PKG12];

// tools/.ev-entry.ts
var sfx9 = ALL.flatMap((p, i) => (p.sfx || []).map((e) => ({ ...e, t: +(e.t + PKGS[i].f0 / 24).toFixed(3), pkg: p.id })));
globalThis.__OUT = { dur: DUR_FRAMES / FPS, sfx: sfx9.sort((a, b) => a.t - b.t) };
