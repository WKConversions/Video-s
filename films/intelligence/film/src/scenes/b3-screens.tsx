// B3: the platform's own screens with every example text covered and re-set (custom Fernwood / Nova content), in Shot px.
// Each Pg* draws a whole page (screen px or page px) so a lift-out is the same pixels as the stage.
import React from "react";
import { Crop, Cover, SW, Shot, T, C, k, OUT } from "../kit";
import { ITA, Tint } from "./b3-lib";

const DOC = "#0c1a28";            // offer / document body ink (sampled)
const ty = (ocrTop: number, size: number, lh: number) => ocrTop - (0.5 * lh * size - 0.376 * size); // line box top from the OCR ink top
const tz = (ocrTop: number, size: number, lh: number) => ty(ocrTop / 1.006, size, lh); // OCR y of the 2544 px screens (13, 14, 16, 17, 18) is stretched 0.6%
const S = (wt: number): React.CSSProperties => ({ fontWeight: wt });

// ------------------------------------------------------------------ 03 Offer, step 1 (transcript pasted in)
export const TRANSCRIPT = [
  "Lena (Fernwood): We're opening a second roastery in Utrecht in March and our website still looks like 2016.",
  "Sam (Nova): What should the new site do for you?",
  "Lena: Sell our beans online, subscriptions too, and take bookings for the café. We have about eight thousand for the website, maybe more for a brand refresh.",
  "Sam: When does it need to be live?",
  "Lena: Before the opening, the 14th of March.",
];
export type P03 = { at: number; step: number; ring: number; hov: number; prs: number };
export const Pg03: React.FC<{ t: number; p: P03 }> = ({ t, p }) => (
  <Shot n="03">
    {t >= p.at && <Cover x={760} y={346} w={420} h={40} c="#ffffff" />}
    {p.ring > 0.001 && <div style={{ position: "absolute", left: 745, top: 335, width: 1068, height: 347, borderRadius: 12, boxShadow: `0 0 0 ${2.5 * p.ring}px rgba(47,125,225,${0.55 * p.ring})`, boxSizing: "border-box" }} />}
    {t >= p.at && (
      <T x={770} y={ty(358, 17.1, 1.5)} w={1020} size={17.1} lh={1.5} color={C.ink}>
        {TRANSCRIPT.map((l, i) => {
          const q = k(t, p.at + i * p.step, 0.22, OUT);
          return <div key={i} style={{ opacity: q, transform: `translateY(${(1 - q) * 10}px)` }}>{l}</div>;
        })}
      </T>
    )}
    <Tint x={746} y={886} w={180} h={44} hov={p.hov} prs={p.prs} kind="btn" />
    {/* Earlier offers row */}
    <Cover x={735} y={1062} w={840} h={64} c="#ffffff" />
    <T x={741} y={ty(1074, 17.4, 1.3)} size={17.4} lh={1.3} weight={500} color={C.ink}>Offer for Studio Kade: website refresh</T>
    <T x={741} y={ty(1101, 14.6, 1.3)} size={14.6} lh={1.3} color={C.muted}>3 Nov 2026 · Sam van Dijk</T>
    <Cover x={0} y={1345} w={2559} h={7} c={C.page} />
  </Shot>
);

// ------------------------------------------------------------------ 13 / 14 the extraction page: 13 on top, 14 below (the same page scrolled by 601 px)
export const SUMMARY = "Fernwood Coffee Roasters is a specialty roaster with a café in Amsterdam, opening a second roastery in Utrecht in March. They want a new website with a webshop and a brand refresh before the opening.";
export type CardDef = { id: string; n: "13" | "14"; x: number; y: number; w: number; h: number; py: number; text: string };
export const CARDS: CardDef[] = [
  { id: "client", n: "13", x: 743, y: 470, w: 530, h: 205, py: 470, text: "Fernwood Coffee Roasters, Amsterdam; second roastery opening in Utrecht." },
  { id: "dm", n: "13", x: 1287, y: 470, w: 530, h: 205, py: 470, text: "Lena Vos, co-founder. She signs off on budget." },
  { id: "needs", n: "13", x: 743, y: 689, w: 530, h: 252, py: 689, text: "A new website with a webshop and subscriptions for beans, café table booking, and a refreshed brand." },
  { id: "problems", n: "13", x: 1287, y: 689, w: 530, h: 252, py: 689, text: "The current site is slow on mobile and can't sell online; orders come in by email." },
  { id: "budget", n: "13", x: 743, y: 955, w: 530, h: 252, py: 955, text: "Around €8,000 for the website; open to more for the brand refresh." },
  { id: "timeline", n: "13", x: 1287, y: 955, w: 530, h: 252, py: 955, text: "Live before the Utrecht opening on 14 March; first designs in January." },
  { id: "fit", n: "14", x: 743, y: 620, w: 530, h: 321, py: 1221, text: "Strong fit: an established local brand, a clear budget, and web plus brand is our core work." },
  { id: "risks", n: "14", x: 1287, y: 620, w: 530, h: 321, py: 1221, text: "Webshop platform not chosen yet; product photography not planned." },
];
export const CARD = Object.fromEntries(CARDS.map((c) => [c.id, c])) as Record<string, CardDef>;
export const liftRect = (id: string) => ({ x: CARD[id].x, y: CARD[id].py, w: CARD[id].w, h: 134 });
const CARD_BG = "#eff0f2";

const CardEl: React.FC<{ c: CardDef; top: number; op: number; dy: number; ring?: number }> = ({ c, top, op, dy, ring = 0 }) => (
  <div style={{ position: "absolute", left: c.x, top, opacity: op, transform: `translateY(${dy}px)` }}>
    <Crop n={c.n} x={c.x} y={c.y} w={c.w} h={c.h} r={17}>
      <Cover x={8} y={38} w={c.w - 16} h={c.h - 46} c={CARD_BG} />
      <T x={19} y={ty(46.3, 17.1, 1.368)} w={494} size={17.1} lh={1.368} color={C.ink}>{c.text}</T>
    </Crop>
    {ring > 0.001 && <div style={{ position: "absolute", inset: 0, borderRadius: 17, boxShadow: `0 0 0 ${3.5 * ring}px rgba(47,125,225,${0.7 * ring})` }} />}
  </div>
);

/** focus on the lifted cards: ring per card id (0..1); the other cards dim while any ring is up */
export type Foc = Record<string, number>;
export const SCROLL = 601; // screen 14 is screen 13 scrolled by this many px
export const Pg13: React.FC<{ t: number; at: number; foc?: Foc }> = ({ t, at, foc = {} }) => {
  const any = Math.max(0, ...Object.values(foc));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 2000 }}>
      <Shot n="13">
        <Cover x={730} y={366} w={1100} h={92} c="#ffffff" />
        <T x={744} y={tz(373, 18.6, 1.47)} w={1075} size={18.6} lh={1.47} color={DOC}>{SUMMARY}</T>
        <Cover x={730} y={466} w={1100} h={884} c="#ffffff" />
      </Shot>
      <div style={{ position: "absolute", left: 0, top: 1214, width: SW, height: 737, overflow: "hidden" }}>
        <Shot n="14" style={{ top: -613 }}>
          <Cover x={730} y={606} w={1100} h={342} c="#ffffff" />
          <Cover x={0} y={1338} w={2559} h={12} c={C.page} />
        </Shot>
      </div>
      {CARDS.map((c, i) => {
        const p = k(t, at + i * 0.04, 0.3, OUT), r = foc[c.id] ?? 0;
        return <CardEl key={c.id} c={c} top={c.py} op={Math.min(1, p * 1.6) * (1 - 0.5 * any * (1 - r))} dy={(1 - p) * 26} ring={r} />;
      })}
    </div>
  );
};
/** screen 14: the same page scrolled to its end ("What do you want to do with this?"), cards re-set */
export const Pg14: React.FC<{ hov: number; prs: number }> = ({ hov, prs }) => (
  <Shot n="14">
    <Cover x={730} y={76} w={1100} h={872} c="#ffffff" />
    {CARDS.map((c) => <CardEl key={c.id} c={c} top={c.n === "13" ? c.py - SCROLL : c.y} op={1} dy={0} />).slice(2)}
    <Cover x={0} y={1338} w={2559} h={12} c={C.page} />
    <Tint x={739} y={1032} w={140} h={46} hov={hov} prs={prs} />
  </Shot>
);

// ------------------------------------------------------------------ 16 / 17 the offer
const Bul: React.FC<{ x: number; top: number; lead: string; rest: string }> = ({ x, top, lead, rest }) => (
  <>
    <div style={{ position: "absolute", left: x, top: top / 1.006 + 4, width: 5.4, height: 5.4, borderRadius: 3, background: DOC }} />
    <T x={x + 17} y={tz(top, 18.2, 1.5)} w={1000} size={18.2} lh={1.5} color={DOC}><span style={S(600)}>{lead}</span>{rest}</T>
  </>
);
const TblRow: React.FC<{ y: number; a: string; b: string; bold?: boolean; last?: boolean }> = ({ y, a, b, bold, last }) => (
  <>
    {!last && <div style={{ position: "absolute", left: 765, top: y + 48, width: 1018, height: 1, background: C.line }} />}
    <T x={780} y={y + 11} size={16.4} lh={1.3} weight={bold ? 600 : 400} color={DOC}>{a}</T>
    <T x={1133} y={y + 11} size={16.4} lh={1.3} weight={bold ? 600 : 400} color={DOC}>{b}</T>
  </>
);
export const OFFER_TITLE = { x: 745, y: 392, w: 1110, h: 108 };
export const TABLE_RECT = { x: 745, y: 888, w: 1070, h: 296 };
export const Pg16: React.FC<{ foc?: { table: number; time: number }; logo?: { hov: number; prs: number } }> = ({ foc, logo }) => (
  <Shot n="16">
    <Cover x={745} y={405} w={1100} h={84} c="#ffffff" />
    <T x={768} y={tz(421, 33, 1.2)} size={33} lh={1.2} weight={700} head color={C.ink} style={{ whiteSpace: "nowrap" }}>Offer for Fernwood Coffee Roasters</T>
    <T x={768} y={tz(463, 17.2, 1.3)} size={17.2} lh={1.3} color="#5f666f" style={{ fontFamily: ITA, fontStyle: "italic", whiteSpace: "nowrap" }}>Prepared by Nova. Draft for discussion. Prices exclude VAT.</T>
    <Cover x={745} y={578} w={1100} h={102} c="#ffffff" />
    <T x={768} y={tz(589, 18.2, 1.565)} w={1040} size={18.2} lh={1.565} color={DOC}>Fernwood is opening a second roastery in Utrecht on <span style={S(600)}>14 March</span> and needs a website that sells beans online and takes café bookings, with a brand refresh to match.</T>
    <Cover x={745} y={722} w={1100} h={627} c="#ffffff" />
    <Bul x={772} top={736} lead="Brand refresh:" rest=" logo, colours and packaging labels" />
    <Bul x={772} top={768} lead="A new website" rest=" with webshop and bean subscriptions" />
    <Bul x={772} top={800} lead="Café table booking" rest="" />
    <Bul x={772} top={832} lead="Live before 14 March" rest="" />
    <T x={766} y={tz(912, 26, 1.2)} size={26} lh={1.2} weight={600} head color={C.ink}>Scope and price</T>
    <div style={{ position: "absolute", left: 764, top: 965, width: 1020, height: 197, borderRadius: 16, border: `1px solid ${C.line}`, boxSizing: "border-box" }} />
    <TblRow y={965} a="Brand refresh" b="€2,400" />
    <TblRow y={1013} a="Website design and build" b="€6,200" />
    <TblRow y={1062} a="Webshop and subscriptions" b="€1,800" />
    <TblRow y={1111} a="Total" b="€10,400" bold last />
    <T x={766} y={tz(1212, 26, 1.2)} size={26} lh={1.2} weight={600} head color={C.ink}>Timeline</T>
    <T x={768} y={tz(1262, 18.2, 1.565)} w={1040} size={18.2} lh={1.565} color={DOC}>First designs in January, launch on <span style={S(600)}>7 March</span>.</T>
    <Cover x={0} y={1345} w={2559} h={7} c={C.page} />
    <Cover x={711} y={1345} w={1138} h={7} c="#ffffff" />
    {foc && foc.table > 0.001 && <div style={{ position: "absolute", left: 764, top: 965, width: 1020, height: 197, borderRadius: 16, boxShadow: `0 0 0 ${3.5 * foc.table}px rgba(47,125,225,${0.7 * foc.table})` }} />}
    {foc && foc.time > 0.001 && <div style={{ position: "absolute", left: 754, top: 1198, width: 1050, height: 98, borderRadius: 14, boxShadow: `0 0 0 ${3.5 * foc.time}px rgba(47,125,225,${0.7 * foc.time})` }} />}
    {logo && <Tint x={700} y={14} w={76} h={42} hov={logo.hov} prs={logo.prs} />}
  </Shot>
);

const Num: React.FC<{ top: number; n: number; children: React.ReactNode }> = ({ top, n, children }) => (
  <T x={771} y={tz(top, 18.2, 1.5)} w={1000} size={18.2} lh={1.5} color={DOC}>{n}. {children}</T>
);
export const Pg17: React.FC = () => (
  <Shot n="17">
    {/* the end of the price table, re-set */}
    <Cover x={780} y={86} w={1000} h={30} c="#ffffff" />
    <Cover x={780} y={134} w={1000} h={30} c="#ffffff" />
    <T x={784} y={tz(95, 17.2, 1.3)} size={16.4} lh={1.3} color={DOC}>Webshop and subscriptions</T>
    <T x={1140} y={tz(95, 17.2, 1.3)} size={16.4} lh={1.3} color={DOC}>€1,800</T>
    <T x={784} y={tz(142, 17.2, 1.3)} size={16.4} lh={1.3} weight={600} color={DOC}>Total</T>
    <T x={1140} y={tz(142, 17.2, 1.3)} size={16.4} lh={1.3} weight={600} color={DOC}>€10,400</T>
    <Cover x={745} y={194} w={1100} h={210} c="#ffffff" />
    <T x={768} y={tz(207, 18.2, 1.565)} w={1040} size={18.2} lh={1.565} color={DOC}>If the budget is smaller than the full scope, we reduce the scope rather than the price. We do not discount, and we agree the scope before we start.</T>
    <T x={768} y={tz(292, 18.2, 1.565)} w={1040} size={18.2} lh={1.565} color={DOC}>Anything outside the scope above is quoted before we start.</T>
    {/* payment terms */}
    <Cover x={745} y={478} w={1100} h={250} c="#ffffff" />
    <Num top={491} n={1}><span style={S(600)}>40%</span> of the total at the start.</Num>
    <Num top={524} n={2}><span style={S(600)}>60%</span> at launch.</Num>
    <Num top={557} n={3}>Invoices are due within <span style={S(600)}>14 days</span>.</Num>
    <Num top={589} n={4}>Prices exclude VAT.</Num>
    {/* next step */}
    <Cover x={745} y={806} w={1100} h={290} c="#ffffff" />
    <T x={768} y={tz(817, 18.2, 1.565)} w={1040} size={18.2} lh={1.565} color={DOC}>A <span style={S(600)}>30-minute call</span> with Lena to confirm:</T>
    <Num top={862} n={1}><span style={S(600)}>The scope:</span> brand refresh, website, webshop and subscriptions.</Num>
    <Num top={895} n={2}><span style={S(600)}>The timeline:</span> first designs in January, launch on 7 March.</Num>
    <Num top={927} n={3}><span style={S(600)}>The start:</span> we begin on 12 January.</Num>
    <T x={768} y={tz(1078, 16.4, 1.3)} size={16.4} lh={1.3} color="#6c727b">Sam van Dijk and Daniel Bos, Nova</T>
    <Cover x={0} y={1345} w={2559} h={7} c={C.page} />
  </Shot>
);

// ------------------------------------------------------------------ 18 Sales strategy (source) with the doc text re-set
export const STRAT_RECT = { x: 936, y: 128, w: 470, h: 790 };
export const Pg18: React.FC = () => (
  <Shot n="18">
    <Cover x={962} y={528} w={420} h={822} c="#ffffff" />
    <T x={981} y={tz(541, 18.2, 1.56)} w={392} size={18.2} lh={1.56} color={DOC}>This document sets out how Nova sells: who we sell to, through which channels, how a deal runs, what we offer and at what price. Every How we work page and every playbook in Sales follows from it.</T>
    <T x={980} y={tz(738, 26.2, 1.2)} size={26.2} lh={1.2} weight={600} head color={C.ink} style={{ whiteSpace: "nowrap" }}>1. Purpose and philosophy</T>
    <T x={981} y={tz(791, 18.2, 1.56)} w={392} size={18.2} lh={1.56} color={DOC}><span style={S(600)}>In short:</span> Sales turns a good first conversation into a signed project or a monthly retainer, and never sells what we can't deliver well.</T>
  </Shot>
);
