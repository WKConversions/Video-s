# Paces the Danish voice-over (same take as v5, 53.6 s) for v6: silence is inserted between sentences so every scene can
# finish its move before the voice goes on (Karl, intelligence film: "soms wat leeg in de voice-over ... zin voor zin";
# Willads: "ours is 65 seconds and calm"). Cuts sit in the middle of the existing pauses. Writes vo_paced.mp3,
# words_paced.json (word starts, film seconds) and sentences_paced.json.   python3 pace.py
import json, subprocess
S = json.load(open("sentences.json")); W = json.load(open("words.json"))
LEAD = 0.5
GAP = {2: 1.2, 3: 1.2, 4: 0.3, 6: 0.6, 8: 0.4, 11: 0.9, 16: 0.3, 19: 0.9, 22: 0.4, 28: 0.9, 32: 0.9, 34: 0.4, 37: 0.5}  # after sentence i
cuts, shift, acc = [], {}, LEAD
for s in S:
    shift[s["i"]] = acc
    if s["i"] in GAP and s["i"] < len(S):
        nxt = S[s["i"]]; cuts.append(((s["end"] + nxt["start"]) / 2, GAP[s["i"]])); acc += GAP[s["i"]]
words = {}
for k, t in W.items():
    i = max([s["i"] for s in S if s["start"] <= t + 0.06] or [1])
    words[k] = round(t + shift[i], 3)
sents = [dict(s, start=round(s["start"] + shift[s["i"]], 3), end=round(s["end"] + shift[s["i"]], 3)) for s in S]
# ffmpeg: lead silence, then the take cut at the pause midpoints with silence between the pieces
edges = [0] + [c for c, _ in cuts] + [None]
parts, f = [], []
f.append(f"anullsrc=r=44100:cl=mono,atrim=0:{LEAD}[z0]"); parts.append("[z0]")
for j in range(len(edges) - 1):
    a, b = edges[j], edges[j + 1]
    f.append(f"[0:a]atrim={a}" + (f":{b}" if b is not None else "") + f",asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[p{j}]"); parts.append(f"[p{j}]")
    if j < len(cuts):
        f.append(f"anullsrc=r=44100:cl=mono,atrim=0:{cuts[j][1]}[z{j+1}]"); parts.append(f"[z{j+1}]")
f.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "vo.mp3", "-filter_complex", ";".join(f), "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "192k", "vo_paced.mp3"], check=True)
json.dump(words, open("words_paced.json", "w"), indent=1); json.dump(sents, open("sentences_paced.json", "w"), indent=1)
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "vo_paced.mp3"], capture_output=True, text=True).stdout)
print(f"paced: {d:.2f} s (was 53.6), +{acc:.1f} s of air")
for s in sents: print(f"{s['i']:2d} {s['start']:6.2f}-{s['end']:6.2f} {s['first_key']:>14} | {s['text']}")
