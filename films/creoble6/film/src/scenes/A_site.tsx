// Scene A's site build: the Holm page of shared.tsx's HolmSite (the same markup, so the finished state equals
// <SiteWindow />), with every piece on its own progress so text, photos and layout arrive as three distinct phases.
// 1460 × 860 (the page view of SITE_WIN). All progress values 0..1; at 1 everything sits exactly as in HolmSite.
import React from "react";
import { Img, staticFile } from "remotion";
import { HOLM, SANS, clamp01, mix } from "../lib";
import { Ico } from "../shared";

export type Build = { h1: number; h2: number; para: number; frame: number[]; hero: number; cards: number[]; nav: number[]; btn: number };
const rise = (p: number, d = 24): React.CSSProperties => ({ opacity: Math.sin(clamp01(p * 1.8) * Math.PI / 2), transform: `translateY(${((1 - p) * d).toFixed(2)}px)` });
const land = (p: number): React.CSSProperties => ({ opacity: Math.sin(clamp01(p * 2.5) * Math.PI / 2), transform: `translateY(${((1 - p) * 180).toFixed(2)}px) scale(${mix(0.88, 1, p).toFixed(4)})` });
const frame = (p: number, gone: number, r: number): React.CSSProperties => ({ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(90deg,#E6E1D9,#EFEBE4,#E6E1D9)", opacity: Math.sin(clamp01(p * 1.5) * Math.PI / 2) * (1 - clamp01(gone * 1.5)), transform: `translateY(${((1 - p) * 160).toFixed(2)}px)` });
const photo = (src: string, st: React.CSSProperties = {}) => <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...st }} />;

export const SiteBuild: React.FC<{ b: Build }> = ({ b }) => (
  <div style={{ width: 1460, height: 860, overflow: "hidden", position: "relative", background: HOLM.bg }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1460, height: 1500, fontFamily: SANS, color: HOLM.ink }}>
      {/* navigation: the mark, the name, the links, left to right */}
      <div style={{ position: "absolute", left: 70, top: 34, width: 1320, height: 46, display: "flex", alignItems: "center" }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: HOLM.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 17, ...rise(b.nav[0], 44) }}>H</div>
        <div style={{ marginLeft: 12, fontWeight: 600, fontSize: 21, letterSpacing: "-0.01em", ...rise(b.nav[1], 44) }}>Holm Fysioterapi</div>
        <div style={{ flex: 1 }} />
        {["Behandlinger", "Om os", "Priser", "Kontakt"].map((x, i) => <div key={x} style={{ marginLeft: 38, fontSize: 17, color: HOLM.muted, ...rise(b.nav[2 + i], 44) }}>{x}</div>)}
      </div>
      {/* headline: two lines, each rising into the page from well below */}
      {["Kom godt i", "bevægelse igen."].map((l, i) => { const p = i === 0 ? b.h1 : b.h2; return p > 0 && (
        <div key={l} style={{ position: "absolute", left: 70, top: 168 + i * 76, fontSize: 76, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0, whiteSpace: "nowrap", ...rise(p, 260) }}>{l}</div>); })}
      <div style={{ position: "absolute", left: 70, top: 420, width: 560, height: 96 }}>
        <div style={{ fontSize: 21, lineHeight: 1.5, color: HOLM.muted, ...rise(b.para, 200) }}>Fysioterapi og genoptræning på Frederiksberg. Vi finder årsagen og lægger en plan, der passer til dig.</div>
      </div>
      {/* hero photo: its frame first, then the photo lands in it */}
      <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560 }}>
        <div style={frame(b.frame[0], b.hero, 24)} />
        {/* the photo slides up into its frame */}
        <div style={{ width: 630, height: 560, borderRadius: 24, overflow: "hidden" }}>{b.hero > 0 && photo("holm-shoulder.jpg", { transform: `translateY(${((1 - b.hero) * 560).toFixed(2)}px)` })}</div>
      </div>
      {/* button */}
      <div style={{ position: "absolute", left: 70, top: 556, width: 560, height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 64 }}>
          <div style={{ width: 0, overflow: "hidden", flex: "none", opacity: 0 }} />
          <div style={{ height: 58, padding: "0 26px", borderRadius: 999, border: `1.5px solid ${HOLM.ink}22`, display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 18, flex: "none", ...rise(b.btn, 60) }}>Se behandlinger <Ico n="arrow" s={18} c={HOLM.ink} w={2.4} /></div>
        </div>
      </div>
      {/* the three service cards: frames, then the photos land left to right */}
      {[["Fysioterapi", "holm-neck.jpg"], ["Massage", "holm-calves.jpg"], ["Genoptræning", "holm-shoulder.jpg"]].map(([t, src], i) => (
        <div key={t} style={{ position: "absolute", left: 70 + i * 450, top: 760, width: 420, height: 400 }}>
          <div style={frame(b.frame[1 + i], b.cards[i], 22)} />
          <div style={{ width: 420, height: 400, borderRadius: 22, background: "#fff", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", transformOrigin: "50% 12%", ...land(b.cards[i]) }}>
            <div style={{ height: 270, overflow: "hidden" }}>{photo(src, { objectPosition: i === 2 ? "70% 30%" : "50% 50%" })}</div>
            <div style={{ padding: "22px 26px", fontSize: 24, fontWeight: 600 }}>{t}<div style={{ fontSize: 17, fontWeight: 400, color: HOLM.muted, marginTop: 6 }}>Læs mere →</div></div>
          </div>
        </div>))}
    </div>
  </div>
);
