// Load a GLB from public/ before the frame is taken (Remotion waits on delayRender). Call outside the canvas, and put
// <DrawWhenReady ready={...} /> inside the canvas: Remotion's canvas only draws when the frame changes, so after an
// asset arrives the scene has to be drawn once more before the frame may be taken.
import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const cache: Record<string, Promise<THREE.Group>> = {};

export const loadGlb = (src: string) => {
  if (!cache[src]) {
    cache[src] = new Promise((res, rej) => new GLTFLoader().load(staticFile(src), (g) => res(g.scene), undefined, rej));
  }
  return cache[src];
};

/** Loads several GLBs; returns null until all are in. Holds the frame until <DrawWhenReady> has drawn them. */
export const useGlbs = (srcs: string[]) => {
  const key = srcs.join("|");
  const [scenes, setScenes] = useState<THREE.Group[] | null>(null);
  const [handle] = useState(() => delayRender(`glb ${key}`, { timeoutInMilliseconds: 180000 }));
  useEffect(() => {
    Promise.all(key.split("|").map(loadGlb)).then(setScenes).catch((e) => { console.error(e); continueRender(handle); });
  }, [key, handle]);
  return { scenes, handle };
};

export const DrawWhenReady: React.FC<{ ready: boolean; handle: number }> = ({ ready, handle }) => {
  const { advance } = useThree();
  useLayoutEffect(() => {
    if (!ready) return;
    advance(performance.now(), true);
    requestAnimationFrame(() => { advance(performance.now(), true); requestAnimationFrame(() => continueRender(handle)); });
  }, [ready, handle, advance]);
  return null;
};
