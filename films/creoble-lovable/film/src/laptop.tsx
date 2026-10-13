// The laptop, in CSS 3D: an aluminium deck with real thickness, a full keyboard and trackpad, and a lid opened to ~115°
// with its own edges, on a floor that shares the same perspective (the studio's dark stone, or the flower shop's counter).
// The camera sits above the laptop, so the keyboard's top reads; with the lid leaning back by the camera's elevation the
// screen faces the lens square on. Everything is placed with transforms (no left/top under a zoom: no pixel snapping).
import React from "react";
import { Scaled } from "./sites";

type FloorKind = "stone" | "wood";

// key rows, in key units (u): height, then the widths across (each row adds up to 15 u)
const ones = (n: number) => Array.from({ length: n }, () => 1);
const ROWS: [number, number[]][] = [
  [0.62, [1.5, ...ones(12), 1.5]],
  [1, [...ones(13), 2]],
  [1, [1.5, ...ones(12), 1.5]],
  [1, [1.8, ...ones(11), 2.2]],
  [1, [2.3, ...ones(10), 2.7]],
  [1, [1, 1, 1, 1.25, 5.5, 1.25, 1]],          // + the arrow cluster in the last 3 u
];

const Keyboard: React.FC<{ w: number; d: number }> = ({ w, d }) => {
  const kbW = w * 0.85, u = kbW / 15, gap = u * 0.11, x0 = (w - kbW) / 2, y0 = d * 0.07;
  const keys: React.ReactNode[] = [];
  const key = (x: number, y: number, kw: number, kh: number) => keys.push(
    <div key={keys.length} style={{ position: "absolute", left: x + gap / 2, top: y + gap / 2, width: kw - gap, height: kh - gap, borderRadius: u * 0.14,
      background: "linear-gradient(180deg, #2E3033 0%, #1B1C1F 100%)", boxShadow: `0 ${u * 0.04}px ${u * 0.05}px rgba(0,0,0,0.35), inset 0 ${u * 0.03}px 0 rgba(255,255,255,0.06)` }} />);
  let y = y0;
  ROWS.forEach(([h, ws], r) => {
    let x = x0;
    ws.forEach((kw) => { key(x, y, kw * u, h * u); x += kw * u; });
    if (r === ROWS.length - 1) {                        // ← ↑↓ →: half-height keys, up over down
      key(x, y + u / 2, u, u / 2); key(x + u, y, u, u / 2); key(x + u, y + u / 2, u, u / 2); key(x + 2 * u, y + u / 2, u, u / 2);
    }
    y += h * u;
  });
  const kbH = y - y0;
  return (
    <>
      <div style={{ position: "absolute", left: x0 - u * 0.12, top: y0 - u * 0.12, width: kbW + u * 0.24, height: kbH + u * 0.24, borderRadius: u * 0.25,
        background: "rgba(40,44,48,0.10)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.18)" }} />
      {keys}
      <div style={{ position: "absolute", left: (w - w * 0.44) / 2, top: y + d * 0.06, width: w * 0.44, height: d - (y + d * 0.06) - d * 0.06, borderRadius: u * 0.32,
        background: "linear-gradient(180deg, #CACDD0 0%, #D6D8DA 100%)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.09), inset 0 1px 3px rgba(0,0,0,0.08)" }} />
    </>
  );
};

const floorBg = (kind: FloorKind, FW: number, back: number, w: number, d: number) => {
  // the contact shadow under the deck and the lid's soft shadow behind it, positioned in the floor's own coordinates
  const cx = FW / 2, deckZ = back + d / 2, lidZ = back - w * 0.16;
  const shadows = [
    `radial-gradient(ellipse ${w * 0.56}px ${d * 0.58}px at ${cx}px ${deckZ}px, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.36) 50%, rgba(0,0,0,0) 100%)`,
    `radial-gradient(ellipse ${w * 0.62}px ${w * 0.22}px at ${cx}px ${lidZ}px, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 100%)`,
  ];
  if (kind === "stone") return [
    ...shadows,
    `radial-gradient(ellipse ${w * 2.2}px ${w * 1.8}px at ${cx}px ${deckZ}px, rgba(128,146,136,0.34) 0%, rgba(128,146,136,0.12) 45%, rgba(128,146,136,0) 100%)`,
    "linear-gradient(180deg, #121614 0%, #1A1F1C 40%, #262C29 100%)",
  ].join(", ");
  return [
    ...shadows,
    `radial-gradient(ellipse ${w * 1.4}px ${w * 0.9}px at ${cx - w * 0.3}px ${deckZ + d * 0.6}px, rgba(255,240,220,0.22) 0%, rgba(255,240,220,0) 100%)`,
    "repeating-linear-gradient(90deg, rgba(110,72,40,0.10) 0px, rgba(110,72,40,0.10) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 13px, rgba(255,235,210,0.06) 13px, rgba(255,235,210,0.06) 15px, rgba(0,0,0,0) 15px, rgba(0,0,0,0) 31px)",
    "linear-gradient(180deg, #F0D9BC 0px, #E2C29E 3px, #A27C58 4px, #B48E69 30%, #C29C76 100%)",
  ].join(", ");
};

/**
 * A laptop seen from above. (x, y) is where the hinge's centre sits in the frame, s zooms the whole shot about that point.
 * yaw turns it (positive: its right side away from the camera), elev is the camera's height in degrees, open the lid's angle.
 */
export const Laptop3D: React.FC<{ w: number; x: number; y: number; s?: number; yaw: number; elev?: number; open?: number; floor?: FloorKind;
  floorBack?: number; children: React.ReactNode }> = ({ w, x, y, s = 1, yaw, elev = 24, open = 115, floor, floorBack = 6, children }) => {
  const d = w * 0.68, td = w * 0.02, tl = w * 0.012;
  const bezS = w * 0.02, bezT = w * 0.026, bezB = w * 0.034, scrW = w - 2 * bezS, h = bezT + scrW * 0.625 + bezB;
  const t = open - 90;
  const lid = (extra: string) => `translate3d(${-w / 2}px, 0px, 0px) rotateX(${t}deg) ${extra}`;
  const face: React.CSSProperties = { position: "absolute", left: 0, top: 0, transformOrigin: "0 0" };
  const metalEdge = "linear-gradient(180deg, #A7ABAE 0%, #8E9295 100%)";
  const FW = w * 9, back = w * (floor === "wood" ? floorBack : 6), front = w * 1.1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: `${x}px ${y}px` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: w * 2.9, perspectiveOrigin: `${x}px ${y - w * 0.25}px` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transformOrigin: "0 0",
          transform: `translate3d(${x}px, ${y}px, 0px) rotateX(${-elev}deg) rotateY(${yaw}deg)` }}>
          {floor && <div style={{ ...face, width: FW, height: back + front, background: floorBg(floor, FW, back, w, d),
            transform: `translate3d(${-FW / 2}px, ${td}px, ${-back}px) rotateX(90deg)` }} />}
          {/* deck: top, front edge, sides */}
          <div style={{ ...face, width: w, height: d, transform: `translate3d(${-w / 2}px, 0px, 0px) rotateX(90deg)`, borderRadius: `${w * 0.012}px ${w * 0.012}px ${w * 0.028}px ${w * 0.028}px`,
            background: "radial-gradient(ellipse 70% 60% at 35% 85%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%), linear-gradient(180deg, #B4B8BB 0%, #CDD0D2 14%, #D9DBDD 55%, #E1E3E4 100%)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)" }}>
            <Keyboard w={w} d={d} />
          </div>
          <div style={{ ...face, width: w, height: td, transform: `translate3d(${-w / 2}px, 0px, ${d}px)`, borderRadius: `0 0 ${td * 0.6}px ${td * 0.6}px`, background: "linear-gradient(180deg, #C3C6C9 0%, #8F9396 100%)" }} />
          <div style={{ ...face, width: d, height: td, transform: `translate3d(${-w / 2}px, 0px, 0px) rotateY(-90deg)`, background: metalEdge }} />
          <div style={{ ...face, width: d, height: td, transform: `translate3d(${w / 2}px, 0px, ${d}px) rotateY(90deg)`, background: metalEdge }} />
          {/* lid: the screen face, its top and side edges */}
          <div style={{ ...face, width: w, height: tl, transform: lid(`translate3d(0px, ${-h}px, 0px) rotateX(-90deg)`), background: "#9DA1A4" }} />
          <div style={{ ...face, width: tl, height: h, transform: lid(`translate3d(0px, ${-h}px, 0px) rotateY(90deg)`), background: metalEdge }} />
          <div style={{ ...face, width: tl, height: h, transform: lid(`translate3d(${w}px, ${-h}px, 0px) rotateY(90deg)`), background: metalEdge }} />
          <div style={{ ...face, width: w, height: h, transform: lid(`translate3d(0px, ${-h}px, 0px)`), borderRadius: `${w * 0.026}px ${w * 0.026}px ${w * 0.008}px ${w * 0.008}px`,
            background: "#0B0B0C", boxShadow: "inset 0 0 0 2px #3A3C3F" }}>
            <div style={{ position: "absolute", left: w / 2 - w * 0.004, top: bezT / 2 - w * 0.004, width: w * 0.008, height: w * 0.008, borderRadius: "50%", background: "#1D2124" }} />
            <div style={{ position: "absolute", left: bezS, top: bezT, width: scrW, height: scrW * 0.625, overflow: "hidden", borderRadius: w * 0.004 }}>
              <Scaled w={scrW} r={0}>{children}</Scaled>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 38%, rgba(255,255,255,0) 52%)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
