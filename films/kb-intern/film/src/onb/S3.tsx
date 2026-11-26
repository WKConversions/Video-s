import React from "react";
import { C, F, INOUT, IN, k, enter, breathe, Chip, Shield, Title } from "../kit";
import { w } from "./timing";

type Props = { t: number; t0: number; t1: number };
const ROWS: [string, string, number][] = [["Jira", ": your work", w("jira")], ["Confluence", ": documentation", w("confluence")],
  ["Dolibarr", ": contacts and proposals", w("dolibar")], ["1Password", ": passwords", w("one")]];
const BADGE0 = w("two"), BADGE1 = w("authentication");
export const S3: React.FC<Props> = ({ t, t1 }) => {
  const dy = breathe(t, 6, 7);
  const out = k(t, t1 + 0.1, 0.8, IN);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${dy}px)` }}>
      {ROWS.map(([name, rest, tt], i) => {
        const p = k(t, tt - 0.1, 0.7);
        const bt = BADGE0 + (BADGE1 - BADGE0) * (i / 3) * 0.9;
        const b = k(t, bt, 0.5);
        const y = 330 + i * 130 + (1 - p) * 0;
        return (
          <div key={i} style={{ position: "absolute", left: 960, top: y, transform: `translate(calc(-50% + ${(1 - p) * 260}px), -50%)`, opacity: p }}>
            <Chip name={name} rest={rest} size={40}>
              <span style={{ display: "inline-block", width: 70 * b, height: 70, marginLeft: -10 * (1 - b), opacity: b, transform: `scale(${0.6 + 0.4 * b})`, overflow: "visible", position: "relative" }}>
                <Shield size={60} text="2FA" style={{ position: "absolute", left: 5, top: 0 }} />
              </span>
            </Chip>
          </div>
        );
      })}
      <Title size={52} weight={800} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 800, fontFamily: F, ...enter(k(t, w("always") - 0.1, 0.7)) }}>Always your K.B account</Title>
      <div style={{ display: "none", color: C.navy }}>{INOUT(0)}</div>
    </div>
  );
};
