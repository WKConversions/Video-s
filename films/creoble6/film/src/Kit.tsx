// Kit check (not in the film): one view per 60 frames, for contact sheets of the kit pieces.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./lib";
import { Stage3D, Plane, cam, project } from "./cam";
import { WizardWindow, WIZ_WIN, WIZ_R, SiteWindow, SITE_WIN, HostingCard, CARD, Cursor } from "./ui";
import { Kinetic, TYPE } from "./type";
import { Spinner, Icon, Dots, dotsAt, BOX_C } from "./dots";
import { Wordmark } from "./shared";

export const Kit: React.FC = () => {
  const fr = useCurrentFrame(), v = Math.floor(fr / 60), g = (fr % 60) / 2 + 30;
  if (v === 0) {
    const c = cam({ x: 0, y: -120, z: -700, rx: -10, ry: 14, ap: 16, focus: 1600 + 0 });
    const P = { x: 0, y: 0, z: -900 };
    const pt = project(c, { x: P.x - WIZ_WIN.w / 2 + WIZ_R.name.x + 150, y: P.y - WIZ_WIN.h / 2 + 46 + WIZ_R.name.y + 30, z: P.z });
    return (<AbsoluteFill style={{ background: C.bg }}><Stage3D cam={c}><Plane {...P} w={WIZ_WIN.w} h={WIZ_WIN.h} farBlur={10} farMask="linear-gradient(90deg, #000 30%, transparent 85%)"><WizardWindow g={g} name="Holm Fysio" focus="name" caret caretSolid /></Plane></Stage3D><Cursor x={pt.x} y={pt.y} /></AbsoluteFill>);
  }
  if (v === 1) {
    const c = cam({ x: 0, y: 0, z: 0, rx: 0, ry: 0, ap: 18 });
    return (<AbsoluteFill style={{ background: C.bg }}><Stage3D cam={c}><Plane x={0} y={0} z={-500} rx={22} ry={-18} w={SITE_WIN.w} h={SITE_WIN.h} farBlur={12} farMask="linear-gradient(180deg, transparent 0%, #000 45%)"><SiteWindow scroll={120} /></Plane></Stage3D></AbsoluteFill>);
  }
  if (v === 2) {
    const c = cam({ x: 0, y: 0, z: -40, ry: 2, ap: 12, focus: 1660 });
    return (<AbsoluteFill style={{ background: C.bg }}><Stage3D cam={c}><Plane x={0} y={0} z={-100} ry={-3} w={CARD.w} h={CARD.h}><HostingCard g={g} rows={3} active={[1, 0.5, 0]} price={1} /></Plane></Stage3D></AbsoluteFill>);
  }
  if (v === 3) {
    const items = [{ t: "Ingen", at: 0 }, { t: "teknik.", at: 0.3, out: 1.2, accent: true }, { t: "skabeloner.", at: 1.2, accent: true }];
    return (<AbsoluteFill style={{ background: C.bg }}><div style={{ position: "absolute", left: 960, top: 540 }}><Kinetic g={(fr % 60) * 1.0 + 20} items={items} size={TYPE.hero} /></div>
      <div style={{ position: "absolute", left: 960, top: 820 }}><Kinetic g={60} items={[{ t: "Byg", at: 0 }, { t: "den.", at: 0.2 }, { t: "Se", at: 0.4 }, { t: "den.", at: 0.6, accent: true }, { node: <div style={{ width: 30, height: 30, borderRadius: 15, background: C.sage }} />, w: 30, at: 0 }]} size={TYPE.line} /></div></AbsoluteFill>);
  }
  const s = 300;
  return (<AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: 420, top: 540 }}><Spinner g={g} size={s} /></div>
    <div style={{ position: "absolute", left: 960, top: 540 }}><Icon size={300} /></div>
    <div style={{ position: "absolute", left: 1330, top: 540 }}><Dots dots={dotsAt(180, (50 - BOX_C.x) * 1.8 + 0, (50 - BOX_C.y) * 1.8)} color={C.ink} /></div>
    <div style={{ position: "absolute", left: 1450, top: 520 }}><Wordmark h={60} /></div>
  </AbsoluteFill>);
};
