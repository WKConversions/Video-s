export const meta = {
  name: 'adrian-tineo-storyboard',
  description: 'Plan the Adrian Tineo film: 3 concepts, judges, synthesis into a build spec, art-director reviews, revision',
  phases: [
    { title: 'Concepts', detail: 'three independent phrase-by-phrase storyboards from different angles' },
    { title: 'Judge', detail: 'two judges with different lenses score the concepts' },
    { title: 'Synthesize', detail: 'one plan + build spec from the winner, grafting the best of the others' },
    { title: 'Review', detail: 'art-director lenses: story, style fidelity, motion and feasibility' },
    { title: 'Revise', detail: 'apply the review decisions, revision log' },
  ],
}

const ROOT = '/home/user/Video-s/films/adrian-tineo'
const LIB = '/root/.claude/skills/synced/b040e0d1-dd81-4ca1-989d-d13523055024_5126029f-96ec-4b1a-b759-b4dcf352c4bb/senior-motion-designer/library'

const CONTEXT = `
You are a senior commercial motion designer / art director planning a film for Karl van Kessel (WKConversions, a motion design studio). Karl's client brief, verbatim:
"now make a video for this business: https://test.adrian-tineo-462.workers.dev/ — The video has to be completely in the style of the website, completely replicated style. (dont say that the same visuals has to come forward, but the style)". Read that as: the film's LOOK and MOTION must be indistinguishable from the website's design language (palette, type, components, materials, spacing, motion curve), but the film may invent new visuals in that language; it need not replay the site's exact illustrations or layouts (it may reuse some where they communicate best).

Voice-over (ElevenLabs, energetic commercial female), script:
"AI is everywhere. But making it work for your business? That's where things get complicated. / Meet Adrian Tineo, your independent AI expert. / From uncovering the right opportunities to building real solutions, Adrian connects strategy, engineering, and execution. / Explore use cases. Develop and integrate AI. Evaluate performance. Bring expert leadership directly into your team. / No hype. No guesswork. Just practical AI, built around your business. / Ready to turn AI potential into meaningful business impact? Let's talk."

Film: 1920x1080, 30 fps, 39.0 s = 1170 frames. The voice-over sits at +0.50 s. Exact word start/end times in FILM seconds are in ${ROOT}/film/src/words.json (keys like "w:ai", "w:complicated", "w:meet", "w:tineo", "w:connects", "w:strategy", "w:engineering", "w:execution", "w:explore", "w:develop", "w:integrate", "w:evaluate", "w:performance", "w:bring", "w:leadership", "w:team", "w:no", "w:hype", "w:no2", "w:guesswork", "w:practical", "w:ai4", "w:built", "w:business2", "w:ready", "w:potential", "w:impact", "w:lets", "w:talk"; repeated words are numbered). Frame of a word = round(start*30). Last word "talk." ends at 36.13 s; 36.1–39.0 s is the sign-off. Use those times for every visual event.

Project: ${ROOT}
- harvest/live/index.html, harvest/live/styles.css (the site's CSS: read it for exact tokens), harvest/live/page_text.txt (all copy), harvest/facts.md (THE TRUTH FILE: every on-screen claim must come from it or the script; never invent clients, numbers, results, testimonials).
- harvest/shots/: screenshots of the site (laptop-view00..05.png at 1440x900, desktop-full.png, mobile-full.png). LOOK AT THEM (Read tool shows images).
- assets/: the site's SVG sculptures (hero-intelligence.svg: stacked chrome/glass plates with a chrome orb; service-strategy.svg: chrome cubes stepping up to a black cube; service-build.svg: stacked plates; service-performance.svg: chrome bar chart on a black disc; service-enablement.svg: interlinked chrome/black rings), adrian-tineo.jpg (B&W portrait), favicon.svg (sage circle with "AT").
- film/src/lib.tsx (measured tokens: C palette, EASE = the site's only curve cubic-bezier(.22,1,.36,1), reveal() = the site's reveal: fade + rise over 0.85 s with 80-100 ms sibling steps, float() = the site's 9 s / 7 s breathing floats) and film/src/kit.tsx (components already built at film scale: Ambient (dark gradient field with blurred blobs), Shell (the rounded paper site shell), Wordmark ("Adrian Tineo" + dot), Eyebrow (tiny uppercase 0.2em with sage status dot), Headline (two-tone: ink line + grey #777772 line, weight 650, -0.054em), Body, Card + Well (white card, 6px inner padding, pale well with number), Tag (floating pill with icon tile, pale or dark), Button (dark #171716 with arrow up-right; light on dark panel), TextLink, Rule, Icon (arrow-up-right, arrow-down, check, lock, plus, asterisk), Sculpture (the site's SVGs), MetalDefs (the site's chrome/glass/orb SVG gradients for drawing NEW sculptures in the same material)). A test frame of the kit is at film/out/test/f0030.png.

The style, in short (verify against the CSS and screenshots): warm paper #f4f4f2 inside a rounded shell floating over a dark ambient gradient (#090909 -> #4b4b49 -> #b0b0aa); near-black ink #151514; muted #71716e; hairlines #ddddd8; ONE quiet sage accent (#88a397 status dot / #a5beb8); Manrope only; headlines weight 650 with tight negative tracking and a grey second line; tiny uppercase eyebrows with wide tracking; generous white space; white cards, floating tags, numbered rows 01/02/03 with hairlines, dark CTA panel #141413 with a faint arc; monochrome chrome-and-glass 3D sculptures with soft ground shadows; B&W photography. Motion on the site: one curve (.22,1,.36,1), calm reveals (fade + 22px rise, 0.85 s, staggered 80-100 ms), slow floats, hover lifts of 3-6 px, image scale 1.06 on hover. No bounce, no glow, no neon, no color beyond the palette.

Karl's standing rules (read the top of ${LIB}/examples/corrections.md for the full list): every phrase gets its own visual event on its key word, never more than 2.5 s of voice over an unchanged picture; one continuous stage where objects persist and transform (carry, don't duplicate; nothing appears from nothing); transitions grow out of a nameable object; show the meaning of the line, not subtitles (words on screen only where they communicate better than a picture; the site itself is type-led, so short type in the site's headline style is legitimate, but never a karaoke of the voice-over); few, big things on screen (about 4 separate things max); readable on a phone with sound off; median motion about 4% of the frame (calm, premium, matches the site); the camera only breathes, no fast pans/zooms on transitions; one motion identity; no AI-tells (centered everything, gradient blobs everywhere, generic icons per noun, glow, bounce).

The skill library (Karl's approved knowledge) is at ${LIB}. Relevant modules: planning/script-analysis.md, planning/phrase-by-phrase.md, planning/visual-strategy.md, planning/storytelling.md, motion/motion-identity.md, motion/transitions.md, motion/timing.md, motion/continuity.md, design/three-d.md, design/composition.md, design/typography.md, design/anti-ai-design.md, evaluation/tells.md, evaluation/art-director.md, references/technique-catalogue.md, references/visual-dictionary.md, examples/corrections.md, examples/bad-vs-good.md. Read what your step needs (not the whole library).
The build will be in Remotion (React, CSS transforms, inline SVG); anything you plan must be buildable that way in a few hundred lines per segment (chrome sculptures = SVG with the site's gradients, or the site's own SVGs; no real 3D engine, but CSS 3D transforms are fine; no stock footage needed).
`

const CONCEPT_SCHEMA = { type: 'object', properties: {
  file: { type: 'string' }, title: { type: 'string' }, thesis: { type: 'string' }, thread_object: { type: 'string' },
  summary: { type: 'string', description: 'one paragraph: the film beat by beat' },
}, required: ['file', 'title', 'thesis', 'thread_object', 'summary'] }

const ANGLES = [
  { key: 'A', name: 'object-led', brief: 'Lead with the site\'s chrome-and-glass sculpture language: ONE sculptural thread object (in the site\'s material) that persists for the whole film and transforms to show each line (scattered/everywhere -> tangled/complicated -> resolved by Adrian -> the four services as four forms -> built around your business -> the CTA). Type in the site\'s headline style only where it beats a picture.' },
  { key: 'B', name: 'interface-led', brief: 'Lead with the site\'s own interface components choreographed as a living page: the shell, eyebrows, two-tone headlines, white cards with wells, floating tags, numbered rows with hairlines, buttons, the dark CTA panel. The film reads like the website coming alive, but every layout is new and built for the film\'s lines; a framing device (the shell over the ambient field) may open and close the film.' },
  { key: 'C', name: 'editorial-typographic', brief: 'Lead with the site\'s editorial typography and white space: big two-tone headlines, tiny eyebrows, hairline rules and numbers as the main actors, choreographed with precise kinetic type (never karaoke), punctuated by the sculptures and the B&W portrait at the moments that need a picture. Strong contrasts of scale; asymmetric left-aligned layouts like the site (centered only for statement headlines, like the site\'s centered section heading).' },
]

phase('Concepts')
const concepts = (await parallel(ANGLES.map(an => () => agent(`${CONTEXT}

YOUR TASK: write one complete storyboard concept for this film from the ${an.name.toUpperCase()} angle. ${an.brief}

Process (follow the skill's planning modules; read planning/phrase-by-phrase.md, planning/visual-strategy.md, motion/motion-identity.md, evaluation/tells.md and the top of examples/corrections.md first; look at the site screenshots):
1. Beats and phrases: list every phrase of the voice-over with its film start/end seconds and frame numbers (from words.json) and its key word.
2. Thesis of the film and the patterns it allows; the thread object; the motion identity (personality, signature curve = the site's, duration palette in frames, entrance pattern).
3. For EVERY phrase: the visual event on its key word (what changes, where, how big), the composition (primary / secondary / detail, positions in px on the 1920x1080 frame), the motion (frames, ease), and how it carries into the next phrase (the transition grows out of which object). No phrase may hold an unchanged picture for more than 2.5 s.
4. A continuity table (objects, when they appear, how they transform, when they leave).
5. For each beat, the runner-up idea you rejected and why.
6. Sound hints (where the SFX accents land), and the sign-off (36.1-39.0 s: what is on screen at the end; do not show the test URL).
Write it to ${ROOT}/storyboard/concept-${an.key}.md (markdown, precise enough to build from). Then return the schema fields (file = that path).`, { label: `concept:${an.key}-${an.name}`, phase: 'Concepts', schema: CONCEPT_SCHEMA })))).filter(Boolean)
log(`${concepts.length} concepts written`)

const JUDGE_SCHEMA = { type: 'object', properties: {
  scores: { type: 'array', items: { type: 'object', properties: { concept: { type: 'string' }, score: { type: 'number' }, strengths: { type: 'string' }, weaknesses: { type: 'string' } }, required: ['concept', 'score', 'strengths', 'weaknesses'] } },
  winner: { type: 'string' }, grafts: { type: 'array', items: { type: 'string' }, description: 'specific ideas from the other concepts worth grafting onto the winner, each with the phrase it serves' },
}, required: ['scores', 'winner', 'grafts'] }

phase('Judge')
const LENSES = [
  'COMMUNICATION AND STORY: does every phrase read in about one second with the sound off, is the meaning shown (not subtitled), is there one strong idea per beat, does the film build to the CTA, is the hook strong, is Adrian himself present and credible, is anything untrue (check harvest/facts.md)?',
  'STYLE FIDELITY AND CRAFT: would Karl\'s client recognise the website in every frame (palette, Manrope two-tone headlines, eyebrows, cards, tags, shell, chrome sculptures, B&W photo, the site\'s calm motion curve)? Any colour, effect, or motion the site would never use? Is it buildable in Remotion with the kit at high polish in the time available, with few big things per frame and ~4% median motion? Any AI-tells (evaluation/tells.md)?',
]
const judgements = (await parallel(LENSES.map((lens, i) => () => agent(`${CONTEXT}

YOUR TASK: judge these storyboard concepts through one lens: ${lens}
Read each concept file in full and look at the site screenshots (harvest/shots/laptop-view00..05.png). Concepts:
${concepts.map(c => `- ${c.title}: ${c.file} (thread object: ${c.thread_object}; thesis: ${c.thesis})`).join('\n')}
Score each 1-10 for your lens, name the winner for your lens, and list concrete grafts (ideas from the non-winners, tied to the phrase they serve) worth putting into the winner.`, { label: `judge:${i ? 'style' : 'story'}`, phase: 'Judge', schema: JUDGE_SCHEMA })))).filter(Boolean)

const SYN_SCHEMA = { type: 'object', properties: {
  plan: { type: 'string' }, spec: { type: 'string' }, segments: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, from: { type: 'number' }, to: { type: 'number' }, file: { type: 'string' }, contents: { type: 'string' } }, required: ['id', 'from', 'to', 'file', 'contents'] } },
  summary: { type: 'string' },
}, required: ['plan', 'spec', 'segments', 'summary'] }

phase('Synthesize')
const syn = await agent(`${CONTEXT}

YOUR TASK: write the film's final plan and build spec. Concepts: ${concepts.map(c => c.file).join(', ')}.
Judges' verdicts (JSON): ${JSON.stringify(judgements)}
Take the strongest concept overall (weigh both lenses; style fidelity is a hard requirement from the client), graft the listed ideas that make it stronger, and resolve conflicts. Read the concept files, the CSS, the kit (film/src/kit.tsx, film/src/lib.tsx) and words.json.
Write:
1. ${ROOT}/storyboard/plan.md: brief (assumptions stated), thesis and allowed patterns, thread object, motion identity (the site's curve; durations; entrance pattern; intensity by moment), the phrase table (every phrase: time, key word, visual event), continuity table, transitions, sound plan (music character: calm, premium, minimal electronic/piano with a clear pulse that suits an AI consultant; SFX accents listed with film times), the sign-off, and the rejected runner-ups.
2. ${ROOT}/storyboard/spec.md: the BUILD SPEC. Split the film into 5-6 contiguous build segments (each a separate .tsx file, e.g. film/src/seg1_hook.tsx ...) with frame ranges; for each segment, every element with exact geometry (px on 1920x1080), sizes, colours (token names from lib.tsx C), kit components to use, the timing of every move as word labels (W("w:key", offsetSeconds)) with durations in frames and eases (EASE/MOVE/INOUT/DEPART from lib.tsx), and new sculptures described precisely enough to draw in SVG with MetalDefs. Crucially, specify the HAND-OFF STATE at every segment boundary (which objects cross the boundary, their exact position/size/state at the boundary frame) so independent builders produce a seamless film; objects that cross a boundary must be owned by ONE segment for their whole life or handed over at a frame where they are at rest, with identical geometry on both sides. Also specify the shared stage (background layers: ambient field, shell, paper, dark panel) and which segment owns them.
Return the paths, the segment list (id, from frame, to frame, file, contents), and a summary.`, { label: 'synthesize', phase: 'Synthesize', schema: SYN_SCHEMA })

const REVIEW_SCHEMA = { type: 'object', properties: {
  findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, where: { type: 'string' }, before: { type: 'string' }, after: { type: 'string' }, why: { type: 'string' } }, required: ['severity', 'where', 'before', 'after', 'why'] } },
}, required: ['findings'] }

phase('Review')
const REVIEWS = [
  'STORY, TRUTH AND LEGIBILITY (evaluation/art-director.md): every phrase shown on its key word, the meaning legible in one second with sound off on a phone, no more than 2.5 s unchanged, one strong idea per beat, few big things, every claim in harvest/facts.md, the hook and the CTA strong, Adrian credible (his portrait used well).',
  'STYLE FIDELITY: compare against the CSS and screenshots item by item: palette (only the site\'s colours), type (Manrope 650 tight two-tone headlines, eyebrows, body), components (cards, wells, tags, buttons, rows, shell, dark panel), materials (chrome/glass sculptures, ground shadows, B&W photo), spacing and white space, and motion (the site\'s curve, calm reveals, slow floats). Also the AI tells (evaluation/tells.md, design/anti-ai-design.md): count fingerprints.',
  'MOTION, CONTINUITY AND BUILDABILITY (motion/continuity.md, motion/transitions.md, motion/timing.md, production/remotion.md, production/build-gotchas.md): cause -> motion -> consequence, carry don\'t duplicate, transitions growing out of named objects, camera only breathing, ~4% median motion, segment hand-offs exact and seamless, every spec item buildable in Remotion with transforms and SVG at full polish, no frame-number contradictions with words.json.',
]
const reviews = (await parallel(REVIEWS.map((lens, i) => () => agent(`${CONTEXT}

YOUR TASK: art-director review of the plan ${syn.plan} and build spec ${syn.spec} through one lens: ${lens}
Read both files in full, the site screenshots, and the modules named. Report findings ranked by severity as Before / After / Why, each concrete enough to apply to the spec (where = segment/phrase/element). Only real problems; no padding.`, { label: `review:${['story', 'style', 'motion'][i]}`, phase: 'Review', schema: REVIEW_SCHEMA })))).filter(Boolean)
const allFindings = reviews.flatMap(r => r.findings)
log(`${allFindings.length} review findings (${allFindings.filter(f => f.severity === 'blocker').length} blockers)`)

phase('Revise')
const rev = await agent(`${CONTEXT}

YOUR TASK: revise the plan ${syn.plan} and the build spec ${syn.spec} with these art-director findings (JSON): ${JSON.stringify(allFindings)}
Apply every blocker and major finding (or, where one is wrong, say why); apply minors where they help. Keep the segment split and hand-off states consistent after your changes (re-check every boundary). Add a revision log section to plan.md (Before / After / Why rows). Edit the files in place.
Return the final segment list and a summary of what changed.`, { label: 'revise', phase: 'Revise', schema: SYN_SCHEMA })

return { concepts, judgements, synthesis: syn, findings: allFindings, revision: rev }
