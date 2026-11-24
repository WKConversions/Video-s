// Their "How to win in Reddit marketing fireside chat" banner (digitalmarketingmalaga.com/eventos/reddit-marketing),
// rebuilt at the 1260 x 700 banner face so its type stays crisp (the site only has a 697-px PNG). Measured on that PNG
// (K = 1260 / 697): the same dark card, logo, cyan headline, the three speakers in their photo boxes with name and role.
// The venue line is left out on purpose (the client: they do not always host at the same coworking).
import React from "react";
import { Img, staticFile } from "remotion";
import { Logo, SANS } from "../kit";
import { BAN } from "./b3-kit";

const K = BAN.w / 697;
const BG = "#2C2C31";
/** a photo box: the region (x, y, w, h) of the 697-px banner, shown at face scale */
const Pic: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <div style={{ position: "absolute", left: x * K, top: y * K, width: w * K, height: h * K, overflow: "hidden" }}>
    <Img src={staticFile("img/banner-reddit.png")} style={{ position: "absolute", left: -x * K, top: -y * K, width: 697 * K, height: 388 * K }} />
  </div>
);
const Who: React.FC<{ cx: number; y: number; name: string; role: string }> = ({ cx, y, name, role }) => (
  <div style={{ position: "absolute", left: cx * K - 260, top: y * K, width: 520, textAlign: "center", color: "#fff", fontFamily: SANS, whiteSpace: "nowrap" }}>
    <div style={{ fontSize: 12.6 * K, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.005em" }}>{name}</div>
    <div style={{ fontSize: 6.9 * K, fontWeight: 500, lineHeight: 1.2, marginTop: 0.6 * K }}>{role}</div>
  </div>
);
/** the face's headline rows (face px), for the underline that draws under it */
export const REDDIT_HL = { left: 34 * K, bottom: 266 * K, when: 300 * K };

export const RedditFace: React.FC<{ shade?: number; children?: React.ReactNode }> = ({ shade = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: BAN.w, height: BAN.h }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 26 * K, background: BG, overflow: "hidden",
      filter: `brightness(${(1 - shade).toFixed(3)}) drop-shadow(0 0 28px rgba(20,24,30,0.08)) drop-shadow(0 0 90px rgba(20,24,30,0.11))` }}>
      <Logo size={14.8 * K} style={{ position: "absolute", left: 30 * K, top: 26 * K }} />
      <div style={{ position: "absolute", left: 18 * K, top: 103 * K, width: 306 * K, textAlign: "center", fontFamily: SANS, fontWeight: 500,
        fontSize: 45.5 * K, lineHeight: `${39 * K}px`, letterSpacing: "-0.035em", whiteSpace: "nowrap",
        backgroundImage: "linear-gradient(180deg, #5CD8EE 0%, #7EE0F6 55%, #A3E8FC 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
        How to win in<br />Reddit<br />marketing<br /><span style={{ fontStyle: "italic" }}>fireside chat</span>
      </div>
      <div style={{ position: "absolute", left: 30 * K, top: 293 * K, color: "#fff", fontFamily: SANS, fontSize: 11.2 * K, fontWeight: 500, whiteSpace: "nowrap" }}>
        <b style={{ fontWeight: 700 }}>When:</b> <b style={{ fontWeight: 700 }}>February 26</b>th 2026, 7 PM
      </div>
      <Pic x={338} y={28} w={135.5} h={135.5} />
      <Pic x={527} y={28} w={125.5} h={135.5} />
      <Pic x={430} y={206.5} w={135} h={135} />
      <Who cx={405.5} y={171} name="Belinda Conde" role="SVP Marketing @ Datos (Semrush)" />
      <Who cx={590} y={171} name="Pablo García" role="Senior Content Marketing Mgr @ Otera" />
      <Who cx={497.5} y={349} name="Alexandra M. Sims" role="Senior Marketing Mgr @ Oracle - Moderator" />
    </div>
    {children}
  </div>
);
