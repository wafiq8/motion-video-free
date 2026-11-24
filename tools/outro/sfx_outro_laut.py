"""SFX OutroBasabasiLaut v2 (6,5 dtk) — semua disintesis, deterministik. Memakai ulang splash/pop dari sfx_outro.py
+ ambience ombak, shimmer, whoosh geser, pop naik. Hasil: public/outro/sfx-outro-laut.wav"""
import os, sys, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import sfx_outro as S
SR, FPS, DUR = S.SR, 30, 6.5
rng = np.random.default_rng(20261125)

def ambience():
    n = int(DUR * SR); t = np.arange(n) / SR
    wash = S.lp(rng.standard_normal(n), 0.035)
    wash = wash - S.lp(wash, 0.004)                               # buang DC/rumble < ±30 Hz
    hiss = S.lp(S.hp(rng.standard_normal(n), 0.6), 0.25)          # desis buih, lembut
    lfo = 0.62 + 0.38 * np.sin(2 * np.pi * 0.3 * t - np.pi / 2)   # gain naik-turun ±0,3 Hz
    lfo2 = 0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t - np.pi / 2 - 0.6)
    y = S.peak1(wash) * lfo + 0.22 * S.peak1(hiss) * lfo2 ** 2
    y *= np.minimum(1, t / 1.0)                                   # mulai frame 0, naik halus bersama ombak
    y = y / np.sqrt(np.mean(y ** 2))                              # RMS = 1
    return 2.2 * np.tanh(y / 2.2)                                 # redam puncak sesaat → rata, tak pernah menonjol

def shimmer():  # 1,0 dtk: kerlip lembut naik selama matahari berubah jadi layar
    n = int(1.0 * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k, f0 in enumerate([2093, 2637, 3136, 3951, 4699]):
        f = f0 * (1 + 0.06 * t)
        trem = 0.5 + 0.5 * np.sin(2 * np.pi * (9 + k) * t + k)
        y += np.sin(2 * np.pi * np.cumsum(f) / SR) * trem / (k + 1.5)
    air = S.lp(S.hp(rng.standard_normal(n), 0.5), 0.3) * 0.35
    shape = np.sin(np.pi * t) ** 1.2 * np.minimum(1, (1.0 - t) / 0.15)
    return S.peak1((y + air) * shape)

def slide_whoosh():  # 0,55 dtk: geser kering (noise band-pass yang menyapu)
    n = int(0.55 * SR); u = np.arange(n) / n; x = rng.standard_normal(n)
    a = 0.04 + 0.3 * u ** 0.7
    y = S.lp(x, a) - S.lp(x, a * 0.25)
    return S.peak1(y * np.sin(np.pi * u) ** 1.4 * np.exp(-2.2 * u))

def pop_up():  # pop naik (nada menanjak) saat CTA tiba
    n = int(0.14 * SR); t = np.arange(n) / SR; f = 380 + 700 * (1 - np.exp(-t * 30))
    return S.peak1(np.sin(2 * np.pi * np.cumsum(f) / SR) * S.env(n, 0.002, 0.035))

AMB_RMS_DB = -43
# (cue, frame, sintesis, puncak dBFS) — narasi biasa memuncak ±-1..-3 dBFS → cue 16–26 dB di bawahnya
CUES = [('splash', 40, S.splash, -23), ('shimmer', 80, shimmer, -25), ('pop_klik', 110, S.pop_click, -19),
        ('whoosh_teks', 115, slide_whoosh, -23), ('pop_cta', 168, pop_up, -20), ('pop_kedip', 175, S.pop_click, -25)]

n = int(DUR * SR)
amb = ambience() * S.db(AMB_RMS_DB)
track = amb.copy(); layers = {}
for name, fr, fn, pk in CUES:
    x = fn() * S.db(pk); st = int(fr / FPS * SR); seg = x[:n - st]
    lay = np.zeros(n); lay[st:st + len(seg)] = seg; layers[name] = lay; track += lay
track[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
S.save('public/outro/sfx-outro-laut.wav', track)
S.save('public/outro/sfx/ambience-ombak.wav', amb)
dbf = lambda v: 20 * np.log10(v + 1e-12)
print(f'puncak total {dbf(np.abs(track).max()):.1f} dBFS | ambience puncak {dbf(np.abs(amb).max()):.1f} dBFS, RMS {AMB_RMS_DB} dBFS')
for name, fr, fn, pk in CUES:
    pkx = int(np.argmax(np.abs(layers[name]))); w = slice(max(0, pkx - int(0.04 * SR)), pkx + int(0.04 * SR))  # ±40 ms sekitar puncak cue
    others = sum(l for k, l in layers.items() if k != name)
    cue_rms = dbf(np.sqrt(np.mean(layers[name][w] ** 2))); amb_rms = dbf(np.sqrt(np.mean(amb[w] ** 2)))
    print(f'{name:11s} f{fr:<4d} (puncak di f{pkx / SR * FPS:5.1f}) puncak {pk} dBFS | RMS cue {cue_rms:6.1f} vs ambience {amb_rms:6.1f} → selisih {cue_rms - amb_rms:5.1f} dB | cue lain {dbf(np.abs(others[w]).max()):6.1f} dBFS')
