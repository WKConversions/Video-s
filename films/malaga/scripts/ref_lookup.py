# When a line of voice-over is hard to show, look up how Karl's reference films showed something similar: finds the
# phrases in their transcripts that match, and tiles what was on screen at the start of the phrase, on the matching
# word, and as the phrase ends, with the words and timecodes (references/visual-dictionary.md).
#   python3 ref_lookup.py "save time|faster|in minutes" --out sheet.png [--words data/ref_words.json] [--refs refs_src] [--max 12] [--per-ref 2]
# The pattern is a regular expression over the phrase text (case-insensitive). The transcripts are word-timed
# (faster-whisper on the voice stems); the films themselves stay outside the library, in refs_src/.
# Take the idea, never the layout: the dictionary is for finding a way to make a vague line concrete.
import argparse, json, os, re, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))

def phrases(words, gap=0.35):
    """Split a word list ([start, end, text]) into phrases at pauses and sentence ends."""
    out, cur = [], []
    for w in words:
        if cur and (w[0] - cur[-1][1] > gap or re.search(r"[.!?]$", cur[-1][2])):
            out.append(cur); cur = []
        cur.append(w)
    if cur: out.append(cur)
    return out

def frame(video, t, w=420):
    f = tempfile.mktemp(suffix=".jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, t):.2f}", "-i", video, "-frames:v", "1", "-vf", f"scale={w}:-2", f], check=False)
    return Image.open(f).convert("RGB") if os.path.exists(f) else Image.new("RGB", (w, w * 9 // 16), "#ddd")

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("pattern"); ap.add_argument("--out", required=True)
    ap.add_argument("--words", default=os.path.join(HERE, "..", "data", "ref_words.json"))
    ap.add_argument("--refs", default=os.path.join(HERE, "..", "..", "refs_src")); ap.add_argument("--max", type=int, default=12)
    ap.add_argument("--per-ref", type=int, default=2, help="at most this many matches from one film, so the sheet shows several films")
    ap.add_argument("--names", default=os.path.join(HERE, "..", "data", "ref_names.json"))
    a = ap.parse_args()
    W = json.load(open(a.words)); names = json.load(open(a.names)) if os.path.exists(a.names) else {}
    rx = re.compile(a.pattern, re.I); hits = []
    for ref, words in W.items():
        for ph in phrases(words):
            text = " ".join(w[2] for w in ph)
            m = rx.search(text)
            if not m: continue
            # the word where the match starts
            pos, at = 0, ph[0][0]
            for w in ph:
                if pos >= m.start(): at = w[0]; break
                pos += len(w[2]) + 1
            hits.append((ref, ph[0][0], at, ph[-1][1], text))
    # spread the picks over the films: round-robin over the films in a shuffled order (fixed per pattern)
    import random
    by = {}
    for h in hits: by.setdefault(h[0], []).append(h)
    order = sorted(by); random.Random(a.pattern).shuffle(order)
    keep = []
    for k in range(a.per_ref):
        for ref in order:
            if len(by[ref]) > k: keep.append(by[ref][k])
    hits = sorted(keep[: a.max], key=lambda h: (h[0], h[1]))
    if not hits: print("no match"); return
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    cw, ch = 420, 236; rowh = ch + 58
    sheet = Image.new("RGB", (cw * 3 + 40, rowh * len(hits) + 20), "white"); d = ImageDraw.Draw(sheet)
    for i, (ref, t0, tk, t1, text) in enumerate(hits):
        video = os.path.join(a.refs, ref + ".mp4"); y = 10 + i * rowh
        label = f"{ref} {names.get(ref, '')}  {t0:.1f}–{t1:.1f} s"
        d.text((10, y), label, fill="#111", font=bold)
        d.text((10, y + 20), (text[:150] + "…") if len(text) > 150 else text, fill="#333", font=font)
        for j, t in enumerate([t0 + 0.15, tk + 0.3, t1 - 0.1]):
            sheet.paste(frame(video, t).resize((cw - 6, ch)), (10 + j * cw, y + 44))
            d.text((14 + j * cw, y + 46 + ch - 20), f"{t:.1f} s", fill="#fff", font=font)
        print(f"{ref} {t0:6.1f}–{t1:5.1f}  {text}")
    sheet.save(a.out); print("->", a.out)

if __name__ == "__main__":
    main()
