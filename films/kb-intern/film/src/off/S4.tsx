import React from "react";
import { Card, Chip, Check, C, F, INOUT, Padlock, at, breathe, k, mix, OUT } from "../kit";
import { Exit } from "./common";
import { w } from "./timing";

const ITEMS: [string, number][] = [
  ["Equipment returned", w("return")], ["Data deleted", w("delete")], ["Passwords not shared", w("passwords")], ["Confirmed in writing", w("writing")],
];
const TOOLS = ["Jira", "Confluence", "Dolibarr", "1Password"];

export const S4: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t1 }) => {
  const cIn = k(t, 26.9, 0.7);
  const move = k(t, w("we'll") - 0.1, 0.8, INOUT);
  const cx = mix(960, 580, move);
  return (
    <Exit t={t} t1={t1}>
      <div style={{ ...at(cx, 590 + breathe(t, 6, 6.5)), opacity: cIn, transform: `translate(-50%,-50%) translateY(${((1 - cIn) * 28).toFixed(1)}px) scale(${(0.96 + 0.04 * cIn).toFixed(4)})` }}>
        <Card w={760} pad={44}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {ITEMS.map(([label, tt], i) => {
              const rin = k(t, 27.2 + i * 0.15, 0.5), p = k(t, tt, 0.55);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, height: 82, opacity: rin, transform: `translateX(${((1 - rin) * -30).toFixed(1)}px)`,
                  background: p > 0.4 ? C.ice : "transparent", borderRadius: 20, padding: "0 20px", fontFamily: F }}>
                  <Check size={62} p={p} />
                  <div style={{ fontWeight: p > 0.4 ? 800 : 600, fontSize: 44, color: p > 0.4 ? C.navy : C.muted, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      {TOOLS.map((name, i) => {
        const ein = k(t, w("we'll") + 0.1 + i * 0.1, 0.6);
        const f = k(t, w("access") + i * 0.35, 0.6, INOUT);
        return (
          <div key={name} style={{ ...at(1400, 330 + i * 140 + breathe(t + i, 4, 6)), opacity: ein, perspective: 900,
            transform: `translate(-50%,-50%) translateX(${((1 - ein) * 60).toFixed(1)}px)` }}>
            <div style={{ position: "relative", width: 480, height: 104, transformStyle: "preserve-3d", transform: `rotateX(${(f * 180).toFixed(1)}deg)` }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                <Chip name={name} size={40} style={{ width: 480, height: 104, boxSizing: "border-box", justifyContent: "center" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
                <Chip name="Access revoked" size={40} style={{ width: 480, height: 104, boxSizing: "border-box", justifyContent: "center", background: C.navy, color: C.white, border: "none" }}>
                  <Padlock size={34} body={C.blue} />
                </Chip>
              </div>
            </div>
          </div>
        );
      })}
    </Exit>
  );
};
export { OUT };
