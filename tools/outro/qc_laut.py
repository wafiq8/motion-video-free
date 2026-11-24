"""QC OutroBasabasiLaut: kontak lambung–ombak, jarak matahari–layar, bingkai aman, kecocokan lockup akhir.
Argumen: folder frame PNG hasil decode MP4 (001.png = frame 0)."""
import sys, json, math, numpy as np
from PIL import Image
FR = sys.argv[1]
G = json.load(open('out/laut/geom.json'))
S, HB, R = G['SHIP_S'], G['HULL_BOTTOM'], G['SUN_R']
def to_screen(px, py, pose):  # titik koordinat logo-icon → layar
    dx, dy = (px - HB['x']) * S, (py - HB['y']) * S
    a = math.radians(pose['rot']); return pose['x'] + dx * math.cos(a) - dy * math.sin(a), pose['y'] + dx * math.sin(a) + dy * math.cos(a)
frame = lambda f: np.array(Image.open(f'{FR}/{f+1:03d}.png').convert('RGB')).astype(int)
FRONT = np.array([0x1E, 0x9B, 0xDC]); HULL = np.array([0x3E, 0xB5, 0xEF])
# 1) Kontak lambung: titik di dalam lambung 25 px-sumber di atas titik terendah harus berwarna lambung,
#    dan permukaan lapis depan (dicari per piksel) harus berada tepat di bawah dasar lambung.
errs, hull_ok, n = [], 0, 0
for r in G['rows']:
    f, p = r['f'], r['ship']
    if f < 78 or p['x'] < 5 or p['x'] > 1075: continue
    img = frame(f); n += 1
    hx, hy = to_screen(HB['x'], HB['y'] - 25, p)
    if np.abs(img[round(hy), round(hx)] - HULL).max() < 40: hull_ok += 1
    # tepat di bawah titik terendah lambung: yang terlihat harus air lapis depan, dengan celah hanya garis pisah putih (≤4px)
    cx = round(p['x']); y = round(p['y']) - 2
    while y < 1919 and np.abs(img[y, cx] - FRONT).max() >= 30: y += 1
    errs.append(y - p['y'])  # jarak dasar lambung → piksel air pertama di bawahnya
print(f'[kontak] titik dalam lambung berwarna lambung: {hull_ok}/{n} frame; dasar lambung → air lapis depan tepat di bawahnya: min {min(errs):.0f}px, maks {max(errs):.0f}px (0–4px = menempel; >6 = melayang)')
# 2) Jarak matahari ↔ layar & lambung (titik sudut atas layar & ujung lambung)
gaps = []
for r in G['rows']:
    f, p = r['f'], r['ship']
    if f < 75: continue
    pts = [(1235, 1300), (1766, 1290), (857, 1640)]  # ujung-ujung lambung
    if r['sailL']: pts += [(869, 1431), (1180, 768), (1276, 768)]
    if r['sailR']: pts += [(1274, 1431), (1580, 768), (1678, 768)]
    d = min(math.hypot(x - 540, y - r['sunY']) for x, y in (to_screen(px, py, p) for px, py in pts)) - R
    gaps.append((d, f))
g = min(gaps); print(f'[matahari] jarak terdekat tepi matahari ke titik kapal: {g[0]:.0f}px (frame {g[1]}) — >0 berarti tidak bersentuhan')
# 3) Bingkai aman: elemen non-latar (bukan putih, bukan warna ombak)
SEA = [np.array(c) for c in ([0xBD, 0xE9, 0xFB], [0x3E, 0xB5, 0xEF], [0x1E, 0x9B, 0xDC])]
for f in (150, 175, 194):
    img = frame(f); nonwhite = np.abs(img - 255).max(-1) > 40
    sea = np.zeros_like(nonwhite)
    for c in SEA: sea |= np.abs(img - c).max(-1) < 12
    m = nonwhite & ~sea; m[780:975, :] = False  # pita laut tepi-ke-tepi (termasuk tepi antialiasnya) dikecualikan
    ys, xs = np.nonzero(m)
    print(f'[aman] frame {f}: konten non-laut x {xs.min()}–{xs.max()}, y {ys.min()}–{ys.max()} (laut: tepi-ke-tepi, dasar y≈964)')
# 4) Lockup akhir (render qcFreeze frame 194: tanpa goyang)
img = np.array(Image.open('out/laut/qc-f194.png').convert('RGB')).astype(float)
# 4a) wordmark vs crop file lockup, skala sama, di atas putih
L = G['LOCK_S']; WB = G['WORD_BBOX']
ref = Image.open('public/outro/src/logo-lockup.webp').convert('RGBA').crop((WB['x0'] - 20, WB['y0'] - 20, WB['x1'] + 20, WB['y1'] + 20))
ref = ref.resize((round(ref.width * L), round(ref.height * L)), Image.LANCZOS)
bg = Image.new('RGBA', ref.size, (255, 255, 255, 255)); bg.alpha_composite(ref); A = np.array(bg.convert('RGB'), float)
ox, oy = round(G['WORD_LEFT'] - 20 * L), round(G['WORD_TOP'] - 20 * L)
B = img[oy:oy + A.shape[0], ox:ox + A.shape[1]]
d = np.abs(A - B).max(-1); ma, mb = A.min(-1) < 200, B.min(-1) < 200
print(f'[lockup] wordmark: IoU {(ma & mb).sum() / (ma | mb).sum():.4f}, selisih rata2 {d.mean():.2f}/255, piksel >64: {(d > 64).mean() * 100:.2f}%')
# 4b) ikon kapal vs logo-icon, skala sama: ambil piksel buram di referensi, cek warna render sama
G2 = json.load(open('out/laut/geom-qc.json')); p = G2['rows'][194]['ship']
icon = np.array(Image.open('public/outro/src/logo-icon.webp').convert('RGBA')).astype(float)
ys, xs = np.nonzero(icon[..., 3] > 250)
sel = np.random.default_rng(1).choice(len(ys), 20000, replace=False)
ok = 0
for y, x in zip(ys[sel], xs[sel]):
    sx, sy = to_screen(x, y, p)
    ok += np.abs(img[int(round(sy)), int(round(sx))] - icon[y, x, :3]).max() < 30
sx0, sy0 = to_screen(857, 768, p); sx1, sy1 = to_screen(1767, 1855, p)
print(f'[lockup] ikon: {ok / 200:.2f}% sampel piksel logo-icon cocok warna di render; bbox ikon layar x{sx0:.0f}–{sx1:.0f} y{sy0:.0f}–{sy1:.0f} (lebar {sx1-sx0:.0f}px = 616×0,55 lockup)')
Image.fromarray(np.hstack([A, B, np.repeat(np.clip(d * 3, 0, 255)[..., None], 3, -1)]).astype(np.uint8)).save('hasil/outro-basabasi-laut-qc-wordmark.png')
