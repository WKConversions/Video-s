import React from "react";
import { C, Camera, Card, Check, Chip, F, INOUT, Padlock, at, k, mix } from "../kit";
import { warp } from "../kit";
import { Ambient, Cur, Exit, bar, entT, fl } from "./common";
import { w } from "./timing";

const ITEMS: [string, number][] = [
  ["Equipment returned", w("return")], ["Data deleted", w("delete")], ["Passwords not shared", w("passwords")], ["Confirmed in writing", w("writing")],
];
const TOOLS: ["jira" | "confluence" | "dolibarr" | "1password", string][] = [["jira", "Jira"], ["confluence", "Confluence"], ["dolibarr", "Dolibarr"], ["1password", "1Password"]];

export const S4: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const cIn = k(t, 26.9, 0.7);
  const move = k(t, w("we'll") - 0.1, 0.8, INOUT);
  const cx = mix(960, 580, move);
  const tf = TOOLS.map((_, i) => w("access") + i * 0.35);
  const ev: [number, number, number][] = [
    ...ITEMS.map(([, tt], i) => [tt, 960 - 309, 480 + 108 * i] as [number, number, number]),
    ...tf.map((tt, i) => [tt - 0.05, 1330, 330 + 140 * i] as [number, number, number]),
  ].sort((a, b) => a[0] - b[0]);
  const pts: [number, number, number][] = [[ev[0][0] - 0.8, 1300, 950]];
  ev.forEach((e) => { pts.push([e[0] - 0.05, e[1], e[2]], [e[0] + 0.15, e[1], e[2]]); });
  pts.push([tf[3] + 1.2, 1500, 950]);
  const tw = warp(t, ev.map((e) => [e[0] - 0.1, e[0] + 0.4] as [number, number]));
  return (
    <Exit t={t} t1={t1}><Camera t={tw} t0={t0} t1={t1}>
      <Ambient t={tw} seed={4} />
      <div style={{ ...at(cx, 600), opacity: cIn, transform: entT(cIn, 0, 50) }}>
        <div style={fl(tw, 7, 9)}>
          <Card w={760} pad={0} style={{ overflow: "hidden" }}>
            <div style={{ height: 84, background: C.navy, display: "flex", alignItems: "center", padding: "0 36px", gap: 18, borderBottom: `4px solid ${C.blueS}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.blue }} /><div style={bar(240, 16, "rgba(255,255,255,0.35)")} />
            </div>
            <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", gap: 26 }}>
              {ITEMS.map(([label, tt], i) => {
                const rin = k(t, 27.2 + i * 0.1, 0.5), p = k(t, tt, 0.55);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, height: 82, opacity: rin, transform: `translateX(${((1 - rin) * -50).toFixed(1)}px)`,
                    background: p > 0.4 ? C.ice : "transparent", borderRadius: 20, padding: "0 20px", fontFamily: F }}>
                    <Check size={62} p={p} color={C.blueS} />
                    <div style={{ fontWeight: p > 0.4 ? 800 : 600, fontSize: 44, color: p > 0.4 ? C.navy : C.muted, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      {TOOLS.map(([icon, name], i) => {
        const ein = k(t, w("we'll") + 0.1 + i * 0.1, 0.6);
        const f = k(t, tf[i], 0.6, INOUT);
        return (
          <div key={name} style={{ ...at(1400, 330 + i * 140), opacity: ein, perspective: 900, transform: entT(ein, 160, 0) }}>
            <div style={fl(tw, 10 + i, 8)}>
              <div style={{ position: "relative", width: 500, height: 108, transformStyle: "preserve-3d", transform: `rotateY(${(f * 180).toFixed(1)}deg)` }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                  <Chip name={name} icon={icon} size={40} style={{ width: 500, height: 108, boxSizing: "border-box" }} />
                </div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <Chip name="Access revoked" size={40} style={{ width: 500, height: 108, boxSizing: "border-box", justifyContent: "center", background: C.navy, color: C.white, border: `3px solid ${C.blue}` }}>
                    <Padlock size={34} body={C.blue} />
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Cur t={t} pts={pts} clicks={ev.map((e) => e[0])} tin={ev[0][0] - 0.8} tout={tf[3] + 0.5} />
    </Camera></Exit>
  );
};
