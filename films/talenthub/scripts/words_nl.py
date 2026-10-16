# The Dutch build's word labels: the English labels the scenes are timed on, placed on the Dutch voice-over's
# matching words (in English word order, so every scene's beats stay in sequence), plus the Dutch words themselves
# as "w:nl_<word>" for the Dutch captions.   python3 scripts/words_nl.py  ->  film/src/words_nl.json
import json
nl = json.load(open("vo_nl/words.json")); en = json.load(open("vo/words.json"))
def t(x):
    if isinstance(x, (int, float)): return float(x)
    k, _, d = x.partition("+"); return nl["w:" + k] + (float(d) if d else 0)
M = {  # English label -> Dutch word (or a time inside a long Dutch word)
 "looking": "op", "for": "zoek", "qualified": "gekwalificeerd", "talent": "talent",
 "meet": "maak", "talent2": "talent2", "hub": "hub",
 "the": "het", "platform": "platform", "connecting": "dat", "graduates": "afgestudeerden", "with": "verbindt",
 "international": "internationale", "career": "carriremogelijkheden", "opportunities": "carriremogelijkheden+0.55",
 "browse": "ontdek", "a": "een", "database": "database", "of": "vol", "qualified2": "gekwalificeerde", "candidates": "kandidaten",
 "all": "overzichtelijk", "in": "verzameld", "one": "in", "intuitive": "n", "dashboard": "dashboard",
 "filter": "filter", "by": "op2", "skills": "vaardigheden", "experience": "werkervaring", "and": "en", "qualifications": "kwalificaties",
 "to": "om", "find": "de", "the2": "de+0.06", "right": "juiste", "match": "match",
 "discover": "bekijk", "candidate": "kandidaatprofielen", "profiles": "kandidaatprofielen+0.45", "unlock": "ontgrendel",
 "contact": "contactgegevens", "details": "contactgegevens+0.45", "and2": "en2", "connect": "kom", "directly": "direct",
 "with2": "met3", "potential": "potentile", "hires": "werknemers",
 "for2": "voor", "graduates2": "afgestudeerden2", "its": "opent", "a2": "de2", "gateway": "deur", "to2": "naar2",
 "exciting": "nieuwe", "opportunities2": "kansen", "abroad": "buitenland",
 "for3": "voor2", "employers": "werkgevers", "and3": "en3", "recruiters": "recruiters", "its2": "wordt", "a3": "talent4",
 "smarter": "vinden2", "way": "eenvoudiger", "to3": "eenvoudiger+0.15", "discover2": "eenvoudiger+0.3", "talent3": "eenvoudiger+0.45",
 "talent4": "talent5", "hub2": "hub3", "your": "jouw", "next": "volgende", "connection": "connectie", "starts": "begint", "here": "hier",
}
out = {}
missing = [k for k in en if k[2:] not in M]
assert not missing, missing
prev = -1
for k in sorted(en, key=lambda k: en[k]):
    v = round(t(M[k[2:]]), 3); assert v > prev, (k, v, prev); prev = v; out[k] = v
for k, v in nl.items(): out["w:nl_" + k[2:]] = v
json.dump(out, open("film/src/words_nl.json", "w"), indent=0)
print(len(out), "labels; end of VO", max(nl.values()))
