// The websites Creoble builds in the film. The flower shop (Blomsterhuset Rosa) is the one the viewer watches being made:
// first in Creoble's own sage template, then recoloured to the shop's brand ("Ret farverne…"), then with its chatbot.
// The others fill the showcase collage: small Danish businesses, each with a site in its own style.
import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F, clamp01, mix } from "./lib";
import { Icon, Mark } from "./kit";

export const BASE_W = 1440, BASE_H = 900;

/** A clip or a still filling its box. A clip starts at film frame `from`. */
export const Media: React.FC<{ src: string; from?: number; pos?: string; style?: React.CSSProperties }> = ({ src, from = 0, pos = "50% 50%", style }) =>
  src.endsWith(".mp4") ? (
    <Sequence from={from} layout="none">
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block", ...style }} />
    </Sequence>
  ) : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block", ...style }} />;

/** The flower shop's colours: Creoble's template (sage) → the shop's brand (rose), by b 0..1. */
const pal = (b: number) => ({
  bg: mix("#FAFAF8", C.blush, b), ink: mix(C.ink, C.plum, b), accent: mix(C.sageDeep, C.rose, b), accentSoft: mix(C.sageTint, C.petal, b),
  muted: mix(C.muted, "#8A6A70", b), card: "#FFFFFF", band: mix(C.cream, "#F6E2DF", b),
});

/** Blomsterhuset Rosa, at 1440 × 900. build 0..1 brings its sections in; brand 0..1 recolours it; video plays the hero. */
export const FlowerSite: React.FC<{ build?: number; brand?: number; from?: number; video?: boolean; scroll?: number; h?: number }> =
  ({ build = 1, brand = 0, from = 0, video = true, scroll = 0, h = BASE_H }) => {
    const p = pal(brand);
    const sec = (i: number) => { const k = clamp01(build * 5 - i); return { opacity: k, transform: `translateY(${(1 - k) * 30}px)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }; };
    return (
      <div style={{ width: BASE_W, height: h, background: p.bg, position: "relative", overflow: "hidden", fontFamily: F.ui, color: p.ink }}>
        <div style={{ position: "absolute", left: 0, top: -scroll, width: BASE_W }}>
          {/* nav */}
          <div style={{ height: 92, display: "flex", alignItems: "center", padding: "0 64px", gap: 40, ...sec(0) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="flower" size={26} color="#fff" stroke={2} /></div>
              <div style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 500 }}>Blomsterhuset <i style={{ color: p.accent }}>Rosa</i></div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 34, fontSize: 18, color: p.muted }}>{["Buketter", "Bryllup", "Levering", "Om os"].map((t) => <span key={t}>{t}</span>)}</div>
            <div style={{ height: 50, padding: "0 26px", borderRadius: 25, background: p.ink, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18 }}>Bestil buket</div>
          </div>
          {/* hero */}
          <div style={{ display: "flex", padding: "38px 64px 0", gap: 56, height: 520 }}>
            <div style={{ width: 600, paddingTop: 40, ...sec(1) }}>
              <div style={{ display: "inline-flex", gap: 10, alignItems: "center", height: 40, padding: "0 18px", borderRadius: 20, background: p.accentSoft, color: p.accent, fontWeight: 600, fontSize: 17 }}>
                <Icon name="spark" size={20} color={p.accent} stroke={2.2} />Friske blomstre hver dag · København</div>
              <div style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 76, lineHeight: 1.04, letterSpacing: -1.5, marginTop: 26 }}>Blomster, bundet<br />med <i style={{ color: p.accent }}>kærlighed</i></div>
              <div style={{ fontSize: 21, lineHeight: 1.5, color: p.muted, marginTop: 24, width: 520 }}>Håndbundne buketter til hverdag og fest. Bestil før kl. 14 — vi leverer samme dag.</div>
              <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
                <div style={{ height: 62, padding: "0 32px", borderRadius: 31, background: p.accent, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 20 }}>Se buketter</div>
                <div style={{ height: 62, padding: "0 32px", borderRadius: 31, border: `2px solid ${p.ink}`, display: "flex", alignItems: "center", fontWeight: 600, fontSize: 20 }}>Levering</div>
              </div>
            </div>
            <div style={{ flex: 1, borderRadius: 32, overflow: "hidden", position: "relative", ...sec(2) }}>
              <Media src={video ? "footage/flower-shop-4742.mp4" : "img/stills/flowershop.jpg"} from={from} />
              <div style={{ position: "absolute", left: 24, bottom: 24, height: 54, padding: "0 22px", borderRadius: 27, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 18 }}>
                <Icon name="truck" size={24} color={p.accent} stroke={2.2} />Levering samme dag</div>
            </div>
          </div>
          {/* products */}
          <div style={{ padding: "44px 64px 0", ...sec(3) }}>
            <div style={{ fontFamily: F.serif, fontSize: 40, fontWeight: 500 }}>Ugens <i style={{ color: p.accent }}>buketter</i></div>
          </div>
          <div style={{ display: "flex", gap: 28, padding: "26px 64px 0", ...sec(4) }}>
            {[["img/stills/bouquet.jpg", "Forårsbuket", "349 kr."], ["img/stills/roses.jpg", "Roser i bundt", "299 kr."], ["img/stills/flowershop.jpg", "Brudebuket", "fra 895 kr."], ["img/gal-cup.jpg", "Gavekurv", "449 kr."]].map(([src, n, pz]) => (
              <div key={n} style={{ flex: 1, background: p.card, borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 30px -18px rgba(0,0,0,0.3)" }}>
                <div style={{ height: 210 }}><Media src={src} /></div>
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 600 }}><span>{n}</span><span style={{ color: p.accent }}>{pz}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

/** The chat widget's closed button (Creoble sites carry one, like creoble.dk's own). */
export const ChatButton: React.FC<{ size?: number; brand?: number; ping?: number }> = ({ size = 76, brand = 1, ping = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: mix(C.forest, C.rose, brand), display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
    boxShadow: `0 12px 30px -10px rgba(0,0,0,0.45), 0 0 0 ${ping * 18}px rgba(180,71,90,${0.25 * (1 - ping)})` }}>
    <Icon name="chat" size={size * 0.48} color="#fff" stroke={2.1} />
  </div>
);

/** A small business site for the showcase: a hero photo, a name, a line and a button, in its own palette. */
export type SiteSpec = { name: string; line: string; img: string; bg: string; ink: string; accent: string; serif?: boolean; dark?: boolean; layout?: "split" | "full" | "big" };
export const SITES: SiteSpec[] = [
  { name: "Kaffebaren", line: "Kaffe brygget med omhu", img: "img/gal-latte.jpg", bg: "#F4ECE2", ink: "#2B1D14", accent: "#9A5B32", serif: true, layout: "split" },
  { name: "Malerfirma Holm", line: "Vi maler — du nyder", img: "img/stills/painter.jpg", bg: "#FFFFFF", ink: "#15233A", accent: "#2F6FD6", layout: "full" },
  { name: "Rent & Roligt", line: "Rengøring du kan stole på", img: "img/stills/cleaning.jpg", bg: "#EEF5F2", ink: "#173A30", accent: "#2C8C6E", layout: "split" },
  { name: "Villa Solgården", line: "Ferie med udsigt", img: "img/stills/holiday.jpg", bg: "#1B2430", ink: "#FFFFFF", accent: "#E9B872", serif: true, dark: true, layout: "full" },
  { name: "Blomsterhuset Rosa", line: "Blomster, bundet med kærlighed", img: "img/stills/bouquet.jpg", bg: C.blush, ink: C.plum, accent: C.rose, serif: true, layout: "split" },
  { name: "Svøm & Sol", line: "Svømmeskole for hele familien", img: "img/stills/pool.jpg", bg: "#E8F4FA", ink: "#0E2F45", accent: "#1C8BC7", layout: "big" },
  { name: "Nordskov Hytter", line: "Ro mellem træerne", img: "img/stills/pines.jpg", bg: "#202A24", ink: "#F1F4EE", accent: "#9BC28A", serif: true, dark: true, layout: "split" },
  { name: "Café Gaden", line: "Brunch hele weekenden", img: "img/gal-bar.jpg", bg: "#FFF7EC", ink: "#3A2414", accent: "#D9772B", layout: "big" },
  { name: "Hjem & Ro", line: "Indretning med sjæl", img: "img/stills/home.jpg", bg: "#F3EFEA", ink: "#2D2A26", accent: "#7A6A55", serif: true, layout: "full" },
  { name: "Gadekøkkenet", line: "Mad fra hele verden", img: "img/stills/street.jpg", bg: "#FFFFFF", ink: "#222222", accent: "#C2412D", layout: "split" },
];

/** One showcase site at 1440 × 900. */
export const SiteCard: React.FC<{ s: SiteSpec }> = ({ s }) => {
  const head = { fontFamily: s.serif ? F.serif : F.ui, fontWeight: s.serif ? 500 : 700, letterSpacing: s.serif ? -1.5 : -2.5 } as const;
  const nav = (
    <div style={{ height: 90, display: "flex", alignItems: "center", padding: "0 60px", gap: 34, fontSize: 18, color: s.ink, position: "relative", zIndex: 2 }}>
      <div style={{ fontFamily: head.fontFamily, fontWeight: 700, fontSize: 26 }}>{s.name}</div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 30, opacity: 0.75 }}>{["Ydelser", "Priser", "Om os", "Kontakt"].map((t) => <span key={t}>{t}</span>)}</div>
      <div style={{ height: 48, padding: "0 24px", borderRadius: 24, background: s.accent, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600 }}>Kontakt os</div>
    </div>
  );
  if (s.layout === "full") return (
    <div style={{ width: BASE_W, height: BASE_H, background: s.bg, position: "relative", overflow: "hidden", fontFamily: F.ui }}>
      <div style={{ position: "absolute", inset: 0 }}><Media src={s.img} /></div>
      <div style={{ position: "absolute", inset: 0, background: s.dark ? "linear-gradient(90deg, rgba(10,14,20,0.8), rgba(10,14,20,0.1))" : "linear-gradient(90deg, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.0))" }} />
      {nav}
      <div style={{ position: "absolute", left: 60, top: 300, color: s.ink, width: 760 }}>
        <div style={{ ...head, fontSize: 96, lineHeight: 1.0 }}>{s.line}</div>
        <div style={{ display: "inline-flex", marginTop: 40, height: 64, padding: "0 34px", borderRadius: 32, background: s.accent, color: "#fff", alignItems: "center", fontWeight: 600, fontSize: 22 }}>Få et tilbud</div>
      </div>
    </div>
  );
  if (s.layout === "big") return (
    <div style={{ width: BASE_W, height: BASE_H, background: s.bg, position: "relative", overflow: "hidden", fontFamily: F.ui }}>
      {nav}
      <div style={{ position: "absolute", left: 40, right: 40, top: 110, ...head, fontSize: 230, lineHeight: 0.9, color: s.accent, letterSpacing: -10, whiteSpace: "nowrap" }}>{s.name.split(" ")[0]}</div>
      <div style={{ position: "absolute", right: 60, bottom: 60, width: 760, height: 420, borderRadius: 30, overflow: "hidden" }}><Media src={s.img} /></div>
      <div style={{ position: "absolute", left: 60, bottom: 160, width: 520, fontSize: 30, color: s.ink, fontWeight: 600, lineHeight: 1.25 }}>{s.line}</div>
    </div>
  );
  return (
    <div style={{ width: BASE_W, height: BASE_H, background: s.bg, position: "relative", overflow: "hidden", fontFamily: F.ui }}>
      {nav}
      <div style={{ position: "absolute", left: 60, top: 230, width: 620, color: s.ink }}>
        <div style={{ ...head, fontSize: 88, lineHeight: 1.02 }}>{s.line}</div>
        <div style={{ fontSize: 22, opacity: 0.7, marginTop: 26, lineHeight: 1.5 }}>Lokalt, personligt og altid til tiden. Ring eller book online.</div>
        <div style={{ display: "inline-flex", marginTop: 36, height: 64, padding: "0 34px", borderRadius: 32, background: s.accent, color: "#fff", alignItems: "center", fontWeight: 600, fontSize: 22 }}>Book nu</div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 130, width: 600, height: 700, borderRadius: 36, overflow: "hidden" }}><Media src={s.img} /></div>
    </div>
  );
};

/** A site scaled into a box of width w. */
export const Scaled: React.FC<{ w: number; children: React.ReactNode; r?: number; shadow?: string; style?: React.CSSProperties }> = ({ w, children, r = 18, shadow, style }) => {
  const s = w / BASE_W;
  return (
    <div style={{ width: w, height: BASE_H * s, borderRadius: r, overflow: "hidden", position: "relative", boxShadow: shadow, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

/** Browser chrome around a site. */
export const Browser: React.FC<{ w: number; url: string; children: React.ReactNode; dark?: boolean }> = ({ w, url, children }) => {
  const bar = w * 0.045;
  return (
    <div style={{ width: w, borderRadius: w * 0.014, overflow: "hidden", background: "#fff", boxShadow: "0 60px 120px -50px rgba(40,20,20,0.5), 0 2px 10px rgba(0,0,0,0.08)" }}>
      <div style={{ height: bar, background: "#F2F1EE", display: "flex", alignItems: "center", gap: bar * 0.22, padding: `0 ${bar * 0.4}px`, borderBottom: "1px solid #E4E2DC" }}>
        {["#F26B5E", "#F5BE4F", "#5FC454"].map((c) => <div key={c} style={{ width: bar * 0.26, height: bar * 0.26, borderRadius: bar, background: c }} />)}
        <div style={{ marginLeft: bar * 0.4, flex: 1, height: bar * 0.6, borderRadius: bar * 0.3, background: "#fff", display: "flex", alignItems: "center", gap: bar * 0.15, padding: `0 ${bar * 0.3}px`,
          fontFamily: F.ui, fontSize: bar * 0.32, color: "#45433F" }}><Icon name="lock" size={bar * 0.32} color="#6B6B68" stroke={2.2} />{url}</div>
      </div>
      <Scaled w={w} r={0}>{children}</Scaled>
    </div>
  );
};

export { Mark };
