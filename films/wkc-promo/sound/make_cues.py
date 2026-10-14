# Writes sound/cues.json for the WKConversions promo: every effect (wkc_sfx.py) on the reference's frame (spec/audio.md
# §4b; "#n" in each note is the table row), each used once. A cue's frame is the picture event; the effect's sync point
# (lib/sfx/index.json) puts the right moment of the sound there, so:
#   glitch swooshes start 4-5 frames before their flash (sync 0.133-0.15 s), reverse swooshes and risers stop dead on
#   their hit, sub drops peak on their cut, UI blips land on their frame, the "Built for" ticks sit on every swap
#   (f1065, 1080, 1095, 1110, 1125, 1140: the WKC list is 15 frames per statement, not the reference's 6).
# "db" sets each cue against its role level the way the reference balances it against the beat: "prominent" effects
# (glitch swooshes, the swish into "Built for") well over the beat, "medium" ones (blips, swishes, clicks) clearly on
# top, "subtle" ones (bubble pops, the ring, the ratchet) felt more than heard. Music at 0, no voice-over.
#   cd sound && python3 -I music_splice.py && python3 wkc_sfx.py && python3 make_cues.py
#   python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png && python3 master.py
import json
cues = []
def c(id, frame, note, db=0):
    cues.append({"id": id, "frame": int(frame), "note": note, "db": db})

# 0-3.3 s  "Meet", the wkc logo, the riser into DROP 1 (f99)
for k, f in enumerate([9, 18, 21, 27, 33]):
    c(f"wk-meet-{k + 1}", f, f"#1 soft tick on the 'Meet' letters ({k + 1}/5)", -1)
c("wk-glitch-logo", 46, "#2 glitch swoosh, attack f41.5, into the wkc monogram + wordmark glow (flash f46)", 4)
c("wk-riser-drop1", 99, "#3 reverse riser from 2.0 s (noise from f76.5), hard cut at f98.5 before the drop", 1)
c("wk-drop1", 99, "#4 DROP 1: 'Motion' lands on the first kick", -3)
# 3.3-7.5 s  "Motion that makes it click", "Explain. Engage. Convert."
c("wk-pop-that", 116, "#5 bubble blips: 'that makes it'", -5)
c("wk-click-word", 123, "#6 crisp click + bubble pips on 'click' (f122.5)", -1)
c("wk-glitch-engage", 169, "#8 glitch swoosh, attack f164.5: 'Engage.' (keyframe snap)", 5)
c("wk-tick-convert", 201, "#10 small tick, slightly left: 'Convert.' lights", -2)
# 7.3-10 s  "Or just look incredible."
c("wk-blip-or", 219, "#11 UI blip on the hard cut to 'Or.' (15 kHz, then 14 + 6 kHz at f221)", -1)
c("wk-swish-left", 228, "#12 swish panned left (f227.5): the dots run out", 1)
c("wk-swish-right", 237, "#13 darker swish panned right (f236.5): the dots keep growing", -1)
c("wk-swish-incredible", 245, "#14 swish from f243 + blip at f244.5: the cut to 'just look incredible'", 1)
c("wk-sparkle-incredible", 265, "#15 sparkle pop: 'incredible' snaps bold/3D", 0)
c("wk-boom-brief", 287, "#16 low boom on the step-14 pickup (9.49 s) into the cut to the brief field", -3)
# 9.7-12.5 s  "Tell us what needs explaining"
c("wk-type-brief", 291, "#17 typing data-blips: the brief is typed", 2)
c("wk-type-done", 311, "#18 two more data-blips: the brief is complete", 0)
c("wk-settle-card", 347, "#19 soft thump + tick: the brief settles into its card", -4)
# 12.7-18 s  the brief breaks into storyboard frames, compositions, the 3D tilt, the cut to "Export"
c("wk-subdrop-frames", 389, "#20 sub drop from f381, peaking as the storyboard frames fly in", -3)
c("wk-pops-frames", 384, "#21 tiny bubble pops: the storyboard frames populate", -4)
c("wk-swish-tilt", 429, "#22 short bright swish (from f427) into the 3D tilt", 2)
c("wk-pops-panel", 501, "#23 two small pops inside the 3D composition (16.70, 16.87 s)", -5)
c("wk-subdrop-export", 530, "#24 sub drop from f524, peaking on the hard cut to 'Export'", -2)
# 17.7-19.3 s  the break: the Export click, its ring, the shimmer riser into DROP 2 (f579)
c("wk-click-export", 549, "#26 the cursor clicks Export (f548.4, second click 50 ms later)", 3)
c("wk-ring-export", 551, "#27 thin 13 kHz ring, hard left: the press glow", -8)
c("wk-shimmer-drop2", 579, "#28 shimmer riser from 18.50 s, cut on the drop-2 downbeat", 1)
c("wk-drop2", 579, "#29 DROP 2: the showcase of client videos", -3)
# 19.3-24 s  the showcase
c("wk-glitch-showcase", 649, "#30 glitch swoosh, attack f644.5: hero cut inside the showcase", 4)
c("wk-pop-notify", 664, "#31 small notification pop, panned right: a second clip settles", -5)
c("wk-boom-platform", 718, "#32 low boom on the step-14 pickup into the dark 'Made for every platform'", -3)
# 24-29 s  platforms, formats, versions
c("wk-swish-publish", 751, "#33 soft mid swish drifting left: 'Made for every platform' blurs out to 'Publish anywhere'", -3)
c("wk-blip-web", 767, "#34 UI blip: the website card is selected (f766.5)", 0)
c("wk-blip-linkedin", 783, "#35 UI blip: the selection jumps to LinkedIn (f782.7)", 0)
c("wk-blip-insta", 799, "#36 reverse swell (from f797) into a rounder ping: Instagram", 2)
c("wk-ratchet", 807, "#37 ratchet ticks (from f806.4): the toggle slides, 'Multiple versions'", -2)
c("wk-revswoosh-versions", 823, "#38 reverse swoosh from f812.5, stopping dead at f823: 'One project'", 1)
# 29-33.5 s  design details, the founders
c("wk-subdrop-detail", 908, "#40 808 glide (from f906) + bright burst on the cut to 'Detail-driven design'", -3)
c("wk-blip-clear", 918, "#41 UI blip: 'Clear messaging' pops in (f917.4)", 0)
c("wk-blip-smooth", 930, "#42 UI blip: 'Smooth transitions' pops in (f928.5)", -1)
c("wk-swish-frame", 945, "#43 soft swish (from f941.4): the blur into 'Every frame intentional'", -2)
c("wk-swell-founders", 965, "#44 warm mid swell (from f954.6): the two founders' portraits blur in", -1)
c("wk-revswoosh-three", 1005, "#45 reverse swoosh f992-1003.5, stopping dead before the '3' on the f1005 kick", 1)
# 34-38.5 s  formats, "Built for"
c("wk-whoosh-formats", 1021, "#47 whoosh with a tonal core (from f1020.6): 'Formats for your website and socials' rises in", 0)
c("wk-swish-builtfor", 1065, "#48 bright swish (f1058-1063) into the cut to the first 'Built for' statement (f1065)", 4)
for k, f in enumerate([1065, 1080, 1095, 1110, 1125, 1140]):
    c(f"wk-built-{k + 1}", f, f"#49 word tick: 'Built for' statement {k + 1} of 6" + (" (and the stop of the beat)" if k == 5 else ""), 3 if k < 5 else 4)
# 38-42 s  the stop (f1140), the WKConversions logo (f1153), "Let's talk", wkconversions.com
c("wk-glitch-wkc", 1153, "#51 glitch swoosh, attack f1149: the last 'Built for' statement flashes white into the WKConversions logo", 3)
c("wk-sting-logo", 1153, "#52 logo sting: open E6/9 chord + shimmer, bright layer cut at 39.25 s", 0)
c("wk-blip-cta", 1170, "soft blip as the 'Let's talk' pill glows on (the reference's optional cue, audio.md §5)", -6)
c("wk-swell-talk", 1209, "#53 soft pad swell under 'Let's talk' (f1209-1218)", -5)
c("wk-swell-url", 1227, "#53 second soft pad swell under wkconversions.com (f1227-1240)", -5)

ids = [x["id"] for x in cues]
assert len(ids) == len(set(ids)), "a sound is used twice"
lib = {x["id"] for x in json.load(open("lib/sfx/index.json")) if x["id"].startswith("wk-")}
assert set(ids) == lib, ("unused or missing sounds", lib ^ set(ids))
assert all(0 <= x["frame"] < 1262 for x in cues)
doc = {"fps": 30, "frames": 1262, "library": "lib", "auto_level": False,       # levels as written (set by ear-proxy: band lift per effect)
       "music": {"file": "music/cant-get-you-off-my-mind-fit.wav", "at": 0, "fade_in": 0.0, "fade_out": 0.0,
                 "note": "Can't Get You Off My Mind (Michael Ramirez C., Mixkit, Mixkit Stock Music Free License), 150 BPM, cut to the reference: "
                         "drop 1 f99, break f531, drop 2 f579, stop f1140, outro pad to 41.95 s"},
       "sfx": sorted(cues, key=lambda e: e["frame"])}
json.dump(doc, open("cues.json", "w"), indent=1)
print(len(cues), "cues, every sound used once")
