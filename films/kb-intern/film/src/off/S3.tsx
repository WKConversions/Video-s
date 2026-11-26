import React from "react";
import { Avatar, C, Card, F, INOUT, OUT, at, breathe, k, mix } from "../kit";
import { Exit, bar } from "./common";
import { w } from "./timing";

export const S3: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t1 }) => {
  const tk = k(t, w("hand"), 0.7), bub = k(t, w("comment"), 0.55, OUT);
  const sSt = k(t, w("status"), 0.4), sNx = k(t, w("next"), 0.4);
  const swap = k(t, w("assign"), 0.6, INOUT), roll = k(t, w("successor"), 0.6, INOUT);
  const pill = k(t, w("status"), 0.5);
  const bx = 1370, by = 420;
  return (
    <Exit t={t} t1={t1}>
      <div style={{ ...at(700, 600 + breathe(t, 6, 6.5)), opacity: tk, transform: `translate(-50%,-50%) translateY(${((1 - tk) * 28).toFixed(1)}px) scale(${(0.96 + 0.04 * tk).toFixed(4)})` }}>
        <Card w={660} h={560} pad={44}>
          <div style={bar(420, 30, "rgba(23,43,68,0.18)")} />
          <div style={{ ...bar(300, 22), marginTop: 22 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40 }}>
            <div style={{ width: 150, height: 46, borderRadius: 23, background: pill > 0 ? C.blue : C.ice2, opacity: 0.6 + 0.4 * pill, display: "flex", alignItems: "center", paddingLeft: 16 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: pill > 0 ? C.navy : C.blueS }} />
            </div>
            <div style={bar(180, 18)} />
          </div>
          <div style={{ ...bar(520), marginTop: 36 }} /><div style={{ ...bar(440), marginTop: 20 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 52 }}>
            <div style={{ position: "relative", width: 84, height: 84 }}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}><Avatar size={84} tone="blue" /></div>
              <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `scale(${(0.9 + 0.1 * swap).toFixed(3)})` }}><Avatar size={84} tone="navy" /></div>
            </div>
            <div style={{ position: "relative", height: 56, width: 280, overflow: "hidden", fontFamily: F, fontWeight: 800, fontSize: 44, color: C.navy, letterSpacing: "-0.03em" }}>
              <div style={{ position: "absolute", left: 0, top: roll * -64, lineHeight: "56px" }}>You</div>
              <div style={{ position: "absolute", left: 0, top: 64 - roll * 64, lineHeight: "56px" }}>Successor</div>
            </div>
          </div>
        </Card>
      </div>
      <div style={{ ...at(bx + breathe(t, 5, 6), by), opacity: bub, transformOrigin: "left bottom",
        transform: `translate(-50%,-50%) translateX(${((1 - bub) * -140).toFixed(1)}px) scale(${mix(0.4, 1, bub).toFixed(3)})` }}>
        <div style={{ background: C.navy, color: C.white, fontFamily: F, fontWeight: 800, fontSize: 52, borderRadius: 40, borderBottomLeftRadius: 8, padding: "34px 52px", whiteSpace: "nowrap",
          letterSpacing: "-0.03em", boxShadow: "0 18px 40px -18px rgba(23,43,68,0.4)", minWidth: 560 }}>
          <span style={{ opacity: sSt }}>Status</span> <span style={{ opacity: sNx, color: C.blue }}>· Next step</span>
        </div>
      </div>
    </Exit>
  );
};
