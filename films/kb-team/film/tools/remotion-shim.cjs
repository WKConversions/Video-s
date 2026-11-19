// node-only stand-in for "remotion" used by tools/handcheck.mjs: the real Easing and helpers, with components and
// frame hooks replaced by plain stand-ins (the check only needs the scenes' JavaScript to run)
const React = require("react");
const real = require(require("node:path").resolve(__dirname, "../node_modules/remotion"));
const box = (p) => React.createElement("div", { style: p.style }, p.children);
module.exports = { ...real, useCurrentFrame: () => globalThis.__frame ?? 0, useVideoConfig: () => ({ fps: 60, width: 1920, height: 1080, durationInFrames: 3912, id: "Film" }),
  delayRender: () => 0, continueRender: () => {}, AbsoluteFill: box, Sequence: box, Img: (p) => React.createElement("img", { src: p.src, style: p.style }), staticFile: (s) => "/" + s };
