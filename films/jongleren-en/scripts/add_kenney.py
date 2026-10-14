# Adds the CC0 interface sounds this film uses (Kenney "Interface Sounds" 1.0, kenney.nl, Creative Commons
# Zero: public domain, no credit needed) to the film's sound library next to the generated ones.
#   python3 scripts/add_kenney.py <folder of Kenney .ogg/.wav files> <kenney index.json from sfx_index.py>
# Run from films/gohere. Writes sound/lib/sfx/<category>/kenney-<name>.wav and their index entries.
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, IDX = sys.argv[1], sys.argv[2]
LIB = os.path.join(ROOT, "sound", "lib", "sfx")
# name: (category, what it is for in this film)
PICK = {
    "select_002": ("tap", "soft short blip: a finger touching the screen"),
    "click_001": ("tap", "crisp mouse click: the cursor in the portal"),
    "drop_003": ("pop", "warm low bloop: a place, a pin, a tile landing"),
    "maximize_009": ("appear-rise", "soft rising blip: a sheet or card opening"),
    "tick_004": ("ticker", "soft light tick: one step of a cascade"),
    "select_001": ("tap", "soft short blip, a little brighter: a row lighting up"),
}
measured = {o["id"]: o for o in json.load(open(IDX))}
index_path = os.path.join(LIB, "index.json")
index = [o for o in json.load(open(index_path)) if not o["id"].startswith("kenney-")]
for name, (cat, character) in PICK.items():
    m = measured[name.replace("_", "-")]
    src = next(os.path.join(SRC, f) for f in os.listdir(SRC) if os.path.splitext(f)[0] == name)
    os.makedirs(os.path.join(LIB, cat), exist_ok=True)
    rel = f"sfx/{cat}/kenney-{name.replace('_', '-')}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ar", "48000", "-ac", "2", os.path.join(ROOT, "sound", "lib", rel)], check=True)
    index.append({"id": f"kenney-{name.replace('_', '-')}", "file": rel, "category": cat, "character": character,
                  "licence": "cc0", "sync": round(m["sync"], 3), "length": round(m["duration"], 3),
                  "source": "Kenney Interface Sounds 1.0 (kenney.nl), CC0"})
json.dump(index, open(index_path, "w"), indent=1)
print(f"{len(PICK)} Kenney sounds added; library has {len(index)} sounds")
