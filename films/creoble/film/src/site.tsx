// The example website Creoble builds in the film: "Café Salvie", a café (Creoble's "Restaurant / Café" branche), shown in a
// browser. Everything is driven by props so the film can build it, scroll it, recolour it and change it.
import React from "react";
import { Img, Loop, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F, SHADOW, clamp01, lerp, mix, rgba } from "./lib";
import { Icon } from "./icons";

export const THEMES = [
  { name: "Salvie", accent: C.sage, deep: C.sageDeep, tint: C.sageTint, hero: "#25332F" },
  { name: "Terrakotta", accent: C.terra, deep: C.terraDeep, tint: C.clay, hero: "#3A2A22" },
  { name: "Skov", accent: "#5E8A6F", deep: C.forest, tint: "#E6EFEA", hero: "#1E2C27" },
];
type Theme = typeof THEMES[number];
const mixTheme = (a: Theme, b: Theme, t: number): Theme => ({ name: t < 0.5 ? a.name : b.name, accent: mix(a.accent, b.accent, t),
  deep: mix(a.deep, b.deep, t), tint: mix(a.tint, b.tint, t), hero: mix(a.hero, b.hero, t) });
export const themeAt = (k: number) => {
  const i = Math.min(THEMES.length - 2, Math.max(0, Math.floor(k)));
  return mixTheme(THEMES[i], THEMES[i + 1], clamp01(k - i));
};

/** A browser window: the bar with its dots and address, and the page inside. */
export const Browser: React.FC<{ w: number; h: number; url: string; urlN?: number; lock?: boolean; children?: React.ReactNode; live?: number }> =
  ({ w, h, url, urlN, lock = true, children, live = 0 }) => (
    <div style={{ width: w, height: h, borderRadius: 26, background: C.white, boxShadow: SHADOW, overflow: "hidden", position: "relative",
      border: `1.5px solid ${rgba(C.ink, 0.06)}` }}>
      <div style={{ height: 58, background: C.cream, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: `1.5px solid ${C.line}` }}>
        {["#E8B4A6", "#EAD9A8", "#B8CFC6"].map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
        <div style={{ marginLeft: 22, flex: 1, maxWidth: 620, height: 36, borderRadius: 18, background: C.white, display: "flex", alignItems: "center", gap: 10,
          padding: "0 16px", border: `1.5px solid ${C.line}` }}>
          {lock && <Icon name="shield" size={18} color={live > 0.5 ? C.green : C.faint} stroke={2.2} />}
          <span style={{ fontFamily: F.ui, fontSize: 19, color: C.muted, whiteSpace: "nowrap" }}>{urlN === undefined ? url : url.slice(0, Math.floor(urlN))}</span>
        </div>
        {live > 0 && <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: mix(C.white, C.greenSoft, live), padding: "6px 14px",
          borderRadius: 16, fontFamily: F.ui, fontWeight: 600, fontSize: 17, color: C.green, opacity: live }}>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: C.green }} />Online</div>}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0, overflow: "hidden" }}>{children}</div>
    </div>
  );

/** Café Salvie's site. `scroll` px; `build` 0..1 per section (nav, hero, menu, about, contact): skeleton until it develops;
 *  `theme` index (fractional = between themes); `headScale` for the change asked in plain words. Width 1560. */
export const CafeSite: React.FC<{ g: number; scroll?: number; build?: number[]; theme?: number; headScale?: number; footFrom?: number; skeleton?: boolean }> =
  ({ g, scroll = 0, build = [1, 1, 1, 1, 1], theme = 0, headScale = 1, footFrom = 0 }) => {
    const T = themeAt(theme);
    const b = (i: number) => clamp01(build[i] ?? 1);
    const Skel: React.FC<{ w: number; h: number; r?: number; style?: React.CSSProperties }> = ({ w, h, r = 10, style }) =>
      <div style={{ width: w, height: h, borderRadius: r, background: "#ECEAE4", ...style }} />;
    return (
      <div style={{ width: 1560, position: "relative", transform: `translateY(${-scroll}px)`, background: C.page }}>
        {/* nav */}
        <div style={{ height: 92, display: "flex", alignItems: "center", padding: "0 56px", gap: 44, opacity: 0.25 + 0.75 * b(0) }}>
          {b(0) > 0.5 ? <span style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 36, color: C.ink }}>Café <span style={{ fontStyle: "italic", color: T.deep }}>Salvie</span></span>
            : <Skel w={220} h={26} />}
          <div style={{ marginLeft: "auto", display: "flex", gap: 40, alignItems: "center" }}>
            {["Menu", "Om os", "Kontakt"].map((l) => b(0) > 0.5 ? <span key={l} style={{ fontFamily: F.ui, fontSize: 24, color: C.muted }}>{l}</span> : <Skel key={l} w={80} h={16} />)}
            <div style={{ height: 54, padding: "0 26px", borderRadius: 27, background: b(0) > 0.5 ? T.deep : "#ECEAE4", color: "#fff", fontFamily: F.ui, fontWeight: 600,
              fontSize: 22, display: "flex", alignItems: "center" }}>{b(0) > 0.5 ? "Book et bord" : ""}</div>
          </div>
        </div>
        {/* hero */}
        {/* the hero's footage is the café itself: it arrives from the builder, so only its words build */}
        <div style={{ margin: "0 32px", height: 560, borderRadius: 30, overflow: "hidden", position: "relative", background: T.hero }}>
          {(
            <div style={{ position: "absolute", inset: 0 }}>
              <Loop durationInFrames={330} layout="none">
                <OffthreadVideo src={staticFile("footage/serving-coffee-in-a-cup-at-a-coffee-shop-3574.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Loop>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${rgba(T.hero, 0.78)} 0%, ${rgba(T.hero, 0.42)} 42%, ${rgba(T.hero, 0.0)} 70%)` }} />
            </div>
          )}
          {b(1) > 0 && (
            <div style={{ position: "absolute", left: 70, top: 130, opacity: clamp01(b(1) * 1.4 - 0.2) }}>
              <div style={{ fontFamily: F.serif, fontWeight: 400, fontSize: 80 * headScale, lineHeight: 1.06, color: "#fff", transformOrigin: "0 0" }}>
                Kaffe, kage<br />og <span style={{ fontStyle: "italic", color: mix(T.accent, "#FFFFFF", 0.35) }}>god tid</span>.
              </div>
              <div style={{ fontFamily: F.ui, fontSize: 26, color: rgba("#FFFFFF", 0.85), marginTop: 26 * headScale }}>Åbent hver dag · Hjemmebag og specialkaffe</div>
              <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
                <div style={{ height: 60, padding: "0 30px", borderRadius: 30, background: T.accent, color: C.white, fontFamily: F.ui, fontWeight: 600, fontSize: 23, display: "flex", alignItems: "center" }}>Se menuen</div>
                <div style={{ height: 60, padding: "0 30px", borderRadius: 30, border: "2px solid rgba(255,255,255,0.7)", color: C.white, fontFamily: F.ui, fontWeight: 600, fontSize: 23, display: "flex", alignItems: "center" }}>Book et bord</div>
              </div>
            </div>
          )}
        </div>
        {/* menu */}
        <div style={{ padding: "70px 56px 20px", opacity: 0.3 + 0.7 * b(2) }}>
          {b(2) > 0.5 ? <div style={{ fontFamily: F.serif, fontSize: 56, color: C.ink }}>Menuen</div> : <Skel w={240} h={44} />}
          <div style={{ display: "flex", gap: 28, marginTop: 34 }}>
            {[["Kaffe", "Specialkaffe fra lokale ristere"], ["Kage", "Bagt her hver morgen"], ["Frokost", "Sæsonens grønt"]].map(([h, s], i) => (
              <div key={i} style={{ flex: 1, height: 300, borderRadius: 26, background: b(2) > 0.5 ? (i === 0 ? T.tint : C.white) : "#F0EEE8", border: `1.5px solid ${C.line}`,
                overflow: "hidden", position: "relative", transform: `translateY(${40 * (1 - clamp01(b(2) * 3 - i))}px)`, opacity: clamp01(b(2) * 3 - i + 0.3) }}>
                {i === 0 && b(2) > 0.5 && (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Sequence from={footFrom} layout="none">
                      <OffthreadVideo src={staticFile("footage/coffee-in-green-mug-818.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Sequence>
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${rgba("#1D1B19", 0.7)}, transparent 60%)` }} />
                  </div>
                )}
                {b(2) > 0.5 && <div style={{ position: "absolute", left: 30, bottom: 28 }}>
                  <div style={{ fontFamily: F.serif, fontSize: 42, color: i === 0 ? "#fff" : C.ink }}>{h}</div>
                  <div style={{ fontFamily: F.ui, fontSize: 21, color: i === 0 ? rgba("#FFFFFF", 0.85) : C.muted, marginTop: 6 }}>{s}</div>
                </div>}
                {b(2) > 0.5 && i > 0 && <div style={{ position: "absolute", left: 30, top: 30, width: 70, height: 70, borderRadius: 22, background: T.tint, display: "flex",
                  alignItems: "center", justifyContent: "center" }}><Icon name={i === 1 ? "spark" : "grid"} size={36} color={T.deep} stroke={2} /></div>}
              </div>
            ))}
          </div>
        </div>
        {/* about */}
        <div style={{ display: "flex", gap: 44, padding: "70px 56px", alignItems: "center", opacity: 0.3 + 0.7 * b(3) }}>
          <div style={{ width: 700, height: 420, borderRadius: 30, overflow: "hidden", background: "#ECEAE4", position: "relative" }}>
            {b(3) > 0.5 && <Sequence from={footFrom} layout="none">
              <OffthreadVideo src={staticFile("footage/latte-art-810.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Sequence>}
          </div>
          <div style={{ flex: 1 }}>
            {b(3) > 0.5 ? <>
              <div style={{ fontFamily: F.serif, fontSize: 56, color: C.ink, lineHeight: 1.1 }}>Hver kop<br />med <span style={{ fontStyle: "italic", color: T.deep }}>omhu</span>.</div>
              <div style={{ fontFamily: F.ui, fontSize: 24, color: C.muted, marginTop: 22, lineHeight: 1.5 }}>Vi brygger, bager og serverer alt selv. Kig forbi til en kop og en snak.</div>
            </> : <><Skel w={420} h={44} /><Skel w={500} h={18} style={{ marginTop: 24 }} /><Skel w={460} h={18} style={{ marginTop: 12 }} /></>}
          </div>
        </div>
        {/* gallery */}
        <div style={{ padding: "0 56px 70px", opacity: 0.3 + 0.7 * b(4) }}>
          {b(4) > 0.5 ? <div style={{ fontFamily: F.serif, fontSize: 56, color: C.ink }}>Fra vores <span style={{ fontStyle: "italic", color: T.deep }}>bar</span></div> : <Skel w={300} h={44} />}
          <div style={{ display: "flex", gap: 28, marginTop: 34 }}>
            {["gal-latte.jpg", "gal-cup.jpg", "gal-bar.jpg"].map((f, i) => (
              <div key={f} style={{ flex: 1, height: 380, borderRadius: 26, overflow: "hidden", background: "#ECEAE4" }}>
                {b(4) > 0.5 && <Img src={staticFile(`img/${f}`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: clamp01(b(4) * 3 - i) }} />}
              </div>
            ))}
          </div>
        </div>
        {/* contact */}
        <div style={{ margin: "0 32px 40px", height: 260, borderRadius: 30, background: b(4) > 0.5 ? T.deep : "#ECEAE4", display: "flex", alignItems: "center", padding: "0 70px",
          justifyContent: "space-between", opacity: 0.3 + 0.7 * b(4) }}>
          {b(4) > 0.5 && <>
            <div style={{ fontFamily: F.serif, fontSize: 54, color: "#fff" }}>Kig <span style={{ fontStyle: "italic" }}>forbi</span>.</div>
            <div style={{ fontFamily: F.ui, fontSize: 24, color: rgba("#FFFFFF", 0.85), lineHeight: 1.6, textAlign: "right" }}>Åbent hver dag 8–17<br />Book bord online</div>
          </>}
        </div>
      </div>
    );
  };

export { lerp };
