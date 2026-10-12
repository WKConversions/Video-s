// The film's stage: the ground colour (changed only while something covers the whole frame), then the three parts.
import React from "react";
import { C, W } from "./lib";
import { BrandLogo, SceneA } from "./SceneA";
import { Overlays, ServiceList, Shots } from "./SceneB";
import { Agreement, Freedom, Less, OwnerBack, Phone, SignOff, fieldsC } from "./SceneC";

/** The opening's sky: the orange house against Málaga blue, and the white chores read against it. */
const SKY = "#CFE8F7";
const Ground: React.FC<{ g: number }> = ({ g }) => {
  const mid = g >= W("w:one2", 1.0) && g < fieldsC.free0() + 30;      // under full-frame footage the whole time
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: g < W("w:one2", 1.0) ? SKY : mid ? C.sandPale : C.page }} />
    </>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Ground g={g} />
    <SceneA g={g} />
    <BrandLogo g={g} />
    {/* the backdrops (real life, full frame), then what floats over them */}
    <Shots g={g} />
    <OwnerBack g={g} />
    <Overlays g={g} />
    <Agreement g={g} />
    <ServiceList g={g} />
    <Phone g={g} />
    <Less g={g} />
    <Freedom g={g} />
    <SignOff g={g} />
  </div>
);
