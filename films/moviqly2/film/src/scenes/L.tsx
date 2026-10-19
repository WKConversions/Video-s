// Scene L — "Click Export MP4." (sL → h4, builder 4; plan/storyboard.md).
// The cursor surfaces and presses Export MP4 in the header on "Click". A big twin of the button (size 40) stands forward
// out of it, under the header, mirroring its real states: "Export queued…", "Rendering 42%" … 100%, back to
// "Export MP4". The MP4 file chip drops from it and settles while the caption shows "Download MP4 ↓". The twin is
// carried back into the header button and the chip recedes into depth, ending exactly on Handoff4.
import React from "react";
import { C, CRAFT, ChatCalmer, Cursor, ExportButton, FONT, Handoff4, Ico, LAND, LEAVE, Preview, SHADOW_BIG, SNAP, Studio, clamp01, f, filmClock, k, kf, mix } from "../shared";
import { PANE, Veil } from "./I";
import { EXP } from "./K";

const TWIN = { r: 1770, t: 160, size: 44 };
const CHIP = { r: 1770, t: 304 };

export const SceneL: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sL") || g >= f("h4")) return null;
  const end = f("h4");
  if (g >= end - 2) return <Handoff4 g={g} />;
  const fc = filmClock(g);
  const ck = f("w:click"), rs = f("w:export") + 6, re = f("w:mp4") + 7;
  // the cursor: surfaces near the header, presses Export MP4 on "Click", then leaves
  const co = k(g, "sL", 0.25, LAND) * (1 - kf(g, ck + 6, 8, LEAVE));
  const mv = kf(g, f("sL"), ck - f("sL"), CRAFT);
  const cx = mix(1610, EXP.x, mv) + kf(g, ck + 6, 10, CRAFT) * 24, cy = mix(214, EXP.y + 4, mv) + kf(g, ck + 6, 10, CRAFT) * 30;
  const press = g < ck ? 0 : g < ck + 3 ? SNAP((g - ck) / 3) : 1 - SNAP(clamp01((g - ck - 3) / 5));
  // the button's real states, mirrored by the twin
  const state: "idle" | "queued" | number = g < ck + 2 ? "idle" : g < rs ? "queued" : g <= re ? 0.08 + 0.92 * clamp01((g - rs) / (re - rs)) : "idle";
  // the twin stands forward out of the header button, and is carried back into it at the end
  const tin = kf(g, ck + 1, 14, LAND), tout = kf(g, end - 13, 10, CRAFT);
  const tp = tin * (1 - tout);
  const push = 1 + 0.05 * kf(g, ck + 12, f("h4") - 12 - ck - 12, CRAFT);   // a slow push on the twin while it works
  const ts = mix(17 / TWIN.size, push, tp), tx = mix(EXP.r - TWIN.r, 0, tp), ty = mix(EXP.t - TWIN.t, 0, tp);
  const tOp = clamp01(tin * 3) * (1 - LEAVE(tout));
  // the file chip drops from the twin and settles; recedes into depth at the end
  const cin = kf(g, re - 1, 14, LAND), cout = kf(g, end - 13, 10, LEAVE);
  const download = g >= re + 2;
  const p = PANE;
  return (
    <>
      <Studio g={g} chat={<ChatCalmer g={g} />} exportEl={<ExportButton size={17} state={state} press={press} />}
        preview={<Preview w={p.w} h={p.h} ar={9 / 16} s={fc.s} calm={fc.calm} download={download} />} />
      <Veil a={0.4 * tp} />
      {cin > 0 && cout < 1 && (
        <div style={{ position: "absolute", right: 1920 - CHIP.r, top: mix(TWIN.t + 10, CHIP.t, cin), transformOrigin: "100% 0", transform: `scale(${mix(0.82, 1, cin) * mix(1, 0.86, cout)})`,
          opacity: clamp01(cin * 1.8) * (1 - cout), filter: cin < 1 || cout > 0 ? `blur(${(1 - cin) * 10 + cout * 10}px)` : undefined,
          display: "flex", alignItems: "center", gap: 16, padding: "16px 24px 16px 16px", background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG, fontFamily: FONT }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="file" s={30} c={C.lavenderInk} w={2.2} /></div>
          <div>
            <div style={{ fontSize: 25, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>moviqly-7c1e09ab.mp4</div>
            <div style={{ fontSize: 18, color: C.muted, marginTop: 2 }}>MP4 · 1080 × 1920 · 30 s</div>
          </div>
          <Ico n="download" s={28} c={C.violet} w={2.4} style={{ marginLeft: 8 }} />
        </div>
      )}
      {tOp > 0 && (
        <div style={{ position: "absolute", right: 1920 - TWIN.r, top: TWIN.t, transformOrigin: "100% 0", transform: `translate(${tx}px, ${ty}px) scale(${ts})`, opacity: tOp,
          borderRadius: TWIN.size * 0.55, boxShadow: `0 ${30 * tp}px ${60 * tp}px -${16 * tp}px rgba(70,40,200,${0.45 * tp})` }}>
          <ExportButton size={TWIN.size} state={state} press={press} />
        </div>
      )}
      {co > 0 && <Cursor x={cx} y={cy} press={press} o={co} />}
    </>
  );
};
