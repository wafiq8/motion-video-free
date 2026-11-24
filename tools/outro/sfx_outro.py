"""SFX outro Basabasi Trip — semua disintesis (tanpa file berlisensi), deterministik.
Hasil: public/outro/sfx-outro.wav (mono 44.1k, 3,0 dtk) + public/outro/sfx/*.wav (per-cue)."""
import wave, os, numpy as np
SR, FPS, DUR = 44100, 30, 3.0
rng = np.random.default_rng(20261124)
def lp(x, a):
    y = np.empty_like(x); s = 0.0; a = np.broadcast_to(np.asarray(a, float), x.shape)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
def hp(x, a): return x - lp(x, a)
def env(n, att, dec):
    t = np.arange(n) / SR; return np.minimum(1, t / att) * np.exp(-t / dec)
def peak1(x): return x / (np.abs(x).max() + 1e-9)
def db(d): return 10 ** (d / 20)
def water_whoosh():  # 0,6 dtk: noise tersaring yang menyapu + gemericik
    n = int(0.62 * SR); t = np.arange(n) / n
    x = rng.standard_normal(n)
    a = 0.03 + 0.22 * np.sin(np.pi * t) ** 2
    body = lp(x, a) - lp(x, a * 0.12)
    gurgle = np.sin(2 * np.pi * np.cumsum(180 + 120 * np.sin(2 * np.pi * 9 * t * 0.62)) / SR) * (rng.random(n) > 0.6)
    gurgle = lp(gurgle, 0.08) * 0.25
    shape = np.sin(np.pi * np.minimum(1, t * 1.05)) ** 1.6
    return peak1((body + gurgle) * shape)
def splash():  # sangat tipis: semburan noise terang + tetes
    n = int(0.32 * SR); t = np.arange(n) / SR
    y = hp(rng.standard_normal(n), 0.35) * env(n, 0.003, 0.06)
    for k in range(6):
        st = int(rng.uniform(0.02, 0.2) * SR); m = int(0.03 * SR); tt = np.arange(m) / SR
        f = rng.uniform(1400, 2600) * (1 + 0.8 * tt / 0.03)
        y[st:st + m] += 0.35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(m, 0.001, 0.008)
    return peak1(y)
def pop_click():  # pop lembut + klik kayu kecil
    n = int(0.12 * SR); t = np.arange(n) / SR; f = 820 * np.exp(-t * 22) + 260
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.0015, 0.028)
    m = int(0.006 * SR); click = np.zeros(n); click[:m] = hp(rng.standard_normal(m), 0.5) * env(m, 0.0002, 0.0015)
    return peak1(body + 0.5 * click)
def sparkle():  # ding lonceng + kerlip tinggi
    n = int(1.0 * SR); t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 1568 * t) + 0.4 * np.sin(2 * np.pi * 2349 * t) + 0.18 * np.sin(2 * np.pi * 3136 * t)) * env(n, 0.002, 0.3)
    for k, d in enumerate([0.04, 0.09, 0.15, 0.22]):
        st = int(d * SR); m = int(0.25 * SR); tt = np.arange(m) / SR
        y[st:st + m] += 0.22 * np.sin(2 * np.pi * (4200 + 500 * k) * tt) * env(m, 0.001, 0.05)
    return peak1(y)
def thud():  # sangat tipis, rendah
    n = int(0.3 * SR); t = np.arange(n) / SR; f = 95 * np.exp(-t * 9) + 48
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.07)
    y += 0.15 * lp(rng.standard_normal(n), 0.1) * env(n, 0.001, 0.01)
    return peak1(y)
# (cue, frame mulai, puncak dBFS). Narasi biasa memuncak ±-1..-3 dBFS → SFX -18..-24 dBFS (15–20 dB di bawah, splash lebih tipis)
CUES = [('whoosh', 0, water_whoosh, -18), ('splash', 17, splash, -24), ('pop1', 24, pop_click, -19),
        ('pop2', 32, pop_click, -19), ('ding', 58, sparkle, -20), ('thud', 75, thud, -21)]
def save(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
os.makedirs('public/outro/sfx', exist_ok=True)
track = np.zeros(int(DUR * SR)); layers = {}
for name, fr, fn, pk in CUES:
    x = fn() * db(pk); save(f'public/outro/sfx/{name}.wav', x)
    st = int(fr / FPS * SR); seg = x[:len(track) - st]; track[st:st + len(seg)] += seg
    lay = np.zeros_like(track); lay[st:st + len(seg)] = seg; layers[name] = lay
# fade-out pendek 30 ms di ujung agar tak ada klik (ekor ding)
track[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
save('public/outro/sfx-outro.wav', track)
print('peak total dBFS %.1f' % (20 * np.log10(np.abs(track).max())))
# cek tabrakan: per cue, level lapisan lain saat cue ini memuncak
for name, fr, fn, pk in CUES:
    st = int(fr / FPS * SR); w = slice(st, st + int(0.05 * SR))
    others = sum(l for k, l in layers.items() if k != name)
    o = np.abs(others[w]).max(); print(f'{name:7s} f{fr:<3d} peak {pk} dBFS, lapisan lain saat itu {20*np.log10(o+1e-9):6.1f} dBFS')
