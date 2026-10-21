// Builder 1 — B1, the hook (open → h1). plan/storyboard.md.
// "Din nye hjemmeside er få minutter væk." A sage hairline draws around the italic word and grows into the browser
// frame: the word becomes the website. On "minutter" a progress line runs along the frame's top and the skeleton
// fills in; on "Bygget af AI" a light-sage sweep resolves it into the real site and a Glass chip materializes.
// "Fortæl kort om din virksomhed": the frame morphs into Creoble's builder; the name types, Branche is chosen.
// "Creoble bygger hele siden": Næste presses, the rail ticks, the builder morphs back into the site, now shown as
// the whole page in a tall frame. "Ingen teknik": a code panel slides out from behind the page and back, dissolving.
// "Ingen skabeloner": identical grey templates come out from behind it and fall away while the page returns home.
import React from "react";
import {
  BAR, Browser, Builder, C, EXIT, Glass, HOME, Handoff1, HolmSite, INOUT, Ico, OUT, SANS, SHADOW, Statement, WIPE,
  aspring, clamp01, f, k, kf, mix, press, typed,
} from "../shared";

type R = { x: number; y: number; w: number; h: number };
const lerpR = (a: R, b: R, p: number): R => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), w: mix(a.w, b.w, p), h: mix(a.h, b.h, p) });

// the statement and the italic word's box (measured on a still: Fraunces 156 px at x 300, y 372)
const ST = { x: 300, y: 372, size: 156 };
const WORD: R = { x: 761, y: 386, w: 691, h: 180 };
const BUILD_R: R = { x: 130, y: 56, w: 1660, h: 968 };     // the builder, come forward (DM Sans 21 → 24 px)
const TALL: R = { x: 510, y: 55, w: 900, h: 971 };          // the whole page (1460 × 1500) in one frame

// The frame while it grows out of the word: the hairline (drawn, sage) becomes the window's edge; the fill, the
// shadow and the top bar arrive with the growth. At p = 1 it matches shared Browser exactly.
const GrowFrame: React.FC<{ r: R; p: number; draw: number; children?: React.ReactNode }> = ({ r, p, draw, children }) => {
  const rad = mix(12, 16, p), fill = OUT(clamp01(p * 1.4)), bar = OUT(clamp01((p - 0.45) / 0.55));
  const per = 2 * (r.w + r.h);
  const sw = mix(2, 1, OUT(p));
  const stroke = `color-mix(in srgb, ${C.sage} ${100 - 100 * OUT(p)}%, ${C.line})`;
  return (
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: rad, overflow: "hidden", background: `rgba(255,255,255,${fill})`,
        boxShadow: `0 2px 6px rgba(26,22,20,${0.05 * fill}), 0 40px 90px -40px rgba(26,22,20,${0.3 * fill})` }}>
        <div style={{ height: BAR, background: "#FBFAF7", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, position: "relative", opacity: bar }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#E4E0D9" }} />)}
          <div style={{ position: "absolute", left: "50%", top: 9, transform: "translateX(-50%)", height: 28, minWidth: 320, padding: "0 16px", borderRadius: 8, background: "#F1EEE8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SANS, fontSize: 15, color: C.muted, whiteSpace: "nowrap" }}>Forhåndsvisning</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: BAR, width: r.w, height: r.h - BAR, overflow: "hidden" }}>{children}</div>
      </div>
      <svg width={r.w} height={r.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <rect x={0} y={0} width={r.w} height={r.h} rx={rad} fill="none" stroke={stroke} strokeWidth={sw}
          strokeDasharray={per} strokeDashoffset={per * (1 - draw)} />
      </svg>
    </div>
  );
};

// the site's skeleton filling in (a soft mask from the top), the AI sweep and the progress line, inside the frame
const browse = (g: number) => 56 * k(g, "w:af", 1.7, INOUT);   // the finished page drifts as if being read
const SiteFill: React.FC<{ g: number; w: number; h: number }> = ({ g, w, h }) => {
  const m1 = k(g, "w:minutter+0.05", 0.5, OUT) * 0.16, m2 = k(g, "w:vk+0.27", 0.6, INOUT);
  const edge = (m1 + m2 * 0.98) * 100;
  const mask = edge >= 112 ? undefined : `linear-gradient(180deg, #000 0%, #000 ${edge - 5}%, transparent ${edge + 5}%)`;
  const sw = k(g, "w:bygget", 1.1, INOUT);
  const lp = k(g, "w:minutter", 0.6, INOUT), lo = 1 - k(g, "w:bygget", 0.4);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <HolmSite w={w} h={h} build={sw} scroll={browse(g)} />
      </div>
      {sw > 0 && sw < 1 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: mix(-0.7, 1.15, sw) * w, width: w * 0.55,
          background: `linear-gradient(105deg, rgba(168,196,187,0) 0%, rgba(168,196,187,0.42) 50%, rgba(168,196,187,0) 100%)` }} />
      )}
      {lp > 0 && lo > 0 && <div style={{ position: "absolute", left: 0, top: 0, height: 3, width: w * lp, background: C.sage, opacity: lo }} />}
    </>
  );
};

// a small dark code panel (a few lines of the HTML no one has to write)
const CODE = ['<section class="hero">', '  <h1>Kom godt i…</h1>', '  <a class="btn">', "</section>", ".hero { display: grid }"];
const CodePanel: React.FC<{ x: number; y: number; out: number }> = ({ x, y, out }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 400, height: 270, borderRadius: 16, background: C.ink, boxShadow: SHADOW, boxSizing: "border-box", padding: "26px 28px", opacity: 1 - out * 0.9 }}>
    <div style={{ display: "flex", gap: 7, marginBottom: 20 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#3A3431" }} />)}</div>
    {CODE.map((l, i) => {
      const q = clamp01(out * 1.8 - (CODE.length - 1 - i) * 0.16);
      return <div key={i} style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 21, lineHeight: "34px", whiteSpace: "pre", color: i === 4 ? C.sageLight : "#D9D3C9", opacity: 1 - q, transform: `translateX(${q * 40}px)` }}>{l}</div>;
    })}
  </div>
);

// one identical grey template thumbnail
const Template: React.FC<{ x: number; y: number; o: number; dy: number }> = ({ x, y, o, dy }) => (
  <div style={{ position: "absolute", left: x, top: y + dy, width: 330, height: 220, borderRadius: 14, background: "#EEEBE5", border: `1px solid ${C.line}`, boxSizing: "border-box", padding: 20, opacity: o }}>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 18, height: 18, borderRadius: 5, background: "#DAD6CF" }} /><div style={{ width: 70, height: 8, borderRadius: 4, background: "#DAD6CF" }} /><div style={{ flex: 1 }} />{[0, 1, 2].map((i) => <div key={i} style={{ width: 26, height: 6, borderRadius: 3, background: "#E0DCD5" }} />)}</div>
    <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
      <div style={{ flex: 1 }}><div style={{ height: 14, borderRadius: 5, background: "#D6D2CA", width: "90%" }} /><div style={{ height: 14, borderRadius: 5, background: "#D6D2CA", width: "70%", marginTop: 8 }} /><div style={{ height: 7, borderRadius: 4, background: "#E0DCD5", width: "85%", marginTop: 14 }} /><div style={{ height: 22, borderRadius: 11, background: "#D6D2CA", width: 70, marginTop: 14 }} /></div>
      <div style={{ width: 120, height: 96, borderRadius: 10, background: "#DFDBD4" }} />
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>{[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 26, borderRadius: 8, background: "#E3DFD8" }} />)}</div>
  </div>
);

const OPTIONS = ["Håndværker / Service", "Sundhed / Klinik", "Restaurant / Café"];  // the real builder's Branche options

export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("open") || g >= f("h1")) return null;
  if (g >= f("h1") - 1) return <Handoff1 />;

  /* ---- A: the word becomes the website ---- */
  const draw = k(g, "w:hjemmeside+0.1", 0.45, WIPE);
  const grow = Math.min(1, aspring(g, "w:hjemmeside+0.55", 0.7) / 0.995);   // springs out of the word, settles
  const words = [
    { t: "Din", at: "w:din" }, { t: "nye", at: "w:nye" }, { t: "hjemmeside", at: "w:hjemmeside", it: true },
    { t: "er", at: "w:er", br: true }, { t: "få", at: "w:f" }, { t: "minutter", at: "w:minutter" }, { t: "væk.", at: "w:vk" },
  ];

  /* ---- the frame's journey after it has grown ---- */
  const pC = k(g, "w:fortl", 0.8, INOUT);                    // site → builder (card morph)
  const pD = k(g, "w:bygger", 1.25, INOUT);                  // builder → the whole page
  const pE = k(g, "w:skabeloner+0.1", 0.6, INOUT);           // the whole page → home
  let r: R = HOME;
  if (g >= f("w:skabeloner+0.1")) r = lerpR(TALL, HOME, pE);
  else if (g >= f("w:bygger")) r = lerpR(BUILD_R, TALL, pD);
  else if (g >= f("w:fortl")) r = lerpR(HOME, BUILD_R, pC);
  const siteO = g < f("w:bygger") ? 1 - k(g, "w:fortl", 0.4, INOUT) : k(g, "w:bygger+0.2", 0.5, INOUT);
  const bldO = g < f("w:bygger") ? k(g, "w:fortl+0.15", 0.45, INOUT) : 1 - k(g, "w:bygger", 0.45, INOUT);
  const push = 1 + 0.045 * k(g, "w:fortl+0.6", 2.0, INOUT) * (1 - pD);   // the builder keeps coming forward, slowly
  const url = (g >= f("w:fortl") && pC >= 0.5 && g < f("w:bygger")) || (g >= f("w:bygger") && pD < 0.5) ? "creoble.dk/builder" : "Forhåndsvisning";

  /* ---- the builder's state ---- */
  const s = r.w / 1440;
  const name = typed(g, "w:kort+0.07", "Holm Fysioterapi", 30);
  const ddOpen = aspring(g, "w:virksomhed", 0.35), ddClose = k(g, "w:virksomhed+0.5", 0.3, EXIT);
  const dd = ddOpen * (1 - ddClose);
  const hi = aspring(g, "w:virksomhed+0.2", 0.3), rowPress = press(g, "w:virksomhed+0.38", 0.06);
  const branche = g >= f("w:virksomhed+0.5") ? "Sundhed / Klinik" : "";
  const focus2 = g >= f("w:virksomhed") && g < f("w:creoble");
  const step = 8 * k(g, "w:creoble+0.08", 0.5, (t) => t);

  /* ---- the chip, the code panel, the templates ---- */
  const chip = aspring(g, "w:ai", 0.45) * (1 - k(g, "w:fortl", 0.3, EXIT));
  const cIn = aspring(g, "w:ingen", 0.4), cOut = k(g, "w:teknik+0.1", 0.5, INOUT);
  const codeX = mix(mix(TALL.x + 12, TALL.x - 52 - 400, cIn), TALL.x - 160, cOut);
  const tIn = (i: number) => aspring(g, (f("w:ingen2") + i) / 30, 0.35);
  const tFall = (i: number) => kf(g, f("w:skabeloner") + 1 + i, 11, (t) => t * t);   // gravity; all gone by h1 − 4

  const phaseA = grow < 1;
  return (
    <>
      {/* behind the frame: the code panel and the templates */}
      {g >= f("w:ingen") && cOut < 1 && <CodePanel x={codeX} y={405} out={cOut} />}
      {g >= f("w:ingen2") && [0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3, row = Math.floor(i / 3), ord = [0, 2, 1, 3, 5, 4][i];
        const tx = [120, 795, 1470][col], ty = [295, 565][row];
        const p = tIn(ord), fl = tFall(ord);
        const fromX = col === 0 ? TALL.x + 40 : col === 2 ? TALL.x + TALL.w - 370 : tx;
        if (fl >= 1) return null;
        return <Template key={i} x={mix(fromX, tx, p)} y={ty} o={clamp01(p * 3) * (1 - clamp01((fl - 0.1) / 0.6))} dy={fl * 320} />;
      })}

      {phaseA ? (
        <GrowFrame r={lerpR(WORD, HOME, grow)} p={grow} draw={draw}>
          {g >= f("w:minutter") - 2 && <SiteFill g={g} w={mix(WORD.w, HOME.w, grow)} h={mix(WORD.h, HOME.h, grow) - BAR} />}
        </GrowFrame>
      ) : (
        <Browser w={r.w} h={r.h} url={url} style={{ position: "absolute", left: r.x, top: r.y, transformOrigin: `${960 - r.x}px ${560 - r.y}px`, transform: push > 1 ? `scale(${push})` : undefined }}>
          {siteO > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: siteO }}>
              {g < f("w:fortl") ? <SiteFill g={g} w={r.w} h={r.h - BAR} /> : <HolmSite w={r.w} h={r.h - BAR} scroll={g < f("w:bygger") ? browse(g) : 0} />}
            </div>
          )}
          {bldO > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: bldO }}>
              <Builder w={r.w} name={name} caret={g >= f("w:kort") && g < f("w:virksomhed")} branche={branche} step={step} press={0.6 * press(g, "w:creoble")} g={g} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 860, transform: `scale(${s})`, transformOrigin: "0 0", fontFamily: SANS }}>
                {focus2 && <div style={{ position: "absolute", left: 450, top: FIELD2, width: 800, height: 64, borderRadius: 10, boxSizing: "border-box", border: `1.5px solid ${C.sage}`, boxShadow: `0 0 0 4px ${C.sageTint}` }} />}
                {dd > 0.001 && (
                  <div style={{ position: "absolute", left: 450, top: FIELD2 + 72, width: 800, borderRadius: 12, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW, padding: 8, boxSizing: "border-box",
                    transformOrigin: "50% 0", transform: `translateY(${(1 - dd) * -14}px)`, clipPath: `inset(0 0 ${(1 - dd) * 100}% 0 round 12px)`, opacity: clamp01(dd * 2.5) }}>
                    {OPTIONS.map((o, i) => (
                      <div key={o} style={{ height: 58, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 21, color: C.ink, gap: 12,
                        background: i === 1 ? `rgba(231,239,236,${hi})` : undefined, transform: i === 1 ? `scale(${1 - 0.03 * rowPress})` : undefined }}>
                        {o}<div style={{ flex: 1 }} />{i === 1 && hi > 0.05 && <Ico n="check" s={22} c={C.sageDeep} w={2.4} style={{ opacity: hi }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Browser>
      )}

      {/* the Glass chip: built with AI */}
      {chip > 0.001 && (
        <div style={{ position: "absolute", left: HOME.x + 30, top: HOME.y + HOME.h - 30 - 64 }}>
          <Glass p={chip} radius={999} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px 16px 20px", fontSize: 28, fontWeight: 500, transformOrigin: "0% 100%" }}>
            <Ico n="sparkle" s={28} c={C.sageDeep} w={2.2} fill={C.sageTint} />Bygget af AI
          </Glass>
        </div>
      )}

      {/* the hook statement, over everything */}
      <Statement g={g} words={words} x={ST.x} y={ST.y} size={ST.size} out="w:vk+0.05" />
    </>
  );
};

const FIELD2 = 384;   // the Branche input's top in the builder's design px
