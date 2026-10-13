# Print the voice-over's 10 ms envelope (broadband RMS, low band 80-900 Hz, high band 3.5-8 kHz, in dB) over a range.
#   python3 vo_env.py vo.mp3 t0 t1
import subprocess, sys
import numpy as np
src, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
SR = 16000; hop = 160; win = 400
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
fq = np.fft.rfftfreq(win, 1 / SR)
for i in range(int(t0 * 100), int(t1 * 100)):
    c = i * hop; seg = x[max(0, c - win // 2):c + win // 2]
    if len(seg) < win: seg = np.pad(seg, (0, win - len(seg)))
    sp = np.abs(np.fft.rfft(seg * np.hanning(win))) ** 2
    rms = 10 * np.log10((seg ** 2).mean() + 1e-12)
    lf = 10 * np.log10(sp[(fq >= 80) & (fq < 900)].sum() + 1e-12); hf = 10 * np.log10(sp[(fq >= 3500) & (fq < 8000)].sum() + 1e-12)
    bar = "#" * max(0, int((rms + 60) / 1.5))
    print(f"{i / 100:6.2f} {rms:6.1f} lf {lf:6.1f} hf {hf:6.1f} {bar}")
