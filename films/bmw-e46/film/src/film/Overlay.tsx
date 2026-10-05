// The words of the film: one title, one line and one spec per beat, a callout from the part to its words, and the
// small working read-outs (the sedan/coupé roof gap, the VANOS shift, the gear steps). Every claim is in
// harvest/facts.md. Type rises out of a short blur word by word; it leaves faster than it came.
import { loadFont } from "@remotion/fonts";
import React from "react";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";
import { COPY } from "./copy";
import { Rig, rigStateAt } from "./parts";
import { EASE, k, project, T } from "./timeline";

const fontHandle = delayRender("fonts");
Promise.all([400, 500, 600, 700].map((w) => loadFont({ family: "Barlow", url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: String(w) })))
  .then(() => continueRender(fontHandle)).catch(() => continueRender(fontHandle));

const INK = "#0E1116", SUB = "#3B4351", BLUE = "#1C69D4", GREY = "#8A93A3";

/** words rising out of a blur, staggered; leave = the frame they start to leave */
const Words: React.FC<{ g: number; text: string; at: number; leave: number; style: React.CSSProperties; stagger?: number; dur?: number; accent?: string[] }> = ({
  g, text, at, leave, style, stagger = 3, dur = 14, accent = [] }) => {
  const words = text.split(" ");
  const out = Math.min(1, Math.max(0, (g - leave) / 9));
  const outE = EASE.depart(out);
  return (
    <div style={{ ...style, display: "flex", flexWrap: "wrap", columnGap: "0.26em" }}>
      {words.map((w, i) => {
        const p = Math.min(1, Math.max(0, (g - at - i * stagger) / dur));
        const e = EASE.arrive(p);
        return (
          <span key={i} style={{ display: "inline-block", willChange: "transform", opacity: e * (1 - outE),
            transform: `translateY(${(1 - e) * 26 - outE * 18}px)`, filter: `blur(${(1 - e) * 8 + outE * 4}px)`,
            color: accent.includes(w) ? BLUE : undefined }}>{w}</span>
        );
      })}
    </div>
  );
};

type Block = { title: string; line: string; spec: string };

const Label: React.FC<{ g: number; b: Block; at: number; leave: number; x: number; y: number; align?: "left" | "right" }> = ({ g, b, at, leave, x, y, align = "left" }) => {
  const rule = EASE.arrive(Math.min(1, Math.max(0, (g - at - 10) / 16))) * (1 - EASE.depart(Math.min(1, Math.max(0, (g - leave) / 9))));
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? 1920 - x : undefined, top: y, width: 640,
      display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end", textAlign: align }}>
      <Words g={g} text={b.title} at={at} leave={leave} style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 76, lineHeight: 1.0, color: INK, letterSpacing: "-0.01em" }} />
      <Words g={g} text={b.line} at={at + 7} leave={leave + 2} stagger={2} style={{ fontFamily: "Barlow", fontWeight: 400, fontSize: 36, lineHeight: 1.22, color: SUB, marginTop: 16, maxWidth: 600, justifyContent: align === "right" ? "flex-end" : "flex-start" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, flexDirection: align === "right" ? "row-reverse" : "row" }}>
        <div style={{ width: 44 * rule, height: 3, background: BLUE, borderRadius: 2 }} />
        <Words g={g} text={b.spec} at={at + 14} leave={leave + 3} stagger={2} style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 25, letterSpacing: "0.08em", color: BLUE, textTransform: "uppercase" }} />
      </div>
    </div>
  );
};

/** callout: a ring on the part, a line with one elbow to the words */
const Callout: React.FC<{ g: number; from: { x: number; y: number }; to: { x: number; y: number }; at: number; leave: number }> = ({ g, from, to, at, leave }) => {
  const p = EASE.move(Math.min(1, Math.max(0, (g - at) / 16)));
  const o = 1 - EASE.depart(Math.min(1, Math.max(0, (g - leave) / 8)));
  const elbow = { x: to.x + (from.x > to.x ? 60 : -60), y: to.y };
  const pts = [from, { x: elbow.x, y: from.y + (to.y - from.y) * 0.0 }, elbow, to];
  const d = `M ${from.x} ${from.y} L ${elbow.x} ${elbow.y} L ${to.x} ${to.y}`;
  const len = Math.hypot(elbow.x - from.x, elbow.y - from.y) + Math.hypot(to.x - elbow.x, to.y - elbow.y);
  void pts;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <path d={d} fill="none" stroke={BLUE} strokeWidth={2.5} strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
      <circle cx={from.x} cy={from.y} r={9 * Math.min(1, p * 3)} fill="none" stroke={BLUE} strokeWidth={3} />
      <circle cx={from.x} cy={from.y} r={3.5 * Math.min(1, p * 3)} fill={BLUE} />
    </svg>
  );
};

export const Overlay: React.FC<{ g: number; M: THREE.Matrix4; lift: number; rig: Rig | null; ghost: { ghostIn: number; ghostDrop: number } }> = ({ g, M, lift, rig, ghost }) => {
  const { width, height } = useVideoConfig();
  const f = (pos: string) => T.f(pos);
  const st = rigStateAt(g);
  const scr = (car: THREE.Vector3) => project(g, car.clone().applyMatrix4(M), width, height);
  const part = (name: string, off: THREE.Vector3, fallback: THREE.Vector3) => {
    const c = rig?.centre[name] ?? fallback;
    return scr(c.clone().add(off));
  };
  // anchors of the parts, following them out of the car
  const headUp = rig?.centre["cylinder_head"] && rig?.centre["engine_block"] ? rig.centre["cylinder_head"].clone().sub(rig.centre["engine_block"]).normalize() : new THREE.Vector3(0, 1, 0);
  const aHead = part("cylinder_head", headUp.clone().multiplyScalar(0.42 * st.head), new THREE.Vector3(1.2, 0.86, 0));
  const aVanos = part("vanos_unit", headUp.clone().multiplyScalar(0.42 * st.head).add(new THREE.Vector3(0.24 * st.vanos, 0, 0)), new THREE.Vector3(1.6, 0.92, 0));
  const aGear = part("gearbox_case", new THREE.Vector3(0, -0.36 * st.gearbox, 0), new THREE.Vector3(0.45, 0.38, 0));
  const aDiff = part("diff_housing", new THREE.Vector3(-0.30 * st.diff, -0.08 * st.diff, 0), new THREE.Vector3(-1.36, 0.33, 0));

  const gearOn = k(g, "gearbox+1.4", 0.4) * (1 - k(g, "diff-0.3", 0.3, EASE.depart));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* intro and outro titles */}
      <div style={{ position: "absolute", left: 132, top: 128 }}>
        <Words g={g} text={COPY.intro.title} at={f("intro+0.35")} leave={f("body+0.15")} accent={["330Ci"]}
          style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 92, color: INK, letterSpacing: "-0.015em" }} />
        <Words g={g} text={COPY.intro.sub} at={f("intro+0.9")} leave={f("body+0.2")}
          style={{ fontFamily: "Barlow", fontWeight: 500, fontSize: 34, color: SUB, marginTop: 10, letterSpacing: "0.04em" }} />
      </div>
      <div style={{ position: "absolute", left: 132, top: 128 }}>
        <Words g={g} text={COPY.outro.title} at={f("outro+1.0")} leave={f("end+1")} accent={["330Ci"]}
          style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 92, color: INK, letterSpacing: "-0.015em" }} />
        <Words g={g} text={COPY.outro.sub} at={f("outro+1.5")} leave={f("end+1")}
          style={{ fontFamily: "Barlow", fontWeight: 500, fontSize: 34, color: SUB, marginTop: 10, letterSpacing: "0.04em" }} />
      </div>

      {/* body */}
      <Label g={g} b={COPY.body} at={f("body+0.45")} leave={f("lift-0.1")} x={132} y={110} />
      {ghost.ghostIn > 0.02 && (() => {
        // the two roof lines at s = 2680 mm, where the sedan stands 46 mm above the coupé
        const X = (2136.5 - 2680) / 1000;
        const yS = 1.414 - (1.414 - 1.368) * ghost.ghostDrop, yC = 1.368;
        const pS = scr(new THREE.Vector3(X, yS + lift + 0.006, 0)), pC = scr(new THREE.Vector3(X, yC + lift + 0.006, 0));
        const endS = scr(new THREE.Vector3((2136.5 - 3700) / 1000, (1.225 - (1.225 - 1.168) * ghost.ghostDrop) + lift, 0));
        const o = ghost.ghostIn;
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
              <line x1={pS.x} y1={pS.y - 14} x2={pS.x} y2={pC.y + 14} stroke={INK} strokeWidth={2} />
              <line x1={pS.x - 10} y1={pS.y} x2={pS.x + 10} y2={pS.y} stroke={GREY} strokeWidth={2} />
              <line x1={pC.x - 10} y1={pC.y} x2={pC.x + 10} y2={pC.y} stroke={BLUE} strokeWidth={2} />
            </svg>
            <div style={{ position: "absolute", left: pS.x - 100, width: 200, textAlign: "center", top: pS.y - 66, opacity: o,
              fontFamily: "Barlow", fontWeight: 700, fontSize: 40, color: BLUE }}>{COPY.bodyTags.gap}</div>
            <div style={{ position: "absolute", left: endS.x - 260, width: 240, textAlign: "right", top: endS.y - 34, opacity: o * (1 - ghost.ghostDrop),
              fontFamily: "Barlow", fontWeight: 600, fontSize: 26, color: GREY, letterSpacing: "0.08em", textTransform: "uppercase" }}>{COPY.bodyTags.sedan}</div>

          </>
        );
      })()}

      {/* the parts */}
      <Callout g={g} from={aHead} to={{ x: 760, y: 236 }} at={f("head+0.45")} leave={f("vanos+0.05")} />
      <Label g={g} b={COPY.head} at={f("head+0.55")} leave={f("vanos")} x={132} y={130} />
      <Callout g={g} from={aVanos} to={{ x: 760, y: 236 }} at={f("vanos+0.6")} leave={f("vanos+3.75")} />
      <Label g={g} b={COPY.vanos} at={f("vanos+0.7")} leave={f("vanos+3.7")} x={132} y={130} />
      <Callout g={g} from={aGear} to={{ x: 760, y: 236 }} at={f("gearbox+0.55")} leave={f("diff-0.15")} />
      <Label g={g} b={COPY.gearbox} at={f("gearbox+0.65")} leave={f("diff-0.2")} x={132} y={130} />
      <Callout g={g} from={aDiff} to={{ x: 1160, y: 236 }} at={f("diff+0.75")} leave={f("outro-0.1")} />
      <Label g={g} b={COPY.diff} at={f("diff+0.85")} leave={f("outro-0.15")} x={1788} y={130} align="right" />

      {/* VANOS: the two sprockets turn against their camshafts; each shows its range */}
      {(() => {
        const o = k(g, "vanos+2.0", 0.4) * (1 - k(g, "vanos+3.5", 0.3, EASE.depart));
        if (o < 0.01 || !rig) return null;
        const off = headUp.clone().multiplyScalar(0.42 * st.head).add(new THREE.Vector3(0.24 * st.vanos + 0.06, 0, 0));
        const tags: [string, string][] = [["vanos_sprocket_intake", COPY.vanosTags.intake], ["vanos_sprocket_exhaust", COPY.vanosTags.exhaust]];
        return tags.map(([n, label], i) => {
          const c = rig.centre[n]; if (!c) return null;
          const p = scr(c.clone().add(off));
          return (
            <div key={n} style={{ position: "absolute", left: p.x + (i === 0 ? -250 : 40), top: p.y - (i === 0 ? 70 : -20), width: 210,
              textAlign: i === 0 ? "right" : "left", opacity: o, fontFamily: "Barlow", fontWeight: 700, fontSize: 30, color: BLUE }}>{label}</div>
          );
        });
      })()}

      {/* the differential: in a corner the outer wheel turns faster than the inner one */}
      {(() => {
        const o = k(g, "diff+2.8", 0.4) * (1 - k(g, "outro-0.2", 0.3, EASE.depart));
        if (o < 0.01) return null;
        const pL = scr(new THREE.Vector3(-1.3625, 0.318, -0.85)), pR = scr(new THREE.Vector3(-1.3625, 0.318, 0.85));
        return (
          <>
            <div style={{ position: "absolute", left: pR.x - 120, top: pR.y + 90, width: 240, textAlign: "center", opacity: o,
              fontFamily: "Barlow", fontWeight: 700, fontSize: 28, color: BLUE }}>{COPY.diffTags.outer}</div>
            <div style={{ position: "absolute", left: pL.x - 120, top: pL.y - 150, width: 240, textAlign: "center", opacity: o,
              fontFamily: "Barlow", fontWeight: 600, fontSize: 28, color: SUB }}>{COPY.diffTags.inner}</div>
          </>
        );
      })()}

      {/* gear read-out: 1 to 5 stepping */}
      {gearOn > 0.01 && (
        <div style={{ position: "absolute", left: 132, top: 470, display: "flex", gap: 14, opacity: gearOn }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} style={{ width: 58, height: 58, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Barlow", fontWeight: 600, fontSize: 30,
              background: n === st.gear ? BLUE : "rgba(14,17,22,0.06)", color: n === st.gear ? "#fff" : SUB }}>{n}</div>
          ))}
        </div>
      )}
    </div>
  );
};
