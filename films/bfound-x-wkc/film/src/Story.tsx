// One continuous stage: a phone call between two worlds. bFound's world (Emma) is the top panel, soft and serif;
// WKConversions' world (Karl) is the bottom panel, crisp and blue. The seam between them moves with who is
// talking and what is being talked about; every phrase lands its own visual on its spoken word.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BF, E, Key, W, WK, k, kf, lerp, win } from "./lib";
import { Bars, Check, Cursor, Digit, EmmaPhoto, Person, Phone, PlayBadge, Sparkle, level } from "./parts";

const LOGO_AR = 999.08 / 462.37; // wkc mark
const BF_AR = 1920 / 549;        // bFound logo

/** Height of bFound's panel (top). */
const SEAM: Key[] = [
  [0, 1920], [4.85, 1920], [5.35, 1380, E.wk],
  [9.3, 1380], [9.75, 900, E.wk],
  [12.95, 900], [13.45, 1240, E.bf],
  [14.95, 1240], [15.45, 960, E.wk],
  [20.45, 960], [20.95, 0, E.wkMove],
  [28.35, 0], [28.95, 560, E.bf],
  [33.85, 560], [34.4, 1000, E.bf],
  [36.55, 1000], [37.0, 1240, E.bf],
  [37.9, 1240], [38.35, 960, E.wk],
];

type P = { t: number; f: number; seam: number };
const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s });
const centerText = (top: number, s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 0, width: 1080, top, textAlign: "center", ...s });
/** bFound arrivals: out of a blur, slow rise. */
const bfIn = (p: number, dy = 40): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined });
/** WKC arrivals: crisp, quick, no blur. */
const wkIn = (p: number, dy = 50): React.CSSProperties => ({ opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * dy}px)` });

export const Story: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 60;
  const seam = kf(t, SEAM);
  return (
    <AbsoluteFill style={{ background: WK.page, overflow: "hidden" }}>
      <WkWorld t={t} f={f} seam={seam} />
      <BfWorld t={t} f={f} seam={seam} />
      <Across t={t} f={f} seam={seam} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── WKConversions' world ───────────────────────── */

const WkWorld: React.FC<P> = (p) => (
  <AbsoluteFill style={{ background: WK.page }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${WK.dot} 2.4px, transparent 2.9px)`, backgroundSize: "44px 44px",
      backgroundPosition: `${-p.t * 8}px ${-p.t * 4}px` }} />
    <CallCard {...p} />
    <KarlBar {...p} />
    <WkcMark {...p} />
    <Deal {...p} />
    <KarlBig {...p} />
    <WkEnd {...p} />
  </AbsoluteFill>
);

/** 0–3.4 s: Emma is calling. Karl picks up on the click before "Hey". */
const CallCard: React.FC<P> = ({ t }) => {
  if (t > 3.5) return null;
  const a = (d: number) => k(t, 0.05 + d, 0.55, E.wk);
  const press = t < W.pickup - 0.1 ? 1 : t < W.pickup + 0.03 ? lerp(1, 0.86, k(t, W.pickup - 0.1, 0.13, E.wkMove)) : lerp(0.86, 1, k(t, W.pickup + 0.03, 0.3, E.wk));
  return (
    <>
      <div style={abs({ left: 90, top: 470, width: 900, height: 1010, borderRadius: 52, background: WK.card, boxShadow: WK.shadow, ...wkIn(a(0), 80) })} />
      <div style={centerText(520, { ...wkIn(a(0.12)) })}>
        <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.body, fontWeight: 600, fontSize: 38, padding: "18px 40px", borderRadius: 999 }}>Incoming call</span>
      </div>
      <div style={abs({ left: 540 - 140, top: 650, width: 280, height: 280, ...wkIn(a(0.2)) })}>
        <EmmaPhoto style={{ inset: 0, borderRadius: "50%", boxShadow: `0 0 0 8px #fff, 0 0 0 16px ${WK.blue}` }} />
      </div>
      <div style={centerText(975, { fontFamily: WK.head, fontWeight: 800, fontSize: 150, letterSpacing: "-0.05em", lineHeight: 1, color: WK.ink, ...wkIn(a(0.28)) })}>
        Emma<span style={{ color: WK.blue }}>.</span>
      </div>
      <div style={centerText(1135, { fontFamily: WK.body, fontWeight: 500, fontSize: 46, color: WK.txt2, ...wkIn(a(0.34)) })}>bFound</div>
      {[0, 1, 2].map((i) => {
        const ph = (t - 0.7 - i * 0.6) % 1.8;
        if (t < 0.7 + i * 0.6 || t > W.pickup || ph > 1.2) return null;
        const q = ph / 1.2;
        const r = 95 + q * 110;
        return <div key={i} style={abs({ left: 540 - r, top: 1345 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `5px solid ${WK.blue}`, opacity: (1 - q) * (1 - q) * 0.6 })} />;
      })}
      <div style={abs({ left: 540 - 95, top: 1345 - 95, width: 190, height: 190, borderRadius: "50%", background: WK.blue, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${press * a(0.4)})`, boxShadow: "0 24px 48px -20px rgba(63,140,232,.7)" })}>
        <Phone size={88} />
      </div>
    </>
  );
};

/** Karl on the line: his portrait in WKC's blue ring and the call's real loudness. */
const KarlBar: React.FC<P> = ({ t, f, seam }) => {
  const o = Math.max(win(t, 4.95, 9.55, 0.5, 0.25), win(t, 13.3, 15.12, 0.5, 0.22));
  if (o <= 0) return null;
  const a = t < 11 ? k(t, 4.95, 0.5) : k(t, 13.3, 0.5);
  const cy = (seam + 1920) / 2;
  return (
    <div style={abs({ left: 90, top: cy - 150, width: 900, height: 300, borderRadius: 52, background: WK.card, boxShadow: WK.shadow, opacity: Math.min(1, o * 1.5),
      transform: `translateY(${(1 - a) * 90}px)` })}>
      <div style={abs({ left: 50, top: 55, width: 190, height: 190, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 0 6px #fff, 0 0 0 13px ${WK.blue}` })}>
        <Img src={staticFile("img/karl-400.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={abs({ left: 300, top: 52, display: "flex", alignItems: "baseline", gap: 18 })}>
        <span style={{ fontFamily: WK.head, fontWeight: 800, fontSize: 78, letterSpacing: "-0.05em", color: WK.ink }}>Karl<span style={{ color: WK.blue }}>.</span></span>
        <span style={{ fontFamily: WK.body, fontWeight: 500, fontSize: 34, color: WK.txt3 }}>WKConversions</span>
      </div>
      <div style={abs({ left: 300, top: 160 })}><Bars f={f} n={24} w={560} h={92} /></div>
    </div>
  );
};

/** The wkc mark: written on for "we", met by bFound's logo for "collaboration", the header of the pricing, the sign-off. */
const WkcMark: React.FC<P> = ({ t, seam }) => {
  let cx = 540, cy = 1440, w = 420, o = 0, reveal = 1;
  if (t >= 9.45 && t < 13.25) {
    reveal = k(t, 9.5, 0.75, E.wkMove);
    o = 1 - k(t, 12.9, 0.3, E.out);
  } else if (t >= 15.05 && t < 34.25) {
    o = k(t, 15.14, 0.45) * (1 - k(t, 33.85, 0.3, E.out));
    if (t < 20.45) { cy = kf(t, [[15.05, 1600], [16.9, 1400, E.wk], [W.collab - 0.12, 1400], [W.collab + 0.4, 1190, E.wk]]); w = kf(t, [[W.collab - 0.12, 380], [W.collab + 0.4, 420, E.wk]]); }
    else if (t < 28.35) { const q = k(t, 20.45, 0.5, E.wkMove); cx = lerp(540, 185, q); cy = lerp(1190, 164, q); w = lerp(420, 190, q); }
    else { const q = k(t, 28.35, 0.6, E.wkMove); cx = lerp(185, 540, q); cy = Math.max(lerp(164, 680, q), t > 33 ? seam + 120 : 0); w = lerp(190, 280, q); }
  } else if (t >= 39.75) {
    const q = k(t, 39.78, 0.5);
    o = q; cy = 1100 + (1 - q) * 50; w = 300;
  }
  if (o <= 0) return null;
  const h = w / LOGO_AR;
  return (
    <div style={abs({ left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: o, clipPath: reveal < 1 ? `inset(0 ${(1 - reveal) * 100}% 0 0)` : undefined })}>
      <Img src={staticFile("img/logo.svg")} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

/** 20.9–38.2 s: normal price, starting out, our price, −50 %, the referral code on wkconversions.com/contact. */
const Deal: React.FC<P> = ({ t, seam }) => {
  if (t < 21.2 || t > 38.4) return null;
  // the form rides below the seam when bFound's panel grows
  const cardTop = Math.max(760, seam + 30);
  const s = Math.min(1, (1880 - cardTop) / 840);
  const gone = 1 - k(t, 37.9, 0.35, E.out);
  // normal price
  const pill1 = win(t, W.normal - 0.05, 28.6, 0.45, 0.3);
  const strike = k(t, W.our, 0.3, E.wkMove);
  const shrink = k(t, 26.2, 0.45, E.wkMove);
  const thousandO = 1 - k(t, 28.25, 0.3, E.out);
  // starting out
  const track = win(t, 24.1, 26.35, 0.45, 0.35);
  // our price
  const dy = k(t, 28.35, 0.6, E.wkMove) * 70;
  const pill2 = k(t, 26.4, 0.45) * (1 - k(t, 31.75, 0.3, E.out));
  const roll = k(t, 26.55, 0.62);
  const half = k(t, W.pct - 0.1, 0.55);
  const hundreds = 4 * roll + 10 * (1 - roll) - 2 * half + (roll < 1 ? 0 : 0);
  // −50 % tag, then into the code field
  const tagIn = k(t, W.minus, 0.4);
  const tagFly = k(t, 31.8, 0.45, E.wkMove);
  // the form
  const form = k(t, 31.75, 0.5);
  const priceMove = k(t, 31.8, 0.55, E.wkMove);
  const focus = k(t, 32.15, 0.2, E.wkMove);
  const typed = (i: number) => k(t, W.bfound50 + i * 0.105, 0.08, E.lin);
  const ok = k(t, 33.3, 0.35);
  // the price: "€400" big → "€200" big → "Price: €200" in the form
  const px = lerp(80, 300, priceMove), py = lerp(1100 + dy, 1218, priceMove), ps = lerp(300, 96, priceMove);
  return (
    <div style={abs({ left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "540px 760px", transform: `translateY(${cardTop - 760}px) scale(${s})`, opacity: gone })}>
      {/* normal price */}
      <div style={abs({ left: 90, top: 710, ...wkIn(pill1, 30), opacity: Math.min(pill1 * 1.6, 1 - shrink * 0.0) * thousandO })}>
        <span style={{ display: "inline-block", background: "#fff", border: `2px solid ${WK.line}`, color: WK.txt2, fontFamily: WK.body, fontWeight: 600, fontSize: 40, padding: "16px 36px", borderRadius: 999 }}>Normal price</span>
      </div>
      <div style={abs({ left: 80, top: 820, transformOrigin: "0 0", transform: `scale(${lerp(1, 0.5, shrink)}) translateY(${lerp(0, -40, shrink)}px)`, opacity: Math.min(1, k(t, W.normal + 0.25, 0.3) * 1.5) * thousandO })}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", fontFamily: WK.head, fontWeight: 800, fontSize: 260, letterSpacing: "-0.05em", lineHeight: 1,
          color: shrink > 0 ? `rgb(${lerp(5, 131, shrink)},${lerp(15, 138, shrink)},${lerp(25, 148, shrink)})` : WK.ink, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ marginRight: 6 }}>€</span>
          <Digit v={k(t, 21.62, 0.95) * 11} size={260} width={0.58} />
          <span style={{ marginLeft: -6, marginRight: -4 }}>,</span>
          {[0, 1, 2].map((i) => <Digit key={i} v={k(t, 21.67 + i * 0.05, 0.95) * 10} size={260} width={0.6} />)}
          <div style={abs({ left: -10, right: -10, top: "50%", height: 22, marginTop: -6, borderRadius: 11, background: WK.blue, transformOrigin: "0 50%", transform: `scaleX(${strike})` })} />
        </div>
      </div>
      {/* starting out: the start of a long road */}
      {track > 0 && (
        <div style={{ opacity: track }}>
          <div style={abs({ left: 90, top: 1140, ...wkIn(k(t, W.starting - 0.05, 0.4), 24) })}>
            <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.body, fontWeight: 600, fontSize: 40, padding: "16px 36px", borderRadius: 999 }}>Starting out</span>
          </div>
          <div style={abs({ left: 110, top: 1298, width: 860, height: 8, borderRadius: 4, background: WK.line, transformOrigin: "0 50%", transform: `scaleX(${k(t, 24.1, 0.6, E.wkMove)})` })} />
          {[0.25, 0.5, 0.75, 1].map((q, i) => (
            <div key={i} style={abs({ left: 110 + 860 * q - 10, top: 1292, width: 20, height: 20, borderRadius: 10, background: WK.faint, opacity: k(t, 24.3 + q * 0.3, 0.2) })} />
          ))}
          <div style={abs({ left: 110, top: 1298, width: 860 * 0.07 * k(t, W.out, 0.5, E.wkMove), height: 8, borderRadius: 4, background: WK.blue })} />
          <div style={abs({ left: 110 - 26, top: 1302 - 26, width: 52, height: 52, borderRadius: 26, background: WK.blue, boxShadow: `0 0 0 ${10 + 6 * Math.sin(t * 6)}px rgba(63,140,232,.18)`,
            transform: `scale(${k(t, W.starting, 0.35)})` })} />
        </div>
      )}
      {/* our price */}
      <div style={abs({ left: 90, top: 1000 + dy, ...wkIn(pill2, 30), opacity: Math.min(1, pill2 * 1.6) })}>
        <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.body, fontWeight: 600, fontSize: 40, padding: "16px 36px", borderRadius: 999 }}>Our price</span>
      </div>
      {t > 26.5 && (
        <div style={abs({ left: px, top: py, display: "flex", alignItems: "center", fontFamily: WK.head, fontWeight: 800, fontSize: ps, letterSpacing: "-0.05em", lineHeight: 1,
          color: WK.blueText, opacity: Math.min(1, k(t, 26.55, 0.25) * 1.5) })}>
          <span style={{ marginRight: ps * 0.02 }}>€</span>
          <Digit v={hundreds} size={ps} width={0.6} />
          <Digit v={10 - 10 * k(t, 26.6, 0.62)} size={ps} width={0.6} />
          <Digit v={10 - 10 * k(t, 26.65, 0.62)} size={ps} width={0.6} />
        </div>
      )}
      {tagIn > 0 && tagFly < 1 && (
        <div style={abs({ left: lerp(610, 400, tagFly), top: lerp(920, 1010, tagFly) + dy * (1 - tagFly), transformOrigin: "50% 50%",
          transform: `scale(${lerp(1.25, 1, tagIn) * lerp(1, 0.35, tagFly)})`, opacity: Math.min(1, tagIn * 2) * (1 - tagFly) })}>
          <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.head, fontWeight: 800, fontSize: 112, letterSpacing: "-0.04em", lineHeight: 1,
            padding: "22px 40px", borderRadius: 34, boxShadow: "0 30px 60px -28px rgba(63,140,232,.8)" }}>−50%</span>
        </div>
      )}
      {/* wkconversions.com/contact, rebuilt: the referral code field and the price */}
      {form > 0 && (
        <>
          <div style={abs({ left: 60, top: 760, width: 960, height: 840, borderRadius: 52, background: WK.card, boxShadow: WK.shadow, opacity: Math.min(1, form * 1.6),
            transform: `scale(${lerp(0.94, 1, form)})`, transformOrigin: "540px 300px", zIndex: -1 })} />
          <div style={abs({ left: 110, top: 806, ...wkIn(k(t, 31.95, 0.45), 24) })}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 14, background: WK.card2, color: WK.txt2, fontFamily: WK.body, fontWeight: 500, fontSize: 38, padding: "16px 34px", borderRadius: 999 }}>
              <svg width={30} height={30} viewBox="0 0 10 10"><rect x="1.8" y="4.4" width="6.4" height="4.6" rx="1" fill={WK.txt3} /><path d="M3.2 4.4 V3.2 a1.8 1.8 0 0 1 3.6 0 V4.4" fill="none" stroke={WK.txt3} strokeWidth="1" /></svg>
              wkconversions.com/contact
            </span>
          </div>
          <div style={abs({ left: 112, top: 930, fontFamily: WK.body, fontWeight: 600, fontSize: 46, color: WK.ink, ...wkIn(k(t, 32.05, 0.45), 24) })}>Referral code</div>
          <div style={abs({ left: 110, top: 1000, width: 860, height: 170, borderRadius: 26, background: "#fff",
            border: `4px solid rgb(${lerp(226, 63, focus)},${lerp(227, 140, focus)},${lerp(230, 232, focus)})`, boxShadow: focus > 0 ? `0 0 0 ${8 * focus}px ${WK.soft}` : undefined,
            ...wkIn(k(t, 32.1, 0.4), 24) })}>
            <div style={abs({ left: 46, top: 0, height: 162, display: "flex", alignItems: "center", fontFamily: WK.head, fontWeight: 800, fontSize: 108, letterSpacing: "0.01em", color: WK.ink })}>
              {"BFOUND50".split("").map((c, i) => (
                <span key={i} style={{ opacity: typed(i), display: "inline-block", transform: `translateY(${(1 - typed(i)) * 10}px)` }}>{c}</span>
              ))}
            </div>
            <Check x={860 - 90} y={81} d={92} s={ok} />
          </div>
          <div style={abs({ left: 112, top: 1238, fontFamily: WK.body, fontWeight: 600, fontSize: 52, color: WK.txt2, opacity: priceMove })}>Price:</div>
          <div style={abs({ left: 110, top: 1390, ...wkIn(k(t, 32.2, 0.45), 24) })}>
            <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.body, fontWeight: 600, fontSize: 48, padding: "30px 64px", borderRadius: 24 }}>Submit</span>
          </div>
        </>
      )}
    </div>
  );
};

/** "All right, I'm very excited": Karl, big, the voice filling his ring. */
const KarlBig: React.FC<P> = ({ t, f }) => {
  const o = win(t, 38.0, 40.0, 0.5, 0.35);
  if (o <= 0) return null;
  const a = k(t, 38.0, 0.55);
  const lv = level(f);
  const pulse = Math.exp(-Math.pow((t - W.excited - 0.15) / 0.3, 2));
  return (
    <div style={{ opacity: Math.min(1, o * 1.5), transform: `translateY(${(1 - a) * 90}px)` }}>
      <div style={abs({ left: 540 - 160, top: 1300 - 160, width: 320, height: 320, borderRadius: "50%", overflow: "hidden",
        boxShadow: `0 0 0 8px #fff, 0 0 0 ${18 + lv * 14 + pulse * 16}px ${WK.blue}`, transform: `scale(${1 + pulse * 0.05})` })}>
        <Img src={staticFile("img/karl-400.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={abs({ left: 540 - 380, top: 1545 })}><Bars f={f} n={30} w={760} h={190} gain={1 + pulse * 0.4} /></div>
    </div>
  );
};

/** The sign-off on WKC's side: the code, the place to use it, the click. */
const WkEnd: React.FC<P> = ({ t }) => {
  if (t < 39.9) return null;
  const card = k(t, W.make - 0.05, 0.5);
  const tag = k(t, W.make + 0.12, 0.4);
  const btn = k(t, W.make + 0.1, 0.5);
  const cur = k(t, 39.95, 0.4, E.wkMove);
  const press = Math.exp(-Math.pow((t - W.happen - 0.05) / 0.08, 2));
  const curO = 1 - k(t, 41.2, 0.4, E.out);
  return (
    <>
      <div style={abs({ left: 110, top: 1240, width: 860, height: 210, borderRadius: 44, background: WK.card, boxShadow: WK.shadow, ...wkIn(card, 60),
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WK.head, fontWeight: 800, fontSize: 140, letterSpacing: "0.01em", color: WK.ink })}>
        BFOUND50
      </div>
      <div style={abs({ left: 770, top: 1185, transform: `scale(${lerp(1.3, 1, tag)})`, opacity: Math.min(1, tag * 2) })}>
        <span style={{ display: "inline-block", background: WK.blue, color: "#fff", fontFamily: WK.head, fontWeight: 800, fontSize: 56, letterSpacing: "-0.03em", padding: "14px 28px", borderRadius: 22 }}>−50%</span>
      </div>
      <div style={abs({ left: 120, top: 1540, width: 840, height: 136, borderRadius: 68, background: press > 0.3 ? WK.blueDeep : WK.blue, ...wkIn(btn, 50),
        transform: `translateY(${(1 - btn) * 50}px) scale(${1 - press * 0.04})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
        color: "#fff", fontFamily: WK.body, fontWeight: 600, fontSize: 52, boxShadow: "0 30px 60px -30px rgba(63,140,232,.9)" })}>
        wkconversions.com/contact
        <svg width={44} height={44} viewBox="0 0 10 10"><path d="M1.5 5 H8 M5.3 2.2 L8.1 5 L5.3 7.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {cur > 0 && <Cursor x={lerp(980, 760, cur)} y={lerp(1880, 1600, cur)} s={1 - press * 0.12} o={Math.min(1, cur * 3) * curO} />}
    </>
  );
};

/* ───────────────────────── bFound's world ───────────────────────── */

const BfWorld: React.FC<P> = (p) => {
  const { t, seam } = p;
  const r = k(t, W.pickup + 0.07, 0.78, E.bf) * 2300;
  if (r <= 0 || seam <= 0.5) return null;
  return (
    <AbsoluteFill style={{ clipPath: r < 2290 ? `circle(${r}px at 540px 1345px)` : undefined }}>
      <AbsoluteFill style={{ clipPath: seam < 1919 ? `inset(0 0 ${1920 - seam}px 0)` : undefined }}>
        <BfBackground t={t} />
        <Post {...p} />
        <Wall {...p} />
        <EmmaHero {...p} />
        <PeopleRow {...p} />
        <BfLogo {...p} />
        <PeopleGrid {...p} />
        <EmmaBig {...p} />
        <BfEnd {...p} />
        <EmmaTalk {...p} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BfBackground: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{
    background: [
      `radial-gradient(760px 640px at ${230 + 60 * Math.sin(t * 0.35)}px ${260 + 40 * Math.cos(t * 0.3)}px, ${BF.cream} 0%, rgba(253,248,218,0) 72%)`,
      `radial-gradient(900px 760px at ${860 + 50 * Math.cos(t * 0.28)}px ${640 + 60 * Math.sin(t * 0.33)}px, #e9e9fb 0%, rgba(233,233,251,0) 70%)`,
      `radial-gradient(820px 700px at ${260 + 50 * Math.sin(t * 0.25)}px ${1250 + 50 * Math.cos(t * 0.31)}px, ${BF.lilac} 0%, rgba(251,244,252,0) 70%)`,
      `radial-gradient(900px 800px at ${820}px ${1650 + 40 * Math.sin(t * 0.3)}px, ${BF.mist} 0%, rgba(239,243,255,0) 72%)`,
      BF.bg,
    ].join(", "),
  }} />
);

/** "Hey Emma": Emma's own portrait card, her name in bFound's serif; on "saw" it becomes the avatar of her post. */
const EmmaHero: React.FC<P> = ({ t, seam }) => {
  if (t < 2.95 || t > 6.6) return null;
  const a = k(t, 2.98, 0.8, E.bf);
  const m = k(t, 6.0, 0.55, E.bf);
  const cy = seam / 2;
  const size = lerp(540, 104, m), left = lerp(270, 130, m), top = lerp(cy - 470, 140, m), rad = lerp(48, 52, m);
  const name = k(t, W.emma - 0.05, 0.7, E.bf) * (1 - k(t, 5.95, 0.3, E.out));
  return (
    <>
      <EmmaPhoto style={{ left, top, width: size, height: size, borderRadius: rad, boxShadow: m < 1 ? BF.shadow : undefined, ...bfIn(a, 60), opacity: a }} />
      <div style={centerText(cy + 120, { fontFamily: BF.serif, fontSize: 132, lineHeight: 1, color: BF.fg, letterSpacing: "-0.01em", ...bfIn(name, 30) })}>Emma Bauditz</div>
      <div style={centerText(cy + 262, { fontFamily: BF.serif, fontStyle: "italic", fontSize: 76, lineHeight: 1, color: BF.ink, ...bfIn(k(t, W.emma + 0.25, 0.7, E.bf) * (1 - k(t, 5.95, 0.3, E.out)), 30) })}>founder, bFound.</div>
    </>
  );
};

const COMMENT_T = Array.from({ length: 28 }, (_, i) => W.comment + i * 0.12);
const CommentRow: React.FC<{ i: number; w?: number }> = ({ i, w = 820 }) => (
  <div style={{ position: "relative", width: w, height: 92, borderRadius: 30, background: "#f7f8fd", border: `2px solid ${BF.border}` }}>
    <Person x={52} y={46} d={62} tone={i} />
    <div style={abs({ left: 104, top: 24, width: 200 + ((i * 53) % 260), height: 16, borderRadius: 8, background: "#dfe3ef" })} />
    <div style={abs({ left: 104, top: 52, width: 140 + ((i * 91) % 300), height: 16, borderRadius: 8, background: "#e9ecf4" })} />
  </div>
);

/** "I saw the comment section": her post (the video WKC made for bFound) and the comments pouring in;
 *  "amazing": pull back, the comments fill her world. */
const Post: React.FC<P> = ({ t }) => {
  if (t < 6.0 || t > 9.8) return null;
  const a = k(t, 6.02, 0.55, E.bf);
  const sc = kf(t, [[W.amazing - 0.05, 1], [7.85, 0.56, E.bf]]);
  const out = 1 - k(t, W.yeah2, 0.35, E.out);
  const cnt = COMMENT_T.reduce((s, at) => s + k(t, at, 0.32, E.bf), 0);
  return (
    <div style={abs({ left: 0, top: 0, width: 1080, height: 1380, transformOrigin: "540px 690px", transform: `scale(${sc})`, opacity: out })}>
      <div style={abs({ left: 80, top: 90, width: 920, height: 1210, borderRadius: 40, background: "#fff", border: `2px solid ${BF.border}`, boxShadow: BF.shadow, ...bfIn(a, 30) })} />
      {t > 6.55 && <EmmaPhoto style={{ left: 130, top: 140, width: 104, height: 104, borderRadius: 52 }} />}
      <div style={abs({ left: 258, top: 146, ...bfIn(k(t, 6.2, 0.6, E.bf), 16) })}>
        <div style={{ fontFamily: BF.body, fontWeight: 600, fontSize: 44, color: BF.fg, lineHeight: 1.1 }}>Emma Bauditz</div>
        <div style={{ fontFamily: BF.body, fontWeight: 400, fontSize: 32, color: BF.muted, marginTop: 6 }}>founder, bFound.</div>
      </div>
      <div style={abs({ left: 130, top: 290, width: 760, height: 18, borderRadius: 9, background: "#e6e9f2", opacity: k(t, 6.3, 0.5, E.bf) })} />
      <div style={abs({ left: 130, top: 326, width: 540, height: 18, borderRadius: 9, background: "#eceef5", opacity: k(t, 6.35, 0.5, E.bf) })} />
      <div style={abs({ left: 130, top: 380, width: 820, height: 440, borderRadius: 30, overflow: "hidden", ...bfIn(k(t, 6.15, 0.65, E.bf), 30),
        background: `linear-gradient(135deg, ${BF.mist} 0%, #cfd6f7 48%, ${BF.lilac} 100%)` })}>
        <div style={abs({ left: -200 + ((t * 120) % 1300), top: -100, width: 160, height: 700, transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.45), rgba(255,255,255,0))" })} />
        <div style={abs({ left: 410 - 76, top: 220 - 76, width: 152, height: 152, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 40px -18px rgba(72,94,157,.5)" })}>
          <svg width={62} height={62} viewBox="0 0 10 10"><path d="M3 1.6 L8.4 5 L3 8.4 Z" fill={BF.ink} stroke={BF.ink} strokeWidth={0.9} strokeLinejoin="round" /></svg>
        </div>
      </div>
      <div style={abs({ left: 132, top: 846, fontFamily: BF.serif, fontStyle: "italic", fontSize: 64, color: BF.fg, lineHeight: 1, ...bfIn(k(t, W.comment - 0.1, 0.6, E.bf), 16) })}>comments</div>
      <div style={abs({ left: 130, top: 940, width: 820, height: 330, overflow: "hidden" })}>
        {COMMENT_T.map((at, i) => {
          const y = (cnt - 1 - i) * 108;
          if (t < at - 0.05 || y > 340) return null;
          return <div key={i} style={abs({ left: 0, top: y, opacity: k(t, at, 0.3, E.bf) })}><CommentRow i={i} /></div>;
        })}
      </div>
    </div>
  );
};

// the wall: bubbles around the scaled post, rippling out from it
const POST_RECT = { l: 282 - 18, r: 798 + 18, t: 351 - 18, b: 1029 + 18 };
const ROW_X = [170, 355, 540, 725, 910];
const WALL = (() => {
  const out: { x: number; y: number; d: number; tone: number; target: number }[] = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 4; c++) {
    const x = 18 + c * 265 + (r % 2) * 12, y = 26 + r * 112;
    if (x < POST_RECT.r && x + 232 > POST_RECT.l && y < POST_RECT.b && y + 86 > POST_RECT.t) continue;
    const cx = x + 116, cy = y + 43;
    let target = 1;
    for (let j = 1; j < 5; j++) if (Math.abs(ROW_X[j] - cx) < Math.abs(ROW_X[target] - cx)) target = j;
    out.push({ x, y, d: Math.hypot(cx - 540, cy - 690), tone: r * 4 + c, target });
  }
  return out;
})();
const Wall: React.FC<P> = ({ t }) => {
  if (t < W.amazing || t > 9.95) return null;
  const dim = lerp(1, 0.42, k(t, 7.85, 0.45, E.bf));
  const g = k(t, W.yeah2, 0.5, E.bf);
  return (
    <>
      {WALL.map((b, i) => {
        const a = k(t, W.amazing + 0.05 + (b.d / 1500) * 0.55, 0.5, E.bf);
        if (a <= 0) return null;
        const tx = ROW_X[b.target] - 116, ty = 450 - 43;
        const x = lerp(b.x, tx, g), y = lerp(b.y + Math.sin(t * 1.3 + i) * 5, ty, g);
        return (
          <div key={i} style={abs({ left: x, top: y, width: 232, height: 86, borderRadius: 43, background: "#fff", border: `2px solid ${BF.border}`,
            boxShadow: "0 16px 30px -18px rgba(72,94,157,.35)", opacity: a * dim * (1 - g), transform: `scale(${lerp(0.8, 1, a) * lerp(1, 0.3, g)})`, filter: a < 1 ? `blur(${(1 - a) * 8}px)` : undefined })}>
            <Person x={44} y={43} d={56} tone={b.tone} />
            <div style={abs({ left: 86, top: 26, width: 90 + ((i * 37) % 50), height: 13, borderRadius: 7, background: "#dfe3ef" })} />
            <div style={abs({ left: 86, top: 48, width: 60 + ((i * 53) % 60), height: 13, borderRadius: 7, background: "#e9ecf4" })} />
          </div>
        );
      })}
      {[[250, 300, 7.35, 0.5], [850, 330, 7.5, 0.42], [790, 1090, 7.62, 0.5]].map(([x, y, at, s], i) => (
        <Sparkle key={i} x={x} y={y} s={s * k(t, at, 0.5, E.bf) * (1 - g) * (0.85 + 0.15 * Math.sin(t * 4 + i))} rot={t * 10} />
      ))}
    </>
  );
};

/** "help others as well": Emma (already helped: her video) and four of the commenters; WKC's line reaches them. */
const PeopleRow: React.FC<P> = ({ t }) => {
  if (t < 9.5 || t > 15.5) return null;
  const out = 1 - k(t, 15.05, 0.4, E.out);
  const ringAt = [9.95, 12.3, W.help - 0.02, 12.3, 12.42];
  const help = k(t, W.help - 0.02, 0.5);
  return (
    <>
      {ROW_X.map((x, i) => {
        const a = k(t, 9.6 + i * 0.05, 0.6, E.bf);
        const ring = k(t, ringAt[i], 0.35);
        const style: React.CSSProperties = { opacity: a * out, transform: `scale(${lerp(0.6, 1, a)})`, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined };
        return (
          <div key={i} style={abs({ left: 0, top: 0, ...style, transformOrigin: `${x}px 450px` })}>
            {i === 2 && <div style={abs({ left: x - 150 * help, top: 450 - 150 * help, width: 300 * help, height: 300 * help, borderRadius: "50%", background: WK.soft, opacity: 1 - k(t, 12.24, 0.5, E.out) })} />}
            <div style={abs({ left: x - 75 - 14 * ring, top: 450 - 75 - 14 * ring, width: 150 + 28 * ring, height: 150 + 28 * ring, borderRadius: "50%", border: `7px solid ${WK.blue}`, opacity: ring })} />
            {i === 0 ? <EmmaPhoto style={{ left: x - 75, top: 375, width: 150, height: 150, borderRadius: 75 }} /> : <Person x={x} y={450} d={150} tone={i + 1} />}
            <PlayBadge x={x + 56} y={450 + 56} d={60} s={ring} />
          </div>
        );
      })}
    </>
  );
};

/** bFound's logo: meets the wkc mark at the seam for "collaboration", returns for "collaborating", signs off. */
const BfLogo: React.FC<P> = ({ t, seam }) => {
  let cx = 540, cy = 0, w = 640, o = 0, blur = 0;
  if (t >= 15.05 && t < 21.0) {
    const a = k(t, 15.1, 0.8, E.bf);
    o = a; blur = (1 - a) * 14;
    cy = kf(t, [[15.05, 300], [16.9, 520, E.bf], [W.collab - 0.12, 520], [W.collab + 0.6, 720, E.bf]]) + (t > 20.4 ? seam - 960 : 0);
    w = kf(t, [[W.collab - 0.12, 600], [W.collab + 0.6, 660, E.bf]]);
  } else if (t >= 28.35 && t < 38.4) {
    o = 1 - k(t, 37.9, 0.4, E.out);
    if (t < 33.85) { cy = seam - 280; w = 560; }
    else { const q = k(t, 33.85, 0.55, E.bf); cy = lerp(seam - 280, 150, q); w = lerp(560, 340, q); }
  } else if (t >= 39.75) {
    const a = k(t, 39.78, 0.9, E.bf);
    o = a; blur = (1 - a) * 14; cy = 420 + (1 - a) * 40; w = 720;
  }
  if (o <= 0) return null;
  const h = w / BF_AR;
  return <Img src={staticFile("img/bfound-logo.webp")} style={abs({ left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined })} />;
};

const GRID = [210, 430, 650, 870].flatMap((x) => [400, 680].map((y) => ({ x, y }))).sort((a, b) => a.y - b.y || a.x - b.x);
export const chipDep = (i: number) => 35.2 + i * 0.11;
/** "let's help other people": eight people of bFound's community, each receiving the code. */
const PeopleGrid: React.FC<P> = ({ t }) => {
  if (t < 33.9 || t > 38.4) return null;
  const out = 1 - k(t, 37.9, 0.4, E.out);
  return (
    <>
      {GRID.map((g, i) => {
        const a = k(t, 34.0 + i * 0.05, 0.6, E.bf);
        const ring = k(t, chipDep(i) + 0.55, 0.3);
        return (
          <div key={i} style={abs({ left: 0, top: 0, opacity: a * out, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined })}>
            <div style={abs({ left: g.x - 75 - 12 * ring, top: g.y - 75 - 12 * ring, width: 150 + 24 * ring, height: 150 + 24 * ring, borderRadius: "50%", border: `7px solid ${WK.blue}`, opacity: ring })} />
            <Person x={g.x} y={g.y} d={150} tone={i + 2} />
          </div>
        );
      })}
    </>
  );
};
export const GRID_POS = GRID;

/** "All right, I'm very excited": Emma again, as at the start; her sparkles on "excited". */
const EmmaBig: React.FC<P> = ({ t }) => {
  if (t < 37.95 || t > 40.1) return null;
  const a = k(t, W.allRight, 0.75, E.bf);
  const o = 1 - k(t, 39.7, 0.35, E.out);
  const sp = (at: number) => k(t, at, 0.55, E.bf) * o;
  return (
    <>
      <EmmaPhoto style={{ left: 540 - 230, top: 470 - 230, width: 460, height: 460, borderRadius: 46, boxShadow: BF.shadow, ...bfIn(a, 50), opacity: a * o,
        transform: `translateY(${(1 - a) * 50}px) scale(${lerp(1, 0.92, 1 - o)})` }} />
      <Sparkle x={850} y={250} s={0.62 * sp(W.excited - 0.05)} rot={t * 12} />
      <Sparkle x={225} y={700} s={0.45 * sp(W.excited + 0.1)} rot={-t * 12} />
      <Sparkle x={880} y={640} s={0.32 * sp(W.excited + 0.22)} rot={t * 9} />
    </>
  );
};

const BfEnd: React.FC<P> = ({ t }) => {
  if (t < 40.0) return null;
  return <div style={centerText(600, { fontFamily: BF.serif, fontStyle: "italic", fontSize: 92, lineHeight: 1, color: BF.ink, ...bfIn(k(t, 40.1, 0.9, E.bf), 30) })}>a new collaboration.</div>;
};

/** Emma talking (we only hear Karl's side): her portrait and bFound's typing dots. */
const TALKS: [number, number, number, number][] = [[7.85, 9.4, 80, 1185], [13.05, 15.1, 80, 1045], [18.0, 20.45, 340, 110], [36.6, 38.0, 80, 1045]];
const EmmaTalk: React.FC<P> = ({ t }) => {
  const w = TALKS.find(([a, b]) => t >= a && t <= b);
  if (!w) return null;
  const [a0, b0, x, y] = w;
  const a = k(t, a0, 0.6, E.bf) * (1 - k(t, b0 - 0.3, 0.3, E.out));
  return (
    <div style={abs({ left: x, top: y, width: 400, height: 136, borderRadius: 68, background: "#fff", border: `2px solid ${BF.border}`, boxShadow: BF.shadow, ...bfIn(a, 30) })}>
      <EmmaPhoto style={{ left: 18, top: 18, width: 96, height: 96, borderRadius: 48 }} />
      {[0, 1, 2].map((j) => {
        const b = 0.5 + 0.5 * Math.sin(t * 7 - j * 0.9);
        return <div key={j} style={abs({ left: 160 + j * 66, top: 55 - b * 9, width: 28, height: 28, borderRadius: 14, background: BF.ink, opacity: 0.35 + 0.65 * b })} />;
      })}
    </div>
  );
};

/* ───────────────────────── across the seam ───────────────────────── */

const Across: React.FC<P> = ({ t, seam }) => {
  const showSeam = t > 3.3 && seam > 1 && seam < 1919;
  // WKC's line: from the wkc mark up to the people
  const lineO = 1 - k(t, 12.9, 0.3, E.out);
  const trunk = k(t, W.way, 0.82, E.wkMove);
  const br = (at: number) => k(t, at, 0.42, E.wkMove);
  const branch = (x: number) => (x < 540 ? `M540 650 H${x + 34} Q${x} 650 ${x} 616 V545` : `M540 650 H${x - 34} Q${x} 650 ${x} 616 V545`);
  // × at the seam
  const xo = Math.max(win(t, W.collab - 0.08, 20.6, 0.45, 0.3), win(t, 28.6, 34.0, 0.45, 0.3), win(t, 39.9, 99, 0.45, 0.3));
  const xs = t < 25 ? k(t, W.collab - 0.08, 0.45) : t < 36 ? k(t, 28.6, 0.45) : k(t, 39.9, 0.45);
  // the code, copied to everyone
  const cardTop = Math.max(760, seam + 30), s = Math.min(1, (1880 - cardTop) / 840);
  const srcY = cardTop + (1085 - 760) * s;
  const chipsO = 1 - k(t, 37.9, 0.35, E.out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {showSeam && (
        <>
          <div style={abs({ left: 0, top: seam, width: 1080, height: 40, background: "linear-gradient(180deg, rgba(19,26,45,.10), rgba(19,26,45,0))" })} />
          <div style={abs({ left: 0, top: seam - 1, width: 1080, height: 2, background: BF.border })} />
        </>
      )}
      {t > W.way && t < 13.35 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: lineO }}>
          <path d="M540 1330 V545" stroke={WK.blue} strokeWidth={16} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trunk} />
          {[[355, 12.24], [725, 12.24], [910, 12.34]].map(([x, at], i) =>
            t > at ? <path key={i} d={branch(x)} stroke={WK.blue} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - br(at)} /> : null)}
          {trunk < 1 && <circle cx={540} cy={1330 - 785 * trunk} r={22} fill={WK.blue} />}
        </svg>
      )}
      {xo > 0 && (
        <div style={abs({ left: 540 - 95, top: seam - 95, width: 190, height: 190, borderRadius: "50%", background: "#fff", border: `2px solid ${WK.line}`, opacity: xo,
          transform: `scale(${xs})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px -20px rgba(5,15,25,.35)" })}>
          <svg width={80} height={80} viewBox="0 0 10 10"><path d="M2 2 L8 8 M8 2 L2 8" stroke={WK.ink} strokeWidth={1.3} strokeLinecap="round" /></svg>
        </div>
      )}
      {t > 35.15 && t < 38.3 && GRID_POS.map((g, i) => {
        const q = k(t, chipDep(i), 0.6, E.wkMove);
        if (q <= 0) return null;
        const tx = g.x, ty = g.y + 112;
        const x = lerp(540, tx, q), y = lerp(srcY, ty, q) - Math.sin(q * Math.PI) * 160;
        return (
          <div key={i} style={abs({ left: x - 112, top: y - 28, width: 224, height: 56, borderRadius: 28, background: WK.blue, color: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: WK.head, fontWeight: 800, fontSize: 32, letterSpacing: "0.02em", opacity: Math.min(1, q * 4) * chipsO,
            transform: `scale(${lerp(0.7, 1, q)})`, boxShadow: "0 14px 28px -14px rgba(63,140,232,.9)" })}>BFOUND50</div>
        );
      })}
    </AbsoluteFill>
  );
};
