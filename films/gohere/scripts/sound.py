# The revised film's sound: the original track, sample for sample, with the new section's effects
# laid on their frames and the length extended to the new end.
#   python3 scripts/sound.py <A|B> <out.wav> [--sheet mix.png]      (run from films/gohere)
# The cues (frame, sound, pitch) come from the overlay itself (overlay/index.html, via render.mjs timing),
# so picture and sound share one timing sheet. The effects are synthesized here, royalty-free:
#   pop   a soft, rounded, marimba-like pop (a client landing on the row)
#   tick  a short, light tick (a tile landing in the wall's stagger)
# Levels follow the studio's roles relative to the voice: voice -16, pops -29, ticks -31 LUFS; here the
# voice is the film's own at about -22 LUFS, so the effects sit the same distance under it.
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, FPS = 48000, 30
mode, out = sys.argv[1], sys.argv[2]
sheet = sys.argv[sys.argv.index("--sheet") + 1] if "--sheet" in sys.argv else None
rng = np.random.default_rng(11)

timing = json.loads(subprocess.run(["node", os.path.join(ROOT, "overlay", "render.mjs"), "timing", mode],
                                   capture_output=True, text=True, check=True).stdout)[mode]
end_frame, cues = timing["end"], timing["cues"]

# the original track, decoded once
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "source", "gohere-v1.mp4"), "-vn",
                      "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
orig = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
n_total = round(end_frame / FPS * SR)
mix = np.zeros((max(n_total, len(orig)), 2))
mix[: len(orig)] = orig
mix = mix[:n_total]

def room(x, length=0.35, wet=0.12):
    n = int(length * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 8, n)); ir[0] = 0
    y = np.convolve(x, ir)[: len(x) + n] * (wet / np.sqrt(np.sum(ir ** 2)))
    y[: len(x)] += x
    return y

def pop(semi):
    f0 = 740.0 * 2 ** (semi / 12)                     # F#5 and up the scale: soft, not shrill
    n = int(0.32 * SR); t = np.arange(n) / SR
    glide = f0 * (1 + 0.45 * np.exp(-t / 0.006))      # a quick drop into the note: the "pop"
    ph = 2 * np.pi * np.cumsum(glide) / SR
    body = np.sin(ph) * np.exp(-t / 0.055)
    wood = 0.18 * np.sin(2 * np.pi * 3.9 * f0 * t) * np.exp(-t / 0.012)   # a little marimba bar
    att = np.minimum(1, t / 0.0015)
    return room((body + wood) * att, 0.3, 0.10)

def tick(semi):
    f0 = 2100.0 * 2 ** (semi / 12)
    n = int(0.09 * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.010)
    click = rng.standard_normal(n) * np.exp(-t / 0.0015) * 0.25
    att = np.minimum(1, t / 0.0008)
    return room((tone + click) * att, 0.2, 0.08)

SYNTH = {"pop": pop, "tick": tick}
# dB under the voice's typical 100 ms loudness, from the role levels (voice -16: pop -29, tick -31)
UNDER = {"pop": 13.0, "tick": 15.0}

def rms100_max(x):
    w = int(0.1 * SR)
    m = x.mean(axis=1) if x.ndim == 2 else x
    if len(m) < w: m = np.pad(m, (0, w - len(m)))
    c = np.cumsum(np.concatenate([[0], m ** 2]))
    return np.sqrt((c[w:] - c[:-w]).max() / w)

# the voice's typical 100 ms level: the median over windows where it speaks
w = int(0.1 * SR)
vm = orig.mean(axis=1)
hops = [np.sqrt(np.mean(vm[i:i + w] ** 2)) for i in range(0, len(vm) - w, w // 2)]
speech = [h for h in hops if h > 10 ** (-40 / 20)]
voice_ref = float(np.median(speech))

report = []
for c in cues:
    s = SYNTH[c["sound"]](c["semitones"])
    gain = voice_ref * 10 ** (-UNDER[c["sound"]] / 20) / rms100_max(s)
    s = s * gain
    pan = 0.08 * np.sin(c["frame"])                      # a hair of width, never a jump
    st = np.stack([s * (1 - pan), s * (1 + pan)], 1)
    at = round(c["frame"] / FPS * SR)                    # on the frame (sync = the attack)
    seg = st[: max(0, n_total - at)]
    mix[at: at + len(seg)] += seg
    report.append(f"  f{c['frame']:>4} {c['frame'] / FPS:6.2f}s {c['sound']:<4} {c['semitones']:+6.2f} st  {c['note']}")

peak = np.abs(mix).max()
assert peak < 0.98, f"clips: peak {peak:.3f}"
untouched = len(orig) if not cues else min(len(orig), round(min(c["frame"] for c in cues) / FPS * SR))
assert np.array_equal(mix[:untouched], orig[:untouched]), "the original track changed before the first cue"

pcm = (np.clip(mix, -1, 1) * 32767).round().astype("<i2")
with wave.open(out, "wb") as wv:
    wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes(pcm.tobytes())
print(f"{mode}: {len(cues)} cues, {n_total / SR:.3f} s ({end_frame} frames), voice ref {20 * np.log10(voice_ref):.1f} dBFS (100 ms),"
      f" peak {20 * np.log10(peak):.1f} dBFS; original audio sample-identical up to {untouched / SR:.2f} s")
print("\n".join(report))
if sheet:
    marks = ",".join(f"{c['frame'] / FPS:.2f}" for c in cues[:1] + cues[-1:])
    lib = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio_look.py")
    if os.path.exists(lib):
        subprocess.run([sys.executable, lib, out, sheet, "--marks", marks], check=True)
