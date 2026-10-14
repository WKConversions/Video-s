# The Gucci film's cue sheet: the supplied voice-over, the music bed and a sparse effect on the moves that carry
# meaning (a luxury film: low swells, deep swishes, two impacts, no UI clicks), on the same labels as the picture.
#   python3 scripts/cues.py            (run from films/gucci; writes sound/cues.json)
#   python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, "film", "src", "words.json")))
FPS, END = 30, 35.4
L = dict(W)
L.update({"hook": 0.0, "few": W["w:its"] - 0.25, "since": W["w:since"] - 0.3, "ind": W["w:individuality"] - 0.05, "pres": W["w:prestige"] - 0.05,
          "sty": W["w:style"] - 0.05, "detail": W["w:every"] - 0.25, "legacy": W["w:every2"] - 0.2, "goods": W["w:from"] - 0.15, "wear": W["w:gucci2"] - 0.15,
          "presence": W["w:it"] - 0.15, "crowd": W["w:not"] - 0.2, "pause": W["w:it2"] + 0.35, "brand": W["w:gucci3"] - 0.25})
cues = []
def cue(label, off, sid, db=0, pitch=0, note=""):
    cues.append({"frame": max(0, round((L[label] + off) * FPS)), "id": sid, "db": db, **({"pitch": pitch} if pitch else {}), "note": note})

cue("hook", 0.0, "gen-swell", -12, -3, "the crowd")
cue("few", 0.0, "gen-whoosh-deep", -5, note="the crowd narrows to one beam")
cue("w:1921", -0.1, "gen-impact-deep", -3, note="1921")
cue("w:italian", -0.05, "gen-whoosh-medium", -12, -2, "the seam opens on the craft")
cue("ind", 0.0, "gen-whoosh-short", -14, -2, "individuality")
cue("pres", 0.0, "gen-whoosh-short", -14, 0, "prestige")
cue("sty", 0.0, "gen-whoosh-short", -14, 2, "style")
cue("w:intention", 0.0, "gen-shimmer", -15, -4, "the thread")
cue("legacy", 0.0, "gen-whoosh-short", -13, -3, "the legacy")
cue("w:legacy", 0.0, "gen-riser-1s", -16, -3, "the Web stripe draws")
cue("w:crafted", -0.1, "gen-whoosh-short", -14, -2, "leather goods")
cue("w:distinctive", -0.1, "gen-whoosh-short", -14, 1, "fashion")
cue("wear", 0.0, "gen-whoosh-medium", -12, -3, "the halves close into one")
cue("w:cannot", -0.1, "gen-whoosh-whip", -13, -3, "the copies")
cue("w:replicated", 0.15, "gen-impact-soft", -12, -3, "they fall away")
cue("w:stand", -0.05, "gen-whoosh-deep", -5, note="the crowd parts")
cue("pause", 0.0, "gen-riser-2s", -12, -2, "the light becomes a line")
cue("w:gucci3", -0.05, "gen-impact-deep", -2, note="GUCCI")
cue("w:gucci3", 0.05, "gen-shimmer", -11, -5, "the name")

out = {"fps": FPS, "frames": round(END * FPS), "library": "../../alumni/sound/lib",
       "vo": {"file": "../vo/vo.mp3", "at": 0, "compress": True},
       "music": {"file": "bed.wav", "at": 0.6, "lufs": -22, "duck_db": 5, "fade_in": 0.3, "fade_out": 0.8, "lifts": [[32.8, 35.4, 3]]},
       "sfx": sorted(cues, key=lambda c: c["frame"])}
json.dump(out, open(os.path.join(ROOT, "sound", "cues.json"), "w"), indent=1)
print(len(cues), "cues")
