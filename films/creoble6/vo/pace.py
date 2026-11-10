# Creoble v6, the voice-over Karl sent on 10 Nov (Christina, Danish, 57.4 s; the script Willads' feedback refers to).
# Adds a little air between scenes (cuts in the middle of the existing pauses) and writes vo_paced.mp3, the word
# starts (film seconds) as ../film/src/words.json, and sentences_paced.json.   python3 pace.py
import json, re, subprocess
W = json.load(open("whisper_words.json"))          # [word, start, end] from faster-whisper (small)
SCRIPT = ["De fleste virksomheder har en hjemmeside, de ikke er stolte af.", "Eller slet ingen.",
 "Med Creoble fortæller du kort om din virksomhed.", "Navn, branche, hvad du laver og hvordan man kontakter dig.",
 "Så bygger Creoble siden til dig.", "Tekst, billeder og opbygning, alt sammen ud fra det du skrev.",
 "Du ser hele siden før du betaler en krone.", "Og vil du ændre noget, skriver du det bare.",
 "Når du er tilfreds, vælger du selv.", "Download siden én gang for alle, eller lad os sætte den online for 99 kroner om måneden.",
 "Uden binding.", "Vælger du hosting, får du dit eget dk-domæne.", "E-mail på domænet og siden online på europæiske servere.",
 "Det hele sættes op for dig.", "Får du nye priser eller et nyt billede, skriver du det i dit panel og siden opdateres.",
 "Du rører aldrig en linje kode.", "Du kan stoppe når som helst.", "Prisen er den samme hvert år.",
 "Og skriver du til os, svarer en dansker.", "Byg din side gratis på creoble.dk"]
LEAD = 0.4
GAP = {2: 0.9, 4: 0.5, 6: 0.6, 8: 0.5, 11: 0.6, 14: 0.6, 16: 0.4, 19: 0.8}     # silence added after sentence i
# whisper splits "E -mail", "DK -domane", "Creeable .dk": merge tokens that start with "-" or "." into the previous
T = []
for w, a, b in W:
    if T and (w.startswith("-") or w.startswith(".")): T[-1][2] = b
    else: T.append([w, a, b])
words = [w for s in SCRIPT for w in s.split()]
assert len(words) == len(T), (len(words), len(T))
sents, i = [], 0
for n, s in enumerate(SCRIPT, 1):
    k = len(s.split()); sents.append({"i": n, "text": s, "start": T[i][1], "end": T[i + k - 1][2], "a": i, "b": i + k}); i += k
shift, cuts, acc = {}, [], LEAD
for s in sents:
    shift[s["i"]] = acc
    if s["i"] in GAP: nxt = sents[s["i"]]; cuts.append(((s["end"] + nxt["start"]) / 2, GAP[s["i"]])); acc += GAP[s["i"]]
keys, seen = {}, {}
lines = []
for s in sents:
    row = []
    for j in range(s["a"], s["b"]):
        base = re.sub(r"[^a-z0-9]", "", words[j].lower().replace("æ", "").replace("ø", "").replace("å", "").replace("é", "")) or "x"
        seen[base] = seen.get(base, 0) + 1; key = "w:" + base + (str(seen[base]) if seen[base] > 1 else "")
        keys[key] = round(T[j][1] + shift[s["i"]], 3); row.append(f"{key[2:]} {keys[key]:.2f}")
    s["start"] = round(s["start"] + shift[s["i"]], 3); s["end"] = round(s["end"] + shift[s["i"]], 3); s["first_key"] = "w:" + row[0].split()[0]
    lines.append(f"{s['i']:2d}  {s['start']:5.2f}-{s['end']:5.2f}  {s['text']}\n      " + "  ".join(row))
edges = [0] + [c for c, _ in cuts] + [None]; parts, f = ["[z0]"], [f"anullsrc=r=44100:cl=mono,atrim=0:{LEAD}[z0]"]
for j in range(len(edges) - 1):
    a, b = edges[j], edges[j + 1]
    f.append(f"[0:a]atrim={a}" + (f":{b}" if b is not None else "") + f",asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[p{j}]"); parts.append(f"[p{j}]")
    if j < len(cuts): f.append(f"anullsrc=r=44100:cl=mono,atrim=0:{cuts[j][1]}[z{j+1}]"); parts.append(f"[z{j+1}]")
f.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "vo.mp3", "-filter_complex", ";".join(f), "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "192k", "vo_paced.mp3"], check=True)
json.dump(keys, open("../film/src/words.json", "w"), indent=1); json.dump(sents, open("sentences_paced.json", "w"), indent=1, ensure_ascii=False)
open("words.txt", "w").write("\n".join(lines) + "\n"); print("\n".join(lines)); print("air", round(acc, 2), "last word ends", sents[-1]["end"])
