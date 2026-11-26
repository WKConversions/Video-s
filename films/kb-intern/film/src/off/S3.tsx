import React from "react";
import { Avatar, C, Camera, Card, F, INOUT, OUT, ToolIcon, at, k, mix } from "../kit";
import { warp } from "../kit";
import { Ambient, Cur, Exit, bar, entT, fl, pulse } from "./common";
import { w } from "./timing";

export const S3: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const tk = k(t, w("hand"), 0.7), bub = k(t, w("comment"), 0.55, OUT);
  const sSt = k(t, w("status"), 0.4), sNx = k(t, w("next"), 0.4);
  const swap = k(t, w("assign"), 0.6, INOUT), roll = k(t, w("successor"), 0.6, INOUT);
  const pill = k(t, w("status"), 0.5);
  const tc = w("comment") - 0.1, ta = w("assign");
  const pts: [number, number, number][] = [[tc - 0.7, 1000, 950], [tc, 520, 500], [ta - 0.7, 540, 520], [ta, 520, 760], [ta + 1.3, 760, 900]];
  const act = t >= ta ? ta : t >= tc ? tc : 0;
  const tw = warp(t, [[tc - 0.1, tc + 0.5], [ta - 0.1, ta + 0.5]]);
  return (
    <Exit t={t} t1={t1}><Camera t={tw} t0={t0} t1={t1}>
      <Ambient t={tw} seed={3} />
      <div style={{ ...at(640, 610), opacity: tk, transform: entT(tk, -140, 40) }}>
        <div style={fl(tw, 5, 10)}>
          <Card w={700} h={600} pad={0} style={{ overflow: "hidden" }}>
            <div style={{ height: 76, background: "#0052CC", display: "flex", alignItems: "center", padding: "0 28px", gap: 20 }}>
              <ToolIcon tool="jira" size={50} /><div style={bar(200, 16, "rgba(255,255,255,0.45)")} />
            </div>
            <div style={{ padding: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, height: 56 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2684FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={24} height={24} viewBox="0 0 24 24"><path d="M6 3 H18 V21 L12 16 L6 21 Z" fill="#fff" /></svg>
                </div>
                <div style={bar(420, 30, "rgba(23,43,68,0.2)")} />
              </div>
              <div style={{ ...bar(520, 22), marginTop: 28 }} /><div style={{ ...bar(380, 22), marginTop: 20 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 36, height: 46 }}>
                <div style={{ width: 160, height: 46, borderRadius: 10, background: "#0052CC", opacity: 0.55 + 0.45 * pill, display: "flex", alignItems: "center", padding: "0 18px", gap: 12 }}>
                  <div style={bar(80, 12, "rgba(255,255,255,0.85)")} />
                </div>
                <div style={bar(160, 16)} />
              </div>
              <div style={{ marginTop: 40, height: 100, borderRadius: 18, border: `2.5px solid ${t >= ta - 0.1 ? "#2684FF" : C.line}`, display: "flex", alignItems: "center", gap: 24, padding: "0 22px", boxSizing: "border-box" }}>
                <div style={{ position: "relative", width: 72, height: 72 }}>
                  <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}><Avatar size={72} tone="blue" /></div>
                  <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `scale(${(0.9 + 0.1 * swap).toFixed(3)})` }}><Avatar size={72} tone="navy" /></div>
                </div>
                <div style={{ position: "relative", height: 56, width: 320, overflow: "hidden", fontFamily: F, fontWeight: 800, fontSize: 44, color: C.navy, letterSpacing: "-0.03em" }}>
                  <div style={{ position: "absolute", left: 0, top: roll * -64, lineHeight: "56px" }}>You</div>
                  <div style={{ position: "absolute", left: 0, top: 64 - roll * 64, lineHeight: "56px" }}>Successor</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div style={{ ...at(1360, 430), opacity: bub, transformOrigin: "left center", transform: `translate(-50%,-50%) translateX(${((1 - bub) * -200).toFixed(1)}px) scale(${mix(0.4, 1, bub).toFixed(3)})` }}>
        <div style={{ ...fl(tw, 6, 10), display: "flex", alignItems: "flex-start", gap: 22 }}>
          <Avatar size={64} tone="ice" style={{ marginTop: 4 }} />
          <div style={{ background: "#E9F2FF", color: C.navy, fontFamily: F, fontWeight: 800, fontSize: 50, borderRadius: 24, borderTopLeftRadius: 6, padding: "30px 46px", whiteSpace: "nowrap",
            letterSpacing: "-0.03em", boxShadow: "0 18px 40px -18px rgba(0,0,0,0.5)", minWidth: 500 }}>
            <span style={{ opacity: sSt }}>Status</span> <span style={{ opacity: sNx, color: "#0052CC" }}>· Next step</span>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}><div style={bar(150, 12, "rgba(23,43,68,0.15)")} /><div style={bar(90, 12, "rgba(23,43,68,0.15)")} /></div>
          </div>
        </div>
      </div>
      <Cur t={t} pts={pts} clicks={[tc, ta]} tin={tc - 0.7} tout={ta + 1.0} />
      {act > 0 && <div style={{ position: "absolute", left: 0, top: 0, opacity: 0 }}>{pulse(t, act)}</div>}
    </Camera></Exit>
  );
};
