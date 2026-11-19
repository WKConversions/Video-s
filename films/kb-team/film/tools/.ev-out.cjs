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
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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
    var React = require("react");
    var real = require(require("node:path").resolve(__dirname, "../node_modules/remotion"));
    var box = (p) => React.createElement("div", { style: p.style }, p.children);
    module2.exports = {
      ...real,
      useCurrentFrame: () => globalThis.__frame ?? 0,
      useVideoConfig: () => ({ fps: 60, width: 1920, height: 1080, durationInFrames: 3912, id: "Film" }),
      delayRender: () => 0,
      continueRender: () => {
      },
      AbsoluteFill: box,
      Sequence: box,
      Img: (p) => React.createElement("img", { src: p.src, style: p.style }),
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
var import_remotion = __toESM(require_remotion_shim());
var import_jsx_runtime = require("react/jsx-runtime");
var Comp = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_remotion.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R01 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG = { id: "R01", Comp, sfx: [] };

// src/shots/R02.tsx
var import_remotion2 = __toESM(require_remotion_shim());
var import_jsx_runtime2 = require("react/jsx-runtime");
var Comp2 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_remotion2.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R02 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG2 = { id: "R02", Comp: Comp2, sfx: [] };

// src/shots/R03.tsx
var import_remotion3 = __toESM(require_remotion_shim());
var import_jsx_runtime3 = require("react/jsx-runtime");
var Comp3 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_remotion3.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R03 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG3 = { id: "R03", Comp: Comp3, sfx: [] };

// src/shots/R04.tsx
var import_remotion4 = __toESM(require_remotion_shim());
var import_jsx_runtime4 = require("react/jsx-runtime");
var Comp4 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_remotion4.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R04 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG4 = { id: "R04", Comp: Comp4, sfx: [] };

// src/shots/R05.tsx
var import_remotion5 = __toESM(require_remotion_shim());
var import_jsx_runtime5 = require("react/jsx-runtime");
var Comp5 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_remotion5.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R05 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG5 = { id: "R05", Comp: Comp5, sfx: [] };

// src/shots/R06.tsx
var import_remotion6 = __toESM(require_remotion_shim());
var import_jsx_runtime6 = require("react/jsx-runtime");
var Comp6 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_remotion6.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R06 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG6 = { id: "R06", Comp: Comp6, sfx: [] };

// src/shots/R07.tsx
var import_remotion7 = __toESM(require_remotion_shim());
var import_jsx_runtime7 = require("react/jsx-runtime");
var Comp7 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_remotion7.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R07 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG7 = { id: "R07", Comp: Comp7, sfx: [] };

// src/shots/R08.tsx
var import_remotion8 = __toESM(require_remotion_shim());
var import_jsx_runtime8 = require("react/jsx-runtime");
var Comp8 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_remotion8.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R08 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG8 = { id: "R08", Comp: Comp8, sfx: [] };

// src/shots/R09.tsx
var import_remotion9 = __toESM(require_remotion_shim());
var import_jsx_runtime9 = require("react/jsx-runtime");
var Comp9 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_remotion9.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R09 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG9 = { id: "R09", Comp: Comp9, sfx: [] };

// src/shots/R10.tsx
var import_remotion10 = __toESM(require_remotion_shim());
var import_jsx_runtime10 = require("react/jsx-runtime");
var Comp10 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_remotion10.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R10 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG10 = { id: "R10", Comp: Comp10, sfx: [] };

// src/shots/R11.tsx
var import_remotion11 = __toESM(require_remotion_shim());
var import_jsx_runtime11 = require("react/jsx-runtime");
var Comp11 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_remotion11.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R11 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG11 = { id: "R11", Comp: Comp11, sfx: [] };

// src/shots/R12.tsx
var import_remotion12 = __toESM(require_remotion_shim());
var import_jsx_runtime12 = require("react/jsx-runtime");
var Comp12 = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_remotion12.AbsoluteFill, { style: { background: "#F7F7F7", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 60, color: "#293A51" }, children: [
  "R12 \xB7 ",
  t.toFixed(2),
  " s"
] });
var PKG12 = { id: "R12", Comp: Comp12, sfx: [] };

// src/Film.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var ALL = [PKG, PKG2, PKG3, PKG4, PKG5, PKG6, PKG7, PKG8, PKG9, PKG10, PKG11, PKG12];

// tools/.ev-entry.ts
var sfx = ALL.flatMap((p, i) => (p.sfx || []).map((e) => ({ ...e, t: +(e.t + PKGS[i].f0 / 24).toFixed(3), pkg: p.id })));
globalThis.__OUT = { dur: DUR_FRAMES / FPS, sfx: sfx.sort((a, b) => a.t - b.t) };
