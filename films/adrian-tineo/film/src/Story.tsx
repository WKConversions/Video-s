// The film's stage (placeholder: a style sheet of the kit until the scenes are built).
import React from "react";
import { C } from "./lib";
import { Ambient, Body, Button, Card, Eyebrow, Headline, Sculpture, Shell, Tag, Well, Wordmark } from "./kit";

export const Story: React.FC<{ g: number }> = () => (
  <div style={{ position: "absolute", inset: 0, background: C.paper }}>
    <Ambient />
    <Shell x={64} y={54} w={1792} h={972}>
      <div style={{ position: "absolute", left: 96, top: 60 }}><Wordmark /></div>
      <div style={{ position: "absolute", left: 96, top: 210 }}><Eyebrow text="Independent AI consulting" dot /></div>
      <div style={{ position: "absolute", left: 96, top: 270 }}><Headline lines={["AI expertise.", "Business impact."]} size={128} /></div>
      <div style={{ position: "absolute", left: 96, top: 580, width: 760 }}><Body size={32} color={C.desc}>Turn the possibilities of AI into something your business can actually use.</Body></div>
      <div style={{ position: "absolute", left: 96, top: 740 }}><Button text="Let’s talk" /></div>
      <div style={{ position: "absolute", left: 1000, top: 120 }}>
        <Card w={600}><Well w="100%" h={480} num="01"><Sculpture name="service-strategy" size={560} style={{ marginTop: -40 }} /></Well></Card>
      </div>
      <div style={{ position: "absolute", left: 900, top: 760 }}><Tag text="A clear direction" icon="arrow-up-right" /></div>
      <div style={{ position: "absolute", left: 1300, top: 840 }}><Tag text="A real-world advantage" glyph="✳" dark /></div>
    </Shell>
  </div>
);
