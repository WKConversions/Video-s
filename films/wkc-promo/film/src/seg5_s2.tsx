// Segment 5, shot 2 (frames 579-605): the collage of finished WKC client videos on a plane rotated 10deg clockwise,
// five columns (16:9 clip cards in the wide ones, a brief-to-script chat and a case-study page in the narrow ones)
// scrolling in alternating directions, under a zoom-through pull-back (spec/seg5.md §3, table T4).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F } from "./lib";
import { WkcMark } from "./kit";
import { ZoomBlur, tab } from "./seg5_util";

/** collage scale about the frame centre (605 = 1) */
const ZOOM: number[][] = [
  [579, 2.507], [580, 2.162], [581, 2.004], [582, 1.882], [583, 1.787], [584, 1.709], [585, 1.644], [586, 1.589], [587, 1.54], [588, 1.499],
  [589, 1.464], [590, 1.433], [591, 1.405], [592, 1.38], [593, 1.357], [594, 1.336], [595, 1.316], [596, 1.296], [597, 1.277], [598, 1.257],
  [599, 1.236], [600, 1.213], [601, 1.187], [602, 1.157], [603, 1.119], [604, 1.07], [605, 1.0],
];
/** radial smear as a fraction of the distance from the centre */
const BLUR: number[][] = [[579, 0.12], [580, 0.05], [581, 0.012], [581.5, 0], [602.5, 0], [603, 0.005], [604, 0.008], [605, 0.011]];

type Card = { clip: string; name: string; dark?: boolean };
const CARD_W = 446, CARD_H = 341, PITCH = 361, CLIP_H = 251;
// wide columns: x range, the top of card k=0 at frame 605, and the cards for k = -3..3
const WIDE: { x: number; top0: number; cards: Card[] }[] = [
  { x: -942, top0: -195, cards: [
    { clip: "clearscaler", name: "ClearScaler", dark: true }, { clip: "creoble", name: "Creoble" }, { clip: "kb-saas", name: "K.B" },
    { clip: "clearscaler", name: "ClearScaler", dark: true }, { clip: "creoble", name: "Creoble" }, { clip: "kb-saas", name: "K.B" },
    { clip: "clearscaler", name: "ClearScaler", dark: true }] },
  { x: -129, top0: -287, cards: [
    { clip: "wicflow", name: "Wicflow" }, { clip: "creoble-lovable", name: "Creoble" }, { clip: "robin-bos", name: "Robin Bos", dark: true },
    { clip: "wicflow", name: "Wicflow" }, { clip: "creoble-lovable", name: "Creoble" }, { clip: "wkc-bfound", name: "bfound", dark: true },
    { clip: "robin-bos", name: "Robin Bos" }] },
  { x: 680, top0: -5, cards: [
    { clip: "malaga", name: "Malaga Hideaway" }, { clip: "vendom", name: "Vendom" }, { clip: "voxflow", name: "VoxFlow", dark: true },
    { clip: "malaga", name: "Malaga Hideaway" }, { clip: "vendom", name: "Vendom" }, { clip: "voxflow", name: "VoxFlow", dark: true },
    { clip: "malaga", name: "Malaga Hideaway" }] },
];

const CardView: React.FC<{ c: Card; still: boolean; g: number }> = ({ c, still, g }) => {
  const src = `clips/${c.clip}-16x9`;
  const p = Math.min(1, (g - 579 + 18) / 90);
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 15, overflow: "hidden", background: c.dark ? C.ink : C.white,
      boxShadow: "0 0 0 1px rgba(230,240,253,0.55), 0 12px 30px rgba(18,60,140,0.16)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CARD_W, height: CLIP_H, background: "#DDE3EA" }}>
        {still ? <Img src={staticFile(`${src}.jpg`)} style={{ width: CARD_W, height: CLIP_H, objectFit: "cover", display: "block" }} />
          : <Sequence from={579} layout="none"><OffthreadVideo src={staticFile(`${src}.mp4`)} muted style={{ width: CARD_W, height: CLIP_H, objectFit: "cover", display: "block" }} /></Sequence>}
      </div>
      <div style={{ position: "absolute", left: 20, top: CLIP_H + 19, fontFamily: F.ui, fontWeight: 600, fontSize: 22, lineHeight: "28px", color: c.dark ? C.white : C.ink, letterSpacing: "-0.01em" }}>{c.name}</div>
      <div style={{ position: "absolute", right: 20, top: CLIP_H + 19, height: 28, padding: "0 12px", borderRadius: 14, background: c.dark ? "rgba(230,240,253,0.14)" : C.blueSoft,
        fontFamily: F.ui, fontWeight: 600, fontSize: 16, lineHeight: "28px", color: c.dark ? "#8DC0FF" : C.blueText }}>16:9</div>
      <div style={{ position: "absolute", left: 20, right: 20, top: CLIP_H + 62, height: 4, borderRadius: 2, background: c.dark ? "rgba(230,240,253,0.16)" : C.line }}>
        <div style={{ width: `${p * 100}%`, height: 4, borderRadius: 2, background: C.blue }} />
      </div>
    </div>
  );
};

const T: React.CSSProperties = { fontFamily: F.ui, fontSize: 15.5, lineHeight: "22px", color: "#2A3340", fontWeight: 400 };
const Bubble: React.FC<{ top: number; children: React.ReactNode; h: number; w?: number; left?: number }> = ({ top, children, h, w = 246, left = 22 }) => (
  <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: 16, background: C.blue, color: C.white, overflow: "hidden" }}>{children}</div>
);
const Avatar: React.FC<{ left: number; top: number }> = ({ left, top }) => (
  <div style={{ position: "absolute", left, top, width: 30, height: 30, borderRadius: 15, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <WkcMark w={20} fill={C.white} />
  </div>
);

/** C2: the brief-to-script chat (plane x -476..-147, w 329), one tall panel */
const ChatPanel: React.FC = () => {
  const wave = Array.from({ length: 34 }, (_, i) => 6 + Math.abs(Math.sin(i * 1.7) * 14 + Math.sin(i * 0.6) * 6));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 329, height: 1180, borderRadius: 15, background: C.white, overflow: "hidden",
      boxShadow: "0 0 0 1px rgba(230,240,253,0.55), 0 12px 30px rgba(18,60,140,0.16)" }}>
      <Bubble top={158} h={64}>
        <div style={{ position: "absolute", left: 12, top: 14, width: 36, height: 36, borderRadius: 18, background: C.white }}>
          <div style={{ position: "absolute", left: 14, top: 11, width: 0, height: 0, borderLeft: `11px solid ${C.blue}`, borderTop: "7px solid transparent", borderBottom: "7px solid transparent" }} />
        </div>
        <div style={{ position: "absolute", left: 58, top: 14, display: "flex", alignItems: "center", gap: 2, height: 30 }}>
          {wave.map((h, i) => <div key={i} style={{ width: 3, height: Math.min(28, h), borderRadius: 2, background: "rgba(255,255,255,0.9)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 58, top: 46, fontFamily: F.ui, fontSize: 11, opacity: 0.85 }}>00:42</div>
      </Bubble>
      <Avatar left={280} top={192} />
      <div style={{ position: "absolute", left: 22, top: 262, width: 286, ...T }}>
        <div style={{ fontWeight: 600, color: C.ink, marginBottom: 6 }}>Brief: explain the product in 40 seconds</div>
        <div>One clear story for the homepage, the launch post and the sales deck. Calm, confident, on brand.</div>
        <div style={{ marginTop: 12, fontWeight: 600, color: C.ink }}>Script, draft 2</div>
        <div style={{ marginTop: 4 }}>1. Hook: the problem in one line, typed on screen.</div>
        <div style={{ marginTop: 4 }}>2. The product at work: the real interface, simplified and animated.</div>
        <div style={{ marginTop: 4 }}>3. The moment it clicks: one result, shown not told.</div>
        <div style={{ marginTop: 4 }}>4. Logo and call to action.</div>
        <div style={{ marginTop: 12 }}>Voice-over, music and captions in the same pass. Every format exported from one project.</div>
      </div>
      <div style={{ position: "absolute", left: 270, top: 694, fontFamily: F.ui, fontSize: 11, color: C.muted2 }}>12:25</div>
      {/* the storyboard link bubble (the reference's "External Link Title") at plane y 102..203 */}
      <Bubble top={722} h={101}>
        <div style={{ position: "absolute", left: 16, top: 14, fontFamily: F.ui, fontWeight: 600, fontSize: 17 }}>Storyboard v2</div>
        <div style={{ position: "absolute", left: 16, top: 38, fontFamily: F.ui, fontSize: 12.5, opacity: 0.8 }}>Approved by the client</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 62, height: 39, background: "rgba(5,15,25,0.16)" }} />
        <div style={{ position: "absolute", left: 16, top: 72, fontFamily: F.ui, fontSize: 13, opacity: 0.95 }}>wkconversions.com/storyboard</div>
      </Bubble>
      <Avatar left={280} top={793} />
      <div style={{ position: "absolute", left: 22, top: 846, width: 286, ...T }}>
        <div>Frames 1-4 locked. Animatic tomorrow, first cut on Friday.</div>
        <div style={{ marginTop: 12 }}>Scene list: hook, interface, result, logo. Cut-downs for 1:1 and 9:16 from the same files.</div>
      </div>
      <div style={{ position: "absolute", left: 270, top: 990, fontFamily: F.ui, fontSize: 11, color: C.muted2 }}>02:25</div>
      <div style={{ position: "absolute", left: 22, top: 1020, display: "flex", gap: 14 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 4, border: `1.6px solid ${C.muted2}` }} />)}
      </div>
      <div style={{ position: "absolute", left: 184, top: 1044, width: 54, height: 30, borderRadius: 15, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: C.white }} />)}
      </div>
      <Avatar left={250} top={1044} />
      <div style={{ position: "absolute", left: 14, right: 14, top: 1110, height: 46, borderRadius: 23, border: `1px solid ${C.line}`, background: C.page,
        fontFamily: F.ui, fontSize: 14, lineHeight: "46px", paddingLeft: 40, color: C.muted2 }}>Message to WKConversions...</div>
    </div>
  );
};

/** C4: a case-study page (plane x 333..662, w 329) */
const CasePanel: React.FC<{ still: boolean }> = ({ still }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 329, height: 1120, borderRadius: 15, background: C.white, overflow: "hidden",
    boxShadow: "0 0 0 1px rgba(230,240,253,0.55), 0 12px 30px rgba(18,60,140,0.16)" }}>
    <div style={{ position: "absolute", left: 22, top: 34, display: "flex", gap: 14, fontFamily: F.ui, fontSize: 13, color: C.muted }}>
      <span>Work</span><span>Case study</span><span style={{ color: C.blueText, fontWeight: 600 }}>VoxFlow</span>
    </div>
    <div style={{ position: "absolute", left: 22, top: 66, fontFamily: F.ui, fontSize: 12.5, color: C.muted2 }}>WKConversions</div>
    <div style={{ position: "absolute", left: 200, top: 58, height: 30, padding: "0 14px", borderRadius: 15, background: C.blue, color: C.white, fontFamily: F.ui, fontWeight: 600, fontSize: 13, lineHeight: "30px" }}>Share</div>
    <div style={{ position: "absolute", left: 22, top: 160, width: 290, fontFamily: F.head, fontWeight: 800, fontSize: 25, lineHeight: "29px", letterSpacing: "-0.05em", color: C.ink }}>
      How VoxFlow explains voice AI in 30 seconds
    </div>
    <div style={{ position: "absolute", left: 22, top: 248, fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: C.ink }}>Deliverables: 16:9 · 1:1 · 9:16</div>
    <div style={{ position: "absolute", left: 22, top: 282, width: 285, ...T, fontSize: 14, lineHeight: "20px" }}>
      One explainer, cut for the website, the feed and stories. Kinetic type, the real call flow and a calm Dutch voice-over.
    </div>
    <div style={{ position: "absolute", left: 22, top: 384, width: 160, height: 284, borderRadius: 12, overflow: "hidden", background: "#DCE9E2" }}>
      {still ? <Img src={staticFile("clips/voxflow-9x16.jpg")} style={{ width: 160, height: 284, objectFit: "cover", display: "block" }} />
        : <Sequence from={579} layout="none"><OffthreadVideo src={staticFile("clips/voxflow-9x16.mp4")} muted style={{ width: 160, height: 284, objectFit: "cover", display: "block" }} /></Sequence>}
    </div>
    <div style={{ position: "absolute", left: 196, top: 388, width: 112, ...T, fontSize: 13, lineHeight: "19px", color: C.muted }}>
      <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>9:16</div>Stories and reels, captions burned in.
      <div style={{ fontWeight: 600, color: C.ink, margin: "14px 0 4px" }}>1:1</div>Feed post with the same hook.
      <div style={{ fontWeight: 600, color: C.ink, margin: "14px 0 4px" }}>16:9</div>Homepage hero and sales deck.
    </div>
    <div style={{ position: "absolute", left: 22, top: 692, width: 285, ...T, fontSize: 14, lineHeight: "20px" }}>
      <div style={{ fontWeight: 600, color: C.ink, marginBottom: 6 }}>The brief</div>
      Show what an AI phone assistant does before the viewer scrolls on: answer, help, never pause.
      <div style={{ fontWeight: 600, color: C.ink, margin: "14px 0 6px" }}>The approach</div>
      Words swap in rhythm with the voice, a live chat bubble shows the call, and a real caller photo keeps it human.
      <div style={{ fontWeight: 600, color: C.ink, margin: "14px 0 6px" }}>Delivered</div>
      Master film plus social cut-downs, exported from one project.
    </div>
    <div style={{ position: "absolute", left: 14, right: 14, top: 1040, height: 46, borderRadius: 23, border: `1px solid ${C.line}`, background: C.page,
      fontFamily: F.ui, fontSize: 14, lineHeight: "46px", paddingLeft: 40, color: C.muted2 }}>Ask a follow up</div>
  </div>
);

const Plane: React.FC<{ g: number; still: boolean }> = ({ g, still }) => {
  const [z] = tab(g, ZOOM);
  const wide = -6.0 * (g - 605), narrow = 2.9 * (g - 605);
  return (
    <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transform: `scale(${z}) rotate(10deg)` }}>
      {WIDE.map((col, ci) => col.cards.map((c, i) => {
        const k = i - 3, top = col.top0 + PITCH * k + wide;
        if (top > 1000 || top + CARD_H < -1000) return null;
        return <div key={`${ci}-${k}`} style={{ position: "absolute", left: col.x, top, width: CARD_W, height: CARD_H }}><CardView c={c} still={still} g={g} /></div>;
      }))}
      <div style={{ position: "absolute", left: -476, top: -620 + narrow }}><ChatPanel /></div>
      <div style={{ position: "absolute", left: -476, top: -620 - 1180 - 20 + narrow }}><ChatPanel /></div>
      <div style={{ position: "absolute", left: 333, top: -612 + narrow }}><CasePanel still={still} /></div>
      <div style={{ position: "absolute", left: 333, top: -612 + 1120 + 20 + narrow }}><CasePanel still={still} /></div>
    </div>
  );
};

export const Shot2: React.FC<{ g: number }> = ({ g }) => {
  const [amt] = tab(g, BLUR);
  const heavy = amt > 0.03;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(125deg, #DCEBFC 0%, #B9D4F6 28%, #8DB6F0 55%, #7FAAEE 78%, #93C3F4 100%)" }}>
      <ZoomBlur amt={amt} n={heavy ? 12 : 5} soft={heavy ? 2.5 : 0} render={() => <Plane g={g} still={heavy} />} />
    </AbsoluteFill>
  );
};
