"""SFX OutroBasabasiLaut (6,5 dtk) — semua disintesis, deterministik. Memakai ulang sintesis splash/pop/ding/thud
dari sfx_outro.py + ambience ombak baru. Hasil: public/outro/sfx-outro-laut.wav"""
import os, sys, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import sfx_outro as S
SR, FPS, DUR = S.SR, 30, 6.5
rng = np.random.default_rng(20261125)
def ambience():
    n = int(DUR * SR); t = np.arange(n) / SR
    wash = S.lp(rng.standard_normal(n), 0.035) - S.lp(rng.standard_normal(n) * 0, 0.01)
    wash = wash - S.lp(wash, 0.004)                      # buang DC/rumble < ±30 Hz
    hiss = S.hp(rng.standard_normal(n), 0.6)
    hiss = S.lp(hiss, 0.25)                               # desis buih, lembut
    lfo = 0.62 + 0.38 * np.sin(2 * np.pi * 0.3 * t - np.pi / 2)  # gain naik-turun ±0,3 Hz
    lfo2 = 0.5 + 0.5 * np.sin(2 * np.pi * 0.3 * t - np.pi / 2 - 0.6)
    y = S.peak1(wash) * lfo + 0.22 * S.peak1(hiss) * lfo2 ** 2
    y *= np.minimum(1, t / 1.2)                           # mulai frame 0, naik halus bersama ombak
    y = y / np.sqrt(np.mean(y ** 2))                      # dinormalisasi RMS = 1
    return 2.2 * np.tanh(y / 2.2)                         # redam puncak sesaat → ambience rata, tak pernah menonjol
AMB_RMS_DB = -43  # latar: jauh di bawah cue
CUES = [('splash', 78, S.splash, -23), ('pop1', 112, S.pop_click, -19), ('pop2', 122, S.pop_click, -19),
        ('ding', 150, S.sparkle, -20), ('thud', 157, S.thud, -21)]
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
    st = int(fr / FPS * SR); w = slice(st, st + int(0.08 * SR))
    others = sum(l for k, l in layers.items() if k != name)
    cue_rms = dbf(np.sqrt(np.mean(layers[name][w] ** 2))); amb_rms = dbf(np.sqrt(np.mean(amb[w] ** 2)))
    print(f'{name:6s} f{fr:<4d} puncak {pk} dBFS | RMS cue {cue_rms:6.1f} vs ambience {amb_rms:6.1f} → selisih {cue_rms-amb_rms:5.1f} dB | cue lain {dbf(np.abs(others[w]).max()):6.1f} dBFS')
