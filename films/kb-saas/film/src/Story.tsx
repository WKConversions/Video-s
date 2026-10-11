import React from "react";
import { AbsoluteFill } from "remotion";
import { C, at } from "./lib";
import { KBTile, KBWord, Cursor, Chip, ToolTile, Typed, Shimmer, Card } from "./ui";

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ background: C.page }}>
    <div style={at(260, 260)}><KBTile size={240} /></div>
    <div style={at(560, 260)}><KBWord size={120} /></div>
    <div style={at(1000, 240)}><Cursor size={90} label="Your team" /></div>
    <div style={at(1400, 260)}><Chip text="Running" size={40} /></div>
    {["mail", "calendar", "sheet", "crm", "invoice", "chat", "folder", "form", "cart", "database"].map((n, i) => (
      <div key={n} style={at(200 + i * 170, 560)}><ToolTile icon={n} size={130} label={n} /></div>
    ))}
    <div style={at(960, 820)}><Card w={1200} h={150} r={75} style={{ display: "flex", alignItems: "center", paddingLeft: 60 }}>
      <Typed text="What if everything just worked together?" n={30} size={56} /></Card></div>
    <div style={at(960, 990)}><Shimmer text="K.B is building your workflow" size={44} t={g / 30} /></div>
  </AbsoluteFill>
);
