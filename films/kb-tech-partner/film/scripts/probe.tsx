// The motion probe: wraps a film so each rendered frame reports where every visible element is (its box after all
// transforms, its effective opacity). scripts/motion_probe.mjs renders a project through it without screenshots and
// scripts/motion_probe.py reads the curves: exact motion, not motion guessed from pixels.
import React, { useEffect, useRef, useState } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";

// An element's identity: its path from the film's root, or from the nearest element named with data-probe="…", so
// a film that mounts and unmounts objects keeps each object's track (give the objects names: Obj's `name` prop in
// the desk film, or data-probe on any element).
const pathOf = (el: Element, root: Element) => {
  const p: string[] = [];
  for (let e: Element | null = el; e && e !== root; e = e.parentElement) {
    const name = (e as HTMLElement).dataset?.probe;
    if (name) { p.push(`@${name}`); break; }
    const par = e.parentElement; p.push(`${e.tagName.toLowerCase()}${par ? Array.prototype.indexOf.call(par.children, e) : 0}`);
  }
  return p.reverse().join("/");
};

export const withProbe = <P extends object>(Comp: React.ComponentType<P>): React.FC<P> => (props) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("probe"));
  useEffect(() => {
    let done = false;
    const measure = async () => {
      await document.fonts.ready;
      // wait until the film has drawn something (it may still be waiting for its own fonts)
      for (let i = 0; i < 60 && ref.current && ref.current.querySelectorAll("*").length < 5; i++) await new Promise((r) => setTimeout(r, 30));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const root = ref.current; if (!root || done) return;
      const op = new Map<Element, number>();
      const eff = (e: Element): number => {
        if (e === root) return 1; if (op.has(e)) return op.get(e)!;
        const o = parseFloat(getComputedStyle(e).opacity || "1") * (e.parentElement ? eff(e.parentElement) : 1); op.set(e, o); return o;
      };
      const out: (string | number)[][] = [];
      root.querySelectorAll("div, span, img, svg, path, circle, line").forEach((e) => {
        const r = e.getBoundingClientRect(); if (r.width * r.height < 64) return;
        if (r.right < -200 || r.left > 2120 || r.bottom < -200 || r.top > 1280) return;
        const o = eff(e); if (o < 0.02) return;
        const kids = e.children.length, txt = kids === 0 ? (e.textContent || "").trim().slice(0, 24) : "";
        out.push([pathOf(e, root), +r.left.toFixed(2), +r.top.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2), +o.toFixed(3), txt]);
      });
      console.log("PROBE " + JSON.stringify({ f: frame, els: out }));
      done = true; continueRender(handle);
    };
    measure();
    return () => { done = true; };
  }, [frame, handle]);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }}><Comp {...props} /></div>;
};
