import React from "react";
import { Avatar, C, Camera, Card, F, INOUT, OUT, Title, ToolIcon, at, k, mix } from "../kit";
import { warp } from "../kit";
import { Ambient, Cur, Exit, bar, entT, fl } from "./common";
import { w, wEnd } from "./timing";

const RED = "#E5484D";
export const S2: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const dIn = k(t, w("send"), 0.7), av = k(t, w("supervisor"), 0.7);
  const tStamp = w("written"), st = k(t, tStamp, 0.35, OUT);
  const tSlide = wEnd("approval"), slide = k(t, tSlide, 1.0, INOUT);
  const hl = k(t, w("confidential"), 0.8);
  const cx = mix(700, 1180, slide), cy = 600;
  const sc = mix(1, 0.6, slide);
  const op = 1 - Math.max(0, (slide - 0.85) / 0.15);
  const dash = k(t, w("supervisor"), 0.6);
  const pts: [number, number, number][] = [[13.2, 1000, 950], [14.5, 810, 650], [tSlide - 0.05, 810, 650], [tSlide + 1.0, 810 + 480, 650], [tSlide + 1.6, 1500, 900]];
  const tw = warp(t, [[14.4, 15.0], [tSlide - 0.1, tSlide + 0.5]]);
  return (
    <Exit t={t} t1={t1}><Camera t={tw} t0={t0} t1={t1}>
      <Ambient t={tw} seed={2} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: dash * (1 - slide * 0.6) }}>
        <line x1={1000} y1={610} x2={1250} y2={610} stroke={C.blue} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 22" strokeDashoffset={-t * 60} />
      </svg>
      <div style={{ ...at(1520, 600), opacity: av, transform: entT(av, 120, 0) }}>
        <div style={{ ...fl(tw, 4, 10), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ width: 260, height: 260, borderRadius: 64, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.5)" }}><Avatar size={200} /></div>
          <Title size={50}>Supervisor</Title>
        </div>
      </div>
      <div style={{ ...at(cx, cy), opacity: dIn * op, transform: `translate(-50%,-50%) translate(${((1 - dIn) * -120).toFixed(1)}px,${((1 - dIn) * 36).toFixed(1)}px) scale(${((0.93 + 0.07 * dIn) * sc).toFixed(4)})` }}>
        <div style={fl(tw, 1, 10)}>
          <Card w={600} h={700} pad={0} style={{ overflow: "hidden", position: "relative" }}>
            <div style={{ height: 92, background: "#1868DB", display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
              <ToolIcon tool="confluence" size={60} />
              <div style={bar(220, 16, "rgba(255,255,255,0.45)")} />
            </div>
            <div style={{ padding: "40px 44px" }}>
              <Title size={50} color={C.navy}>Internship report</Title>
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 26 }}>
                {[400, 320, 440, 360].map((rw, i) => { const p = k(t, w("send") + 0.3 + i * 0.12, 0.6); return <div key={i} style={{ ...bar(rw * p), opacity: p }} />; })}
                <div style={{ position: "relative", width: 480, height: 18 }}>
                  <div style={bar(480)} /><div style={{ position: "absolute", left: 0, top: 0, ...bar(480 * hl, 18, C.blue) }} />
                </div>
                <div style={bar(380 * k(t, w("send") + 0.9, 0.6))} /><div style={bar(300 * k(t, w("send") + 1.0, 0.6))} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 70, top: 420, opacity: st, transform: `rotate(-6deg) scale(${mix(1.15, 1, st).toFixed(4)})`,
              border: `8px solid ${RED}`, borderRadius: 18, padding: "14px 26px", color: RED, fontFamily: F, fontWeight: 800, fontSize: 42, whiteSpace: "nowrap",
              background: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>K.B approval needed</div>
          </Card>
        </div>
      </div>
      <Cur t={t} pts={pts} clicks={[tStamp, tSlide]} tin={13.2} tout={tSlide + 1.0} />
    </Camera></Exit>
  );
};
