// The film's timing as labels in seconds (film time = voice-over time + 1.0 s pre-roll). Word labels come from the
// force-aligned VO (vo/words.json → src/words.json, "w:word" keys, repeats numbered: w:story2). Beats are named moves.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const VO_AT = 1.0;
export const DURATION = 2100; // 70.0 s

export const BEATS: Record<string, number> = {
  open: 0,
  // B1 home (night, shadow theatre)
  window: 1.25, walk: 1.9, door: 2.75, inside: 3.55,
  quote1: 3.62, thought: 5.35, unsaid: 7.9,
  // B2 the turn
  adult: 8.55, closer: 10.0, q1: 11.9, q2: 12.15, q3: 12.4, qoff: 12.9,
  book: 13.45, bloom: 14.1,
  // B3 a moment becomes an adventure
  bookUp: 14.9, logo: 15.45, memory: 16.6, today: 17.45, flip: 18.25, paint: 18.95,
  illus: 19.7, adventure: 20.35, hero: 21.85,
  // B4 inside the story
  inside2: 23.55, mossa: 24.55, amina: 25.7, listen: 27.5, read: 28.2, lens: 28.95, decide: 30.15,
  choose: 32.65, star: 33.25,
  // B5 consequence
  map: 34.1, split: 35.8, next: 36.7, together: 37.55, differently: 38.9, close: 41.3, shelf: 42.2,
  ends: 43.6, endmark: 44.45,
  // B6 the conversation
  room2: 45.35, friend: 46.3, answer: 47.3, talk: 48.3, quiet: 49.9,
  // B7 the world
  sky: 51.35, cards: 51.9, one: 53.75, world: 55.9, astro: 56.3, tomorrow: 58.2, morgon: 59.0,
  // B8 sign-off
  logoEnd: 60.75, tag: 61.9, line2: 63.95, line3: 65.85, url: 66.9, end: 70.0,
};

export const T = timeline(FPS, { ...BEATS, ...(WORDS as Record<string, number>) });
export const f = T.f;
