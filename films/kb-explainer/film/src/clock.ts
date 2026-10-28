// The film's timing as labels (film seconds). The voice-over (vo/elevenlabs-christina.mp3, word timings from
// faster-whisper: vo/words_full.json) starts at 1.60 s; every word is a label ("w:audit"), from src/words.json. Every
// move in Story.tsx is keyed to a label, so a retime moves labels, never frame numbers.
import { timeline } from "./timeline";
import WORDS from "./words.json";

export const FPS = 30;
export const DURATION = 1740; // 58.0 s

export const BEATS: Record<string, number | string> = {
  open: 0,
  dock: 0.62,                     // the two circles meet
  grow: "w:kb-0.12",              // the circle opens into the workspace window
  cards: "w:kb+0.5",              // after the window has opened
  auto: "w:automation-0.08",      // the Automations module switches on
  runs: "w:runs-0.12",            // every module runs
  shift: "w:on-0.22",             // the window steps left
  phone: "w:on-0.12",             // the phone slides in
  chips: "w:with-0.12",           // K.B and You
  away: "w:how-0.46",             // workspace, phone and the pair leave together, before the word
  how: "w:how-0.12",
  audit: "w:we-0.22",             // the process audit window rises
  steps: "w:how2-0.1",
  friction: "w:where-0.1",
  pick: "w:and2-0.06",
  first: "w:first-0.04",
  board: "w:then-0.16",
  drag1: "w:build-0.04",
  drag2: "w:together-0.04",
  open2: "w:in-0.12",
  form: "w:intake-0.2",
  send: "w:forms+0.4",
  flow: "w:follow-0.14",
  crm: "w:crm-0.04",
  run: "w:run-0.04",
  make: "w:make-0.12",
  n8n: "w:n8n-0.12",
  ai: "w:ai-0.14",
  manual: "w:manual-0.08",
  need: "w:need-0.26",
  custom: "w:we3-0.16",
  dash: "w:dashboards-0.1",
  web: "w:websites-0.12",
  app: "w:mobile-0.16",
  tailor: "w:tailored-0.04",
  works: "w:works2-0.06",
  tools: "w:every-0.2",
  connect: "w:connected-0.08",
  flows: "w:data-0.12",
  copy: "w:copy-0.14",
  paste: "w:paste-0.04",
  team: "w:we4-0.22",
  inside: "w:inside-0.12",
  around: "w:not-0.06",
  ask: "w:so2-0.12",
  always: "w:always-0.1",
  launch: "w:and6-0.16",
  live: "w:launch-0.04",
  stay: "w:stay-0.22",            // the month calendar opens
  hosting: "w:hosting-0.08",
  maint: "w:maintenance-0.06",
  feat: "w:new-0.06",
  month2: "w:every2-0.06",
  month3: "w:business2-0.08",
  loop: "w:diagnose-0.32",        // the infinity loop draws
  b3: "w:build3-0.06",
  r2: "w:run2-0.06",
  one: "w:one-0.1",
  lift: "w:systems-0.1",
  talk: "w:talk-0.2",             // the loop gathers into the K.B logo
  cta: "w:kb2-0.06",
  rest: "w:kb2+0.5",              // the last word ends: the camera eases to rest
  end: 58.0,
};

export const T = timeline(FPS, { ...(WORDS as Record<string, number>), ...BEATS });
