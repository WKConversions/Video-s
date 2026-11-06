import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, Icon, Wordmark } from "./kit";
import { GigCard, MapSheet, PersonRow, AppHeader, Segmented, Chip, BookedTile } from "./ui";
import { GlobeMap } from "./map";
export const TestMap: React.FC = () => {
  const t = useCurrentFrame() / 60 + 2;
  return <AbsoluteFill style={{ background: C.bg }}>
    <GlobeMap t={t} v={{ lam0: -4.9, phi0: 36.95, k: 10, pitch: 38, d: 1.55, S: 3600, cx: 960, cy: 600 }}
      pins={["Málaga", "Marbella", "Estepona", "Fuengirola", "Torremolinos", "Nerja", "Sotogrande", "Ronda", "Sevilla", "Granada", "Cádiz"].map((n, i) => ({ name: n, at: 0.1 * i, big: n === "Málaga", count: n === "Málaga" ? 12 : n === "Marbella" ? 6 : undefined, side: (["Torremolinos", "Fuengirola", "Estepona", "Sotogrande", "Cádiz"].includes(n) ? "l" : "r") as "l" | "r" }))} />
  </AbsoluteFill>;
};
export const TestUI: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: 80, top: 60 }}><Wordmark h={110} /></div>
    <div style={{ position: "absolute", left: 80, top: 220 }}><Icon s={180} /></div>
    <div style={{ position: "absolute", left: 300, top: 220, width: 470, background: C.bg }}><AppHeader /><div style={{ padding: "0 13px" }}><Segmented on={0} /></div>
      <div style={{ display: "flex", gap: 8, padding: "12px 13px" }}><Chip label="All" on /><Chip label="Hiring" /><Chip label="Collab" /><Chip label="This week" /></div></div>
    <div style={{ position: "absolute", left: 820, top: 60 }}><GigCard g={{ tag: "HIRING", roles: "· 2 ROLES", title: "Photographer for a rooftop launch", by: "Casa Brisa", city: "Marbella", role: "Event photographer", open: "Open · 0/1", fee: "€350", time: "Sat 21 Nov", img: "clips/model-shoot.mp4" }} /></div>
    <div style={{ position: "absolute", left: 1320, top: 60 }}><MapSheet city="Marbella" count={6} rows={[{ letter: "C", title: "Live DJ for sunset sessions", sub: "Casa Brisa · Fri 20 Nov", fee: "€280" }, { letter: "A", title: "Menu redesign", sub: "Atelier Mar", fee: "On request" }]} /></div>
    <div style={{ position: "absolute", left: 1320, top: 420 }}>{[{ name: "Lucía Moreno", roles: "Photographer, Model +1", city: "Málaga", fee: "€150–€250", avail: "Most days", avatar: "img/avatars/lucia.jpg", badge: "founding" as const },
      { name: "Mateo Ruiz", roles: "Videographer", city: "Marbella", fee: "from €300", avail: "Weekends", avatar: "img/avatars/mateo.jpg", badge: "verified" as const }].map((p) => <PersonRow key={p.name} p={p} />)}</div>
    <div style={{ position: "absolute", left: 300, top: 560 }}><BookedTile mon="NOV" day="21" dow="Sat" name="Javi Ortega" at="Casa Brisa" time="Sat · 20:00" img="clips/dj-stage.mp4" /></div>
  </AbsoluteFill>
);
