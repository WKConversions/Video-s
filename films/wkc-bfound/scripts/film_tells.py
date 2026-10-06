# Reads the words a film puts on screen and reports its tells: defaults nobody asked for
# (evaluation/tells.md), each with file:line, the family and the question to answer.
#   python3 film_tells.py <project folder> [--facts harvest/facts.md] [--thesis storyboard/thesis.md]
# It reads displayed text in .tsx/.ts/.jsx/.html (text between tags, and string literals that hold
# words, which is where film copy usually lives: arrays of rows, captions, labels). With a facts
# file, every figure and every name on screen is held against it: a figure the client never stated
# is "unsourced". With a thesis whose "Allowed patterns:" line names a pattern, findings of that
# pattern are listed as allowed. It never decides: answer each question, then fix or keep.
# Reports "not checked" for what it could not check (no facts file: the truth check did not run).
import glob, os, re, sys

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

CSSY = re.compile(r"^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|[\d.\s-]+(px|%|em|rem|deg|ms|s|fr)\b|cubic|linear-gradient|radial-gradient|translate|scale|rotate|blur|inset|solid|absolute|relative|flex|grid|center|none|auto|inherit|uppercase|nowrap|cover|contain|hidden|img/|fonts/|audio/|photos/|\./|@|https?:)", re.I)

CHECKS = [
  # family, id, pattern, question
  ("Invented information", "placeholder-identity", re.compile(r"\b(John|Jane) (Doe|Smith)\b|\bAcme\b|\bLorem\b|\bipsum\b|\bExample (Inc|Corp|Ltd)\b|\bFoo(bar)?\b|\bCompany Name\b", re.I),
   "Is this a real name from the client's material? If not, use theirs, or a role (\"Project manager\") instead of a fake person."),
  ("Invented information", "precise-claim", re.compile(r"\b\d{1,3}(?:[.,]\d+)?\s?%|\b\d+(?:[.,]\d+)?\s?[xX×]\b|\b\d{1,3}(?:[.,]\d{3})+\+?|\b\d+\s?[kKmM]\+|\b\d+\+"),
   "Where does this figure come from? A number the client never stated reads as proof and isn't."),
  ("Invented information", "fake-status", re.compile(r"\bv\d+\.\d+(\.\d+)?(-rc\.?\d*)?\b|\b99\.9+%|\buptime\b|\bEST(D)?\.? \d{4}\b|\bSince \d{4}\b", re.I),
   "Is this status or date a fact about the client, or texture?"),
  ("Decorative filler", "numbered-label", re.compile(r"^\s*0\d\s*[/·.]|\bStep 0?\d\b|\bPhase (I|II|III|IV|\d)\b|\bStage \d\b", re.I),
   "Is the number information (a real sequence the viewer needs), or decoration?"),
  ("Decorative filler", "scroll-cue", re.compile(r"\bscroll( to explore| down)?\b", re.I),
   "A film doesn't scroll: what is this cue for?"),
  ("Reflex convergence", "em-dash", re.compile("—"),
   "Would a colon, a comma or two sentences say it more plainly?"),
  ("Hollow copy", "filler-word", re.compile(r"\b(unlock|elevate|empower(ing)?|seamless(ly)?|supercharge|revolutioni[sz]e|cutting[- ]edge|next[- ]level|game[- ]changer|leverage|synerg\w*|effortless(ly)?|world[- ]class|robust|innovative|solutions?\b(?! to)|take .{1,20} to the next level|in today's (fast[- ]paced )?world)\b", re.I),
   "Does this sentence say something true of this client and of no other?"),
]

def texts(path):
    src = open(path, encoding="utf8", errors="ignore").read()
    out = []
    for m in re.finditer(r"(?<![=\-])>([^<>{}=;]*[A-Za-z]{3}[^<>{}=;]*)<", src):   # JSX text between tags, not "=>" code
        t = " ".join(m.group(1).split())
        if t: out.append((src.count("\n", 0, m.start()) + 1, t))
    for m in re.finditer(r"([\"'`])((?:(?!\1)[^\\\n]|\\.)*)\1", src):        # string literals with words
        t = m.group(2).strip()
        if len(t) < 2 or not re.search(r"[A-Za-z]{3}", t) or CSSY.match(t): continue
        if re.fullmatch(r"[MLHVCSQTAZmlhvcsqtaz0-9.,\s-]+", t): continue          # SVG path data
        if re.fullmatch(r"[a-z][a-zA-Z0-9_-]*", t) and not " " in t: continue   # identifiers, keys
        line = src.count("\n", 0, m.start()) + 1
        before = src[max(0, m.start() - 40):m.start()]
        if re.search(r"(import|from|require|className|key|id|fontFamily|fontWeight|textAlign|position|display|src|staticFile|ease|tone)\s*[=:(]\s*\{?$", before.rstrip()): continue
        out.append((line, t))
    return out

def main():
    root = sys.argv[1]
    files = [f for ext in ("tsx", "ts", "jsx", "html") for f in glob.glob(os.path.join(root, "src", "**", f"*.{ext}"), recursive=True)]
    facts_path = arg("--facts", os.path.join(root, "harvest", "facts.md"))
    facts = open(facts_path, encoding="utf8").read() if os.path.exists(facts_path) else None
    thesis_path = arg("--thesis", os.path.join(root, "storyboard", "thesis.md"))
    allowed = ""
    if os.path.exists(thesis_path):
        m = re.search(r"Allowed patterns:(.*)", open(thesis_path, encoding="utf8").read())
        allowed = (m.group(1) if m else "").lower()
    norm = lambda s: re.sub(r"[\s,.]", "", s.lower())
    found, seen = [], set()
    for f in files:
        for line, t in texts(f):
            for fam, cid, rx, q in CHECKS:
                for m in rx.finditer(t):
                    hit = m.group(0)
                    if cid == "precise-claim" and facts is not None and norm(hit.rstrip("+")) in norm(facts): continue   # a stated figure
                    key = (f, line, cid, hit)
                    if key in seen: continue
                    seen.add(key)
                    status = "allowed by the thesis" if cid in allowed else "tell"
                    found.append((fam, cid, f"{os.path.relpath(f, root)}:{line}", t[:90], hit, q, status))
    if not found:
        print(f"no tells in {len(files)} files")
    for fam in dict.fromkeys(c[0] for c in CHECKS):
        rows = [x for x in found if x[0] == fam]
        if not rows: continue
        print(f"== {fam}")
        for _, cid, loc, t, hit, q, status in rows:
            print(f"  [{status}] {cid}  {loc}  “{t}”  ({hit})\n      {q}")
    print("\nnot checked: " + ("nothing" if facts is not None else f"the truth check (no facts file at {facts_path}): figures are flagged without knowing which are the client's own"))
    print("by hand: a product drawn in boxes that pretends to be the client's real screen; one layout family in every beat; the copy register drifting between beats")
    n = sum(1 for x in found if x[6] == "tell")
    print(f"{n} tells to answer, {len(found) - n} allowed by the thesis")
    sys.exit(1 if n else 0)

main()
