# Finds royalty-free music for a film and measures it, so the choice is made on facts, not titles.
# Alumni copy (adapted from films/jongleren/scripts/music_find.py): Mixkit only (no CC-BY sources),
# many mood/tag queries with paging, a genre filter, a cheap shape pre-screen on Mixkit's waveform json,
# and extra measures for a hero film: where the beat (kick/bass) enters, and whether the track has a real
# ending (a final hit and ring-out) or fades.
#   python3 music_find.py --queries tag:technology,mood:uplifting,... --pages 3 --out sound/music/
#        [--genres EDM,Pop,...] [--avoid children,christmas] [--min 60] [--n 40] [--bpm 100-128]
#        [--weights tag:technology=2,...] [--also "Title A|Title B"] [--from-pool]
# --also analyses these titles from the pool as well as the top --n; --from-pool reuses the last crawl.
#
# Sources that work from the build sandbox (Pixabay answers 403 to scripts):
#   Mixkit   mixkit.co mood and tag pages carry each track's name, genre, artist, length, file and a
#            waveform json; Mixkit Stock Music Free License: commercial use, no credit needed.
# For each candidate it downloads the file and measures tempo (BPM), loudness, brightness, how busy it is
# (onsets per second), how much it builds, where the intro ends, where the low end (kick/bass) comes in,
# and the shape of the ending; it writes candidates.json, the files, and a sheet of every track's energy.
import json, os, re, subprocess, sys, urllib.request
import numpy as np

SR = 22050
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
GENRES = "EDM,Electronica,Pop,Corporate Music,House,Electronic,Indie Pop,Synthpop,Dance-Pop,Electropop,Future Bass,Synthwave,Tech House,Deep House,Dream Pop,Chillout,Breakbeat,Disco,Techno,Trance,Rhythmic Underscore"

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def get(url, path=None):
    req = urllib.request.Request(url, headers=UA)
    data = urllib.request.urlopen(req, timeout=60).read()
    if path: open(path, "wb").write(data)
    return data

def iso_seconds(d):
    m = re.match(r"PT(?:(\d+)M)?(?:(\d+)S)?", d or "")
    return (int(m.group(1) or 0) * 60 + int(m.group(2) or 0)) if m else 0

def mixkit(queries, pages):
    pool = {}
    for q in queries:
        kind, slug = q.split(":")
        for p in range(1, pages + 1):
            u = f"https://mixkit.co/free-stock-music/{kind}/{slug}/" + (f"?page={p}" if p > 1 else "")
            try: html = get(u).decode("utf8", "ignore")
            except Exception: break
            n = 0
            for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
                try: data = json.loads(block)
                except Exception: continue
                for node in data.get("@graph", []):
                    for it in node.get("itemListElement", []) if node.get("@type") == "ItemList" else []:
                        if it.get("@type") != "MusicRecording": continue
                        n += 1
                        c = pool.setdefault(it["url"], {"source": "mixkit", "title": it["name"], "artist": it.get("byArtist"), "genre": it.get("genre"), "url": it["url"],
                                    "waveform": it.get("waveformUrl"), "length": iso_seconds(it.get("duration")), "licence": "Mixkit Stock Music Free License (commercial use, no credit needed)",
                                    "licence_url": it.get("license"), "page": f"https://mixkit.co/free-stock-music/{kind}/{slug}/", "queries": []})
                        if q not in c["queries"]: c["queries"].append(q)
            if n == 0: break
    return list(pool.values())

def shape(c):
    """Cheap pre-screen from Mixkit's waveform json: a soft intro, a steady body, and a real ending."""
    d = json.loads(get(c["waveform"]))
    a = np.abs(np.array(d["data"], dtype=float).reshape(-1, 2)).max(axis=1)
    pps = d["sample_rate"] / d["samples_per_pixel"]
    sec = max(1, int(round(pps))); per_s = a[: len(a) // sec * sec].reshape(-1, sec).max(axis=1)
    body = np.percentile(per_s, 75) + 1e-9
    db = 20 * np.log10(per_s / body + 1e-9)
    intro = int(np.argmax(db > -4)) if np.any(db > -4) else 0
    loud = np.where(db > -4)[0]; last_loud = loud[-1] if len(loud) else len(db) - 1
    quiet = np.where(db > -24)[0]; end = quiet[-1] if len(quiet) else len(db) - 1
    tail = int(end - last_loud)                            # seconds from the last full-level second to near silence
    s = 0.0
    s += 1.0 if 2 <= intro <= 12 else (0.4 if intro < 2 else 0.2)   # a soft intro we can sit the question on
    s += 1.0 if tail <= 6 else (0.5 if tail <= 10 else 0)            # a real ending, not a long fade
    return {"wf_intro_s": intro, "wf_tail_s": tail}, s

def analyse(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    hop = 512; n = len(x) // hop
    fr = x[: n * hop].reshape(n, hop)
    rms = np.sqrt((fr ** 2).mean(axis=1) + 1e-12)
    spec = np.abs(np.fft.rfft(fr * np.hanning(hop), axis=1))
    freqs = np.fft.rfftfreq(hop, 1 / SR)
    d = np.maximum(0, np.diff(spec, axis=0))
    flux = d.sum(axis=1); flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    low = d[:, freqs < 160].sum(axis=1)
    # tempo: autocorrelation of the onset curve over 60–180 BPM, folded into 80–160
    ac = np.correlate(flux, flux, mode="full")[len(flux) - 1:]
    fps = SR / hop
    lags = np.arange(int(fps * 60 / 180), int(fps * 60 / 60))
    bpm = 60 * fps / lags[np.argmax(ac[lags])]
    while bpm < 80: bpm *= 2
    while bpm > 160: bpm /= 2
    onsets = int(np.sum((flux[1:-1] > 1.5) & (flux[1:-1] > flux[:-2]) & (flux[1:-1] > flux[2:])))
    bright = float(np.median((spec * freqs).sum(axis=1) / (spec.sum(axis=1) + 1e-9)))
    sec = int(fps); per_s = rms[: len(rms) // sec * sec].reshape(-1, sec).mean(axis=1)
    db = 20 * np.log10(per_s / per_s.max() + 1e-9)
    intro = int(np.argmax(db > -6)) if np.any(db > -6) else 0
    third = max(1, len(per_s) // 3)
    # the low end (kick, bass) per second, against its level in the body of the track
    low_s = low[: len(low) // sec * sec].reshape(-1, sec).mean(axis=1)
    lref = np.median(low_s[third: 2 * third]) + 1e-9
    beat_in = int(np.argmax(low_s > 0.5 * lref)) if np.any(low_s > 0.5 * lref) else None
    # the ending: the last second at full level, the last strong hit, and the ring-out to -30 dB
    body = np.percentile(db, 70)
    full = np.where(db > body - 4)[0]; last_full = int(full[-1]) if len(full) else len(db) - 1
    audible = np.where(db > -30)[0]; ring_end = int(audible[-1]) if len(audible) else len(db) - 1
    strong = np.where(flux[: int((ring_end + 1) * fps)] > np.percentile(flux, 98))[0]
    last_hit = round(float(strong[-1] / fps), 2) if len(strong) else None
    tail = ring_end - last_full
    ending = "real" if tail <= 6 else ("short fade" if tail <= 10 else "fade")
    return {"bpm": round(float(bpm), 1), "onsets_per_s": round(onsets / (len(x) / SR), 2), "brightness_hz": round(bright),
            "build_db": round(float(20 * np.log10(per_s[-third:].mean() / per_s[:third].mean())), 1), "intro_s": intro, "beat_in_s": beat_in,
            "last_full_s": last_full, "last_hit_s": last_hit, "ring_end_s": ring_end, "tail_s": int(tail), "ending": ending,
            "duration_s": round(len(x) / SR, 2), "energy_db_per_s": [round(float(v), 1) for v in db]}

def sheet(cands, path):
    from PIL import Image, ImageDraw
    W, H, L = 1400, 90, 460
    im = Image.new("RGB", (W + L, H * len(cands)), "white"); dr = ImageDraw.Draw(im)
    for r, c in enumerate(cands):
        e = np.array(c["analysis"]["energy_db_per_s"]); y0 = r * H
        px = max(2, min(6, W // max(1, len(e))))
        dr.rectangle([L, y0 + 2, L + W, y0 + H - 2], fill=(246, 247, 250))
        for i, v in enumerate(e[: W // px]):
            h = (v + 30) / 30 * (H - 10)
            dr.rectangle([L + i * px, y0 + H - 5 - max(0, h), L + i * px + px - 2, y0 + H - 5], fill=(60, 140, 120))
        a = c["analysis"]
        for t, col in ((a["intro_s"], (40, 90, 220)), (a["beat_in_s"], (230, 120, 20)), (a["last_hit_s"], (200, 40, 40))):
            if t is not None: dr.line([L + t * px, y0 + 2, L + t * px, y0 + H - 2], fill=col, width=2)
        dr.text((6, y0 + 6), f"{c['title']} - {c.get('artist') or ''}"[:66], fill=(0, 0, 0))
        dr.text((6, y0 + 24), f"{a['bpm']} BPM  {a['onsets_per_s']} onsets/s  {a['brightness_hz']} Hz  build {a['build_db']:+} dB", fill=(60, 60, 60))
        dr.text((6, y0 + 42), f"{c.get('genre') or ''}  intro {a['intro_s']} s  beat in {a['beat_in_s']} s"[:66], fill=(110, 110, 110))
        dr.text((6, y0 + 60), f"{a['duration_s']:.0f} s  end: {a['ending']} (hit {a['last_hit_s']} s, tail {a['tail_s']} s)  score {c['score']:.2f}", fill=(110, 110, 110))
    im.save(path)

def main():
    out = arg("--out", "music"); os.makedirs(out, exist_ok=True)
    files = os.path.join(out, "candidates"); os.makedirs(files, exist_ok=True)
    queries = [q for q in arg("--queries", "tag:technology,tag:corporate,mood:uplifting").split(",") if q]
    pages = int(arg("--pages", 2))
    genres = set(g.strip() for g in arg("--genres", GENRES).split(","))
    b = arg("--bpm"); bpm = tuple(int(v) for v in b.split("-")) if b else None
    minlen, n = int(arg("--min", 60)), int(arg("--n", 40))
    weights = dict(w.split("=") for w in arg("--weights", "").split(",") if "=" in w)   # query=weight, default 1
    avoid = [a.lower() for a in arg("--avoid", "children,christmas,xmas,holiday,halloween,new year,mistletoe,lo-fi,lofi,country,folk").split(",") if a]
    ok = lambda c: c["length"] >= minlen and c.get("genre") in genres and not any(a in (c.get("genre") or "").lower() + " " + c["title"].lower() for a in avoid)
    if "--from-pool" in sys.argv:                       # reuse the last crawl and its pre-screen
        pool = json.load(open(os.path.join(out, "pool.json")))
    else:
        pool = [c for c in mixkit(queries, pages) if ok(c)]
    print(f"{len(pool)} tracks after the genre/length filter", file=sys.stderr)
    for c in pool:
        if "prescore" in c: continue
        c["relevance"] = sum(float(weights.get(q, 1)) for q in c["queries"])
        try:
            c["shape"], s = shape(c)
        except Exception as e:
            c["shape"], s = {}, 0
        c["prescore"] = round(c["relevance"] / 4 + s, 2)
    pool.sort(key=lambda c: -c["prescore"])
    json.dump(pool, open(os.path.join(out, "pool.json"), "w"), indent=1)
    also = [t.strip().lower() for t in arg("--also", "").split("|") if t.strip()]   # titles to analyse as well
    chosen = pool[:n] + [c for c in pool[n:] if c["title"].lower() in also]
    keep = []
    for c in chosen:
        fn = os.path.join(files, re.sub(r"[^a-z0-9]+", "-", c["title"].lower()).strip("-") + ".mp3")
        try:
            if not os.path.exists(fn): get(c["url"], fn)
            c["file"] = fn; c["analysis"] = analyse(fn)
        except Exception as e:
            print("skip", c["title"], e, file=sys.stderr); continue
        a = c["analysis"]
        mid = (bpm[0] + bpm[1]) / 2 if bpm else a["bpm"]
        in_range = bpm and bpm[0] - 2 <= a["bpm"] <= bpm[1] + 2
        # tempo near the brief, a calm-enough density under a voice, a usable soft intro, the beat entering
        # a few seconds in, a real ending, brightness for a bright film, and how well the tags fit
        c["score"] = round(max(0, 1 - abs(a["bpm"] - mid) / 30) + (0.4 if in_range else 0)
                           + max(0, 1 - a["onsets_per_s"] / 6) * 0.5
                           + (0.6 if 2 <= a["intro_s"] <= 12 else 0.2 if a["intro_s"] < 2 else 0)
                           + (0.4 if a["beat_in_s"] is not None and 2 <= a["beat_in_s"] <= 16 else 0)
                           + {"real": 1.0, "short fade": 0.4, "fade": 0}[a["ending"]]
                           + min(1, a["brightness_hz"] / 3000) * 0.3 + c["relevance"] / 10, 2)
        keep.append(c)
        print(f"{c['score']:.2f}  {c['title'][:30]:30s} {a['bpm']:6.1f} BPM {a['onsets_per_s']:4.1f}/s {a['brightness_hz']:5d} Hz intro {a['intro_s']:2d} beat {a['beat_in_s']} end {a['ending']:10s} hit {a['last_hit_s']} / {a['duration_s']:.0f} s  {c.get('genre')}", flush=True)
    keep.sort(key=lambda c: -c["score"])
    json.dump(keep, open(os.path.join(out, "candidates.json"), "w"), indent=1)
    sheet(keep, os.path.join(out, "candidates.png"))
    print("---")
    for c in keep:
        a = c["analysis"]
        print(f"{c['score']:.2f}  {c['title'][:30]:30s} {c.get('artist','')[:20]:20s} {a['bpm']:6.1f} BPM {a['onsets_per_s']:4.1f}/s {a['brightness_hz']:5d} Hz intro {a['intro_s']:2d} beat {a['beat_in_s']} end {a['ending']:10s} tail {a['tail_s']} {a['duration_s']:.0f} s  {c.get('genre')}")

main()
