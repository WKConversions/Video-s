# The film's phone sounds, generated (numpy, royalty-free): a soft modern ring, a missed call, a call picked up, a
# notification. Writes lib/sfx/phone/*.wav and lib/sfx/index.json = these plus the WKConversions library (by path).
#   python3 phone_sfx.py
import json, os, wave
import numpy as np
SR = 48000
rng = np.random.default_rng(7)

def mallet(f, length, decay, vel=1.0, bright=0.35):
    t = np.arange(int(SR * length)) / SR
    env = np.exp(-t / decay) * (1 - np.exp(-t / 0.002))
    x = np.sin(2 * np.pi * f * t) + bright * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / (decay * 0.4)) + 0.12 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / (decay * 0.2))
    return vel * env * x

def room(x, wet=0.16):
    ir_t = np.arange(int(SR * 0.6)) / SR
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.12); ir /= np.abs(ir).sum() * 0.5
    y = np.convolve(x, ir)[: len(x) + int(SR * 0.3)]
    out = np.zeros(len(y)); out[: len(x)] += x
    return out + wet * y

def seq(notes, length):
    y = np.zeros(int(SR * length))
    for t0, f, dur, dec, v in notes:
        m = mallet(f, dur, dec, v); i = int(t0 * SR); y[i:i + len(m)] += m[: len(y) - i]
    return y

def write(name, y, sync):
    y = room(y); y = y / (np.abs(y).max() + 1e-9) * 0.7
    st = np.stack([y, y], 1)
    with wave.open(f"lib/sfx/phone/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())
    return {"id": name, "file": f"sfx/phone/{name}.wav", "category": "phone", "licence": "generated", "sync": sync, "length": round(len(y) / SR, 2),
            "source": "generated (numpy), royalty-free", "original": ["sound/phone_sfx.py"]}

E6, Gs6, B5, E5, A5, Cs6 = 1318.5, 1661.2, 987.8, 659.3, 880.0, 1108.7
trill = lambda t0, n=8: [(t0 + i * 0.062, (E6, Gs6)[i % 2], 0.25, 0.07, 0.8) for i in range(n)]
out = [
    write("gen-ring", seq(trill(0.0) + trill(0.75), 1.6), 0.0),                  # two soft trills: a phone ringing
    write("gen-ring-short", seq(trill(0.0, 6), 0.8), 0.0),                       # one short trill: a call arriving in a stream
    write("gen-missed", seq([(0.0, B5, 0.5, 0.11, 0.8), (0.12, E5, 0.6, 0.16, 0.7)], 0.9), 0.0),     # two notes down: missed
    write("gen-pickup", seq([(0.0, A5, 0.5, 0.10, 0.7), (0.09, E6, 0.7, 0.18, 0.8)], 1.0), 0.0),    # two notes up: picked up
    write("gen-note", seq([(0.0, Cs6, 0.8, 0.22, 0.8), (0.0, Cs6 * 1.5, 0.6, 0.12, 0.25)], 1.0), 0.0),  # a notification
]
wkc = json.load(open("../../wkconversions/sound/lib/sfx/index.json"))
for o in wkc: o["file"] = os.path.join("../../../wkconversions/sound/lib", o["file"])
json.dump(out + wkc, open("lib/sfx/index.json", "w"), indent=0)
print("wrote", [o["id"] for o in out])
