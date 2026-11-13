import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
// @ts-ignore: plain JS modules
import { frameSvg, handKeys, K } from "./film.js";
// @ts-ignore
import { FPS } from "./timeline.js";
// @ts-ignore
import { MARK_URI } from "./markData.js";
import { Hand, handAt } from "./hand";

K.ASSET.mark = MARK_URI;
const HAND_SIZE = 170;
const FACES = [
  ["WF Headline", "stack-sans-headline.woff2", "200 700"], ["WF Inter", "inter.woff2", "100 900"],
  ["WF Mono", "fragment-mono.woff2", "400"], ["WF Mark", "manrope-latin-7.woff2", "800"],
];
const css = FACES.map(([fam, file, wt]) => `@font-face{font-family:'${fam}';src:url(${staticFile("fonts/" + file)}) format('woff2');font-weight:${wt}}`).join("\n");

const useFonts = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("wicflow fonts"));
  useEffect(() => {
    const el = document.createElement("style"); el.textContent = css; document.head.appendChild(el);
    Promise.all(['500 96px "WF Headline"', '400 40px "WF Inter"', '600 40px "WF Inter"', '400 40px "WF Mono"', '800 40px "WF Mark"']
      .map((f) => document.fonts.load(f, "Aa€’–·äö")))
      .then(() => { const img = new Image(); img.src = MARK_URI; return img.decode().catch(() => undefined); })
      .then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

export const Film: React.FC = () => {
  const frame = useCurrentFrame(), T = frame / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#0B1220" }} />;
  const keys = handKeys();
  const h = keys.length ? handAt(T * 30, keys, { size: HAND_SIZE }) : null;
  const onScreen = h && h.x > -HAND_SIZE && h.x < 1920 + HAND_SIZE && h.y > -HAND_SIZE && h.y < 1080 + HAND_SIZE * 1.2;
  return (
    <AbsoluteFill style={{ background: "#0B1220" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: frameSvg(T) }} />
      {onScreen && <Hand {...h} />}
    </AbsoluteFill>
  );
};
