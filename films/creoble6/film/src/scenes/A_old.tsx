// Scene A's old web (Willads KEEP: "old websites and 'Siden kan ikke findes'"): five fictional dated Danish small-
// business sites from about 2006 and the old browser's error page, drawn in HTML/CSS. No images, no real domains
// (the address bar shows a path only), slightly desaturated so they sit quietly on the cream.
import React from "react";

export const OLD = { w: 1200, h: 760 };
export const ERR = { w: 1200, h: 640 };
const TIMES = "'Times New Roman', 'Liberation Serif', Times, serif";
const ARIAL = "Arial, 'Liberation Sans', Helvetica, sans-serif";
const VERDANA = "Verdana, 'DejaVu Sans', Geneva, sans-serif";
const bevel: React.CSSProperties = { background: "#D6D2CA", border: "3px solid", borderColor: "#FFFFFF #7C7A76 #7C7A76 #FFFFFF", boxSizing: "border-box" };
const inset: React.CSSProperties = { background: "#FFFFFF", border: "3px solid", borderColor: "#7C7A76 #FFFFFF #FFFFFF #7C7A76", boxSizing: "border-box" };
const LINK = "#2B3FB0";

// the old window: a grey title bar, an address row with a path, then the page (pageOpacity fades the page only, so
// the frame can become a doorway)
const CHROME = 80;
export const OldWindow: React.FC<{ w: number; h: number; title: string; path: string; pageOpacity?: number; children?: React.ReactNode }> = ({ w, h, title, path, pageOpacity = 1, children }) => (
  <div style={{ position: "relative", width: w, height: h, filter: "saturate(0.78)" }}>
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", border: "4px solid #B9B5AD", boxShadow: "0 0 0 1px #8C8982, 0 0 70px rgba(26,22,20,0.16), 0 0 180px rgba(26,22,20,0.14)" }} />
    <div style={{ position: "absolute", left: 4, top: 4, width: w - 8, height: 38, background: "linear-gradient(90deg, #6F7C92, #A9B3C4)", display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box",
      fontFamily: ARIAL, fontWeight: 700, fontSize: 21, color: "#FFFFFF", whiteSpace: "nowrap" }}>
      <span>{title}</span><div style={{ flex: 1 }} />
      {["_", "□", "×"].map((s) => <div key={s} style={{ ...bevel, width: 30, height: 26, marginLeft: 4, color: "#222", fontSize: 18, lineHeight: "18px", textAlign: "center" }}>{s}</div>)}
    </div>
    <div style={{ position: "absolute", left: 4, top: 42, width: w - 8, height: 38, background: "#D6D2CA", borderBottom: "2px solid #8C8982", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 10px", gap: 10,
      fontFamily: ARIAL, fontSize: 19, color: "#222", whiteSpace: "nowrap" }}>
      <span>Adresse</span><div style={{ ...inset, flex: 1, height: 28, padding: "0 8px", lineHeight: "22px" }}>{path}</div>
    </div>
    <div style={{ position: "absolute", left: 4, top: CHROME, width: w - 8, height: h - CHROME - 4, overflow: "hidden", opacity: pageOpacity }}>{children}</div>
  </div>
);

type Theme = { name: string; tag: string; path: string; font: string; bg: string; head: string; headInk: string; ink: string; layout: "center" | "side"; stripe?: boolean; hits: string };
const THEMES: Theme[] = [
  { name: "Jensens Bageri", tag: "Friskbagt brød hver morgen", path: "/forside.htm", font: VERDANA, layout: "center", stripe: false, hits: "004127",
    bg: "radial-gradient(circle at 12px 12px, #E2D6B8 3px, transparent 4px) 0 0 / 34px 34px, #EFE7D2", head: "#7B5E3C", headInk: "#F6E6A8", ink: "#3B2F22" },
  { name: "Hansen Tømrer & Snedker", tag: "Alt i tømrer- og snedkerarbejde", path: "/index.htm", font: TIMES, layout: "side", stripe: true, hits: "001893",
    bg: "repeating-linear-gradient(45deg, #D5DCE3 0 14px, #CCD4DC 14px 28px)", head: "#34506F", headInk: "#FFFFFF", ink: "#1E2A36" },
  { name: "Salon Lone", tag: "Dame- og herrefrisør", path: "/velkommen.htm", font: TIMES, layout: "center", stripe: false, hits: "000742",
    bg: "radial-gradient(circle at 20px 20px, #DCC8D8 5px, transparent 6px) 0 0 / 40px 40px, #EADDE6", head: "#7C5A7A", headInk: "#FBEFF7", ink: "#3A2A39" },
  { name: "Nielsen VVS", tag: "Din lokale VVS-installatør", path: "/forside.htm", font: ARIAL, layout: "side", stripe: false, hits: "012305",
    bg: "#F4F4EE", head: "#3F6187", headInk: "#FFFFFF", ink: "#1F2933" },
  { name: "Café Hjørnet", tag: "Kaffe, kage og smørrebrød", path: "/start.htm", font: VERDANA, layout: "center", stripe: true, hits: "003358",
    bg: "repeating-linear-gradient(0deg, #DCE3D4 0 22px, #D3DBCA 22px 44px)", head: "#3F5A46", headInk: "#F3EBC8", ink: "#24332A" },
];
const NAV = ["Forside", "Om os", "Priser", "Kontakt", "Gæstebog"];

// one old site (i = 0..4), in its window: OLD.w × OLD.h
export const OldSite: React.FC<{ i: number; pageOpacity?: number }> = ({ i, pageOpacity = 1 }) => {
  const t = THEMES[i % THEMES.length], side = t.layout === "side";
  const counter = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22 }}>
      <span>Besøgende:</span>
      <span style={{ background: "#141414", color: "#8BD68B", fontFamily: "'Liberation Mono', 'DejaVu Sans Mono', monospace", fontSize: 26, letterSpacing: "0.12em", padding: "2px 10px", border: "3px solid", borderColor: "#7C7A76 #FFFFFF #FFFFFF #7C7A76" }}>{t.hits}</span>
    </div>
  );
  const stripe = t.stripe && (
    <div style={{ height: 44, background: "repeating-linear-gradient(-45deg, #D9C25A 0 26px, #3A3A36 26px 52px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ background: "#D9C25A", color: "#2A2A26", fontFamily: ARIAL, fontWeight: 700, fontSize: 22, padding: "2px 18px", letterSpacing: "0.06em" }}>UNDER KONSTRUKTION</span>
    </div>
  );
  const body = (
    <>
      <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.15 }}>Velkommen til vores hjemmeside!</div>
      <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.5 }}>Her på siden kan du læse om os og vores priser. Ring eller kig forbi, vi står altid klar til at hjælpe dig.</div>
      <div style={{ marginTop: 20, display: "flex", gap: 34, justifyContent: side ? "flex-start" : "center", fontSize: 27, color: LINK, textDecoration: "underline" }}>
        <span>Klik her for priser</span><span>Skriv i gæstebogen</span>
      </div>
    </>
  );
  return (
    <OldWindow w={OLD.w} h={OLD.h} title={t.name} path={t.path} pageOpacity={pageOpacity}>
      <div style={{ position: "absolute", inset: 0, background: t.bg, fontFamily: t.font, color: t.ink, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 168, background: t.head, color: t.headInk, display: "flex", flexDirection: "column", alignItems: side ? "flex-start" : "center", justifyContent: "center", padding: "0 44px", borderBottom: "5px ridge #B9B5AD" }}>
          <div style={{ fontSize: side ? 68 : 84, fontWeight: 700, lineHeight: 1.05, whiteSpace: "nowrap", textShadow: "3px 3px 0 rgba(0,0,0,0.28)" }}>{t.name}</div>
          <div style={{ fontSize: 28, fontStyle: "italic", marginTop: 6 }}>{t.tag}</div>
        </div>
        {stripe}
        {side ? (
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ width: 250, background: "rgba(255,255,255,0.55)", borderRight: "3px solid #9A968E", padding: "24px 26px", display: "flex", flexDirection: "column", gap: 14, fontSize: 28, color: LINK, textDecoration: "underline" }}>
              {NAV.map((n) => <span key={n}>{n}</span>)}
            </div>
            <div style={{ flex: 1, padding: "28px 40px" }}>{body}</div>
          </div>
        ) : (
          <div style={{ flex: 1, padding: "22px 60px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 22 }}>
              {NAV.map((n) => <div key={n} style={{ ...bevel, padding: "6px 22px", fontFamily: ARIAL, fontSize: 24, color: "#1E1E1E" }}>{n}</div>)}
            </div>
            {body}
          </div>
        )}
        <div style={{ height: 62, borderTop: "3px solid #9A968E", background: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", padding: "0 40px", fontFamily: ARIAL, color: "#2A2A2A" }}>
          {counter}<div style={{ flex: 1 }} /><span style={{ fontSize: 22 }}>Sidst opdateret: 12.03.2009</span>
        </div>
      </div>
    </OldWindow>
  );
};

// the old browser's error page (ERR.w × ERR.h). p 0..1 loads the text from the top down (an old page arriving).
export const ErrorPage: React.FC<{ p?: number }> = ({ p = 1 }) => (
  <OldWindow w={ERR.w} h={ERR.h} title="Siden kan ikke findes" path="/kontakt.htm">
    <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: TIMES, color: "#111111" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)` }}>
        <div style={{ position: "absolute", left: 84, top: 92, fontSize: 104, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap", lineHeight: 1 }}>Siden kan ikke findes</div>
        <div style={{ position: "absolute", left: 84, top: 236, width: 1024, height: 3, background: "#8C8982" }} />
        <div style={{ position: "absolute", left: 84, top: 276, fontFamily: ARIAL, fontSize: 34, whiteSpace: "nowrap", color: "#2A2A2A" }}>HTTP 404 – Filen eller mappen blev ikke fundet.</div>
        <div style={{ ...bevel, position: "absolute", left: 84, top: 384, width: 220, height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ARIAL, fontSize: 32, color: "#1E1E1E" }}>Opdater</div>
      </div>
    </div>
  </OldWindow>
);
