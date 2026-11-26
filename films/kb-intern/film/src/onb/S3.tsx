import React from "react";
import { C, k, enter, Chip, Title, Camera, floatStyle, warp, Cursor, cursorAt, IN, mix, ToolIcon, INOUT, OUT } from "../kit";
import { w } from "./timing";
import { exitFx } from "./fx";

type Props = { t: number; t0: number; t1: number };
const ROWS: [string, string, "jira" | "confluence" | "dolibarr" | "1password", number][] = [["Jira", ": your work", "jira", w("jira")], ["Confluence", ": documentation", "confluence", w("confluence")],
  ["Dolibarr", ": contacts and proposals", "dolibarr", w("dolibar")], ["1Password", ": passwords", "1password", w("one")]];
const BADGE0 = w("two"), BADGE1 = w("authentication");
const Shield2: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: "relative", width: s, height: s * 1.15 }}>
    <svg width={s} height={s * 1.15} viewBox="0 0 100 115" style={{ position: "absolute", inset: 0 }}>
      <path d="M50 4 L92 18 V54 C92 82 74 100 50 111 C26 100 8 82 8 54 V18 Z" fill={C.blueS} />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: s * 0.08, fontWeight: 800, fontSize: s * 0.3, color: C.white }}>2FA</div>
  </div>
);
const chipW = (r: string, n: string) => 190 + (r.length + n.length) * 21;
export const S3: React.FC<Props> = ({ t, t0, t1 }) => {
  const wt = warp(t, ROWS.map((_, i) => { const b = BADGE0 + (BADGE1 - BADGE0) * (i / 3) * 0.9; return [b - 0.3, b + 0.4] as [number, number]; }));
  const bts = ROWS.map((_, i) => BADGE0 + (BADGE1 - BADGE0) * (i / 3) * 0.9);
  const ys = ROWS.map((_, i) => 330 + i * 130);
  const wp: [number, number, number][] = [[BADGE0 - 0.9, 1500, 220]];
  ROWS.forEach(([n, r], i) => { const x = 960 + chipW(r, n) / 2 - 70; wp.push([bts[i] - 0.12, x, ys[i] + 4]); });
  wp.push([BADGE1 + 1.0, 1450, 800]);
  const cur = cursorAt(wp, t);
  const pressNow = bts.reduce((a, b) => (t >= b - 0.1 && t < b + 0.3 ? (t - b + 0.1) / 0.4 : a), 0);
  const curO = k(t, BADGE0 - 0.9, 0.4) * (1 - k(t, BADGE1 + 0.6, 0.4, IN));
  return (
    <Camera t={wt} t0={t0} t1={t1}>
      <div style={{ position: "absolute", inset: 0 }}>
        {ROWS.map(([name, rest, icon, tt], i) => {
          const p = k(t, tt - 0.1, 0.7);
          const b = k(t, bts[i], 0.5);
          const ex = exitFx(t, t1 + i * 0.1 - 0.1, -700, 0);
          return (
            <div key={i} style={{ position: "absolute", left: 960, top: ys[i], transform: `translate(calc(-50% + ${(1 - p) * 360}px), -50%)`, opacity: p }}>
              <div style={ex}><div style={floatStyle(wt, i * 3 + 2, 9)}>
                <Chip name={name} rest={rest} icon={icon} size={40}>
                  <span style={{ display: "inline-block", width: 70 * b, height: 70, opacity: b, transform: `scale(${mix(0.6, 1, b)})`, position: "relative" }}>
                    <span style={{ position: "absolute", left: 5, top: 0 }}><Shield2 s={60} /></span>
                  </span>
                </Chip>
              </div></div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, ...exitFx(t, t1, 0, 120) }}>
          <div style={floatStyle(wt, 9, 6)}>
            <Title size={56} style={{ textAlign: "center", ...enter(k(t, w("always") - 0.1, 0.7)) }}>Always your K.B account</Title>
          </div>
        </div>
      </div>
      {ROWS.map(([name, rest, icon, tt], i) => {
        // big icon: flies in from scattered points on "then your tools", holds in a floating row, then shrinks into its chip
        const tin = w("then") - 0.1 + i * 0.12, a = k(t, tin, 0.7);
        const from = [[-200, 200], [2100, 260], [-200, 900], [2100, 860]][i];
        const row = [960 + (i - 1.5) * 230, 520];
        const to = [960 - chipW(rest, name) / 2 + 46, ys[i]];
        const m = k(t, tt - 0.45, 0.5, INOUT);
        const gone = k(t, tt + 0.05, 0.2);
        if (a <= 0 || gone >= 1) return null;
        const f = floatStyle(t, 30 + i, 10 * (1 - m));
        const x = mix(mix(from[0], row[0], OUT(a)), to[0], m), y = mix(mix(from[1], row[1], OUT(a)), to[1], m);
        const size = mix(160, 60, m);
        return (
          <div key={"fly" + i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity: 1 - gone, transform: `rotate(${(1 - OUT(a)) * (i % 2 ? 40 : -40)}deg)` }}>
            <div style={f}><ToolIcon tool={icon} size={size} tile={m < 0.6} /></div>
          </div>
        );
      })}
      <Cursor x={cur.x} y={cur.y} press={pressNow} o={curO} />
    </Camera>
  );
};
