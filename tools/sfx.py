"""SFX disintesis sendiri (bebas lisensi), deterministik (seed tetap). Hasil: public/sfx/*.wav + out/sfx-track.wav"""
import json, wave, numpy as np, os
SR = 44100
rng = np.random.default_rng(20261123)
def lp(x, a):  # one-pole lowpass, a bisa array
    y = np.zeros_like(x); s = 0.0; a = np.broadcast_to(a, x.shape)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
def env(n, att, dec):
    t = np.arange(n) / SR; return np.minimum(1, t / att) * np.exp(-t / dec)
def norm(x, peak=0.9): return x / (np.abs(x).max() + 1e-9) * peak
def whoosh():
    n = int(0.55 * SR); t = np.arange(n) / n
    x = rng.standard_normal(n); a = 0.02 + 0.25 * np.sin(np.pi * t) ** 2
    y = lp(x, a) - lp(x, a * 0.15); return norm(y * np.sin(np.pi * t) ** 1.5)
def pop():
    n = int(0.09 * SR); t = np.arange(n) / SR; f = 700 * np.exp(-t * 18) + 250
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.025))
def tear():
    n = int(0.4 * SR); x = rng.standard_normal(n)
    crack = (rng.random(n // 200 + 1) > 0.45).repeat(200)[:n] * rng.random(n // 200 + 1).repeat(200)[:n]
    y = (x - lp(x, 0.3)) * crack * env(n, 0.01, 0.2); return norm(y)
def shutter():
    n = int(0.16 * SR); y = np.zeros(n)
    for st in (0, int(0.075 * SR)):
        m = int(0.02 * SR); c = rng.standard_normal(m) * env(m, 0.0005, 0.004); y[st:st + m] += c - lp(c, 0.4)
    return norm(y)
def stamp():
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 110 * np.exp(-t * 6) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.09)
    m = int(0.015 * SR); click = np.zeros(n); click[:m] = rng.standard_normal(m) * env(m, 0.0003, 0.004) * 0.5
    return norm(body + click)
def ding():
    n = int(1.1 * SR); t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 1320 * t) + 0.35 * np.sin(2 * np.pi * 2640 * t) + 0.15 * np.sin(2 * np.pi * 3960 * t)) * env(n, 0.003, 0.28)
    return norm(y)
LIB = {k: f() for k, f in dict(whoosh=whoosh, pop=pop, tear=tear, shutter=shutter, stamp=stamp, ding=ding).items()}
GAIN = {'whoosh': 0.55, 'pop': 0.5, 'tear': 0.6, 'shutter': 0.6, 'stamp': 0.75, 'ding': 0.35}
def save(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
os.makedirs('public/sfx', exist_ok=True)
for k, x in LIB.items(): save(f'public/sfx/{k}.wav', x)
cues = json.load(open('docs/sfx-cues.json'))
tl = json.load(open('docs/timeline.json'))
track = np.zeros(int((tl['total_duration_s'] + 1.5) * SR))
for c in cues:
    x = LIB[c['sfx']] * GAIN[c['sfx']]; st = max(0, int(c['t'] * SR)); track[st:st + len(x)] += x[:len(track) - st]
save('out/sfx-track.wav', track * 0.12)
print('cues', len(cues))
