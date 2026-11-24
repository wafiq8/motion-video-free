"""QC OutroBasabasiLaut v2. Argumen: folder frame PNG hasil decode MP4 (001.png = frame 0).
Butuh out/laut/geom.json, out/laut/geom-qc.json (tools/outro/qc-laut-geom.ts) dan out/laut/qc-f165.png (still qcFreeze)."""
import sys, json, math, numpy as np
from PIL import Image, ImageDraw, ImageFont
FR = sys.argv[1]
G = json.load(open('out/laut/geom.json'))
S, HB, SUN = G['SHIP_S'], G['HULL_BOTTOM'], G['SUN']
frame = lambda f: np.array(Image.open(f'{FR}/{f + 1:03d}.png').convert('RGB')).astype(int)
BACKC, FRONTC = np.array([0xBD, 0xE9, 0xFB]), np.array([0x1E, 0x9B, 0xDC])
def to_screen(px, py, p):
    dx, dy = (px - HB['x']) * S, (py - HB['y']) * S; a = math.radians(p['rot'])
    return p['x'] + dx * math.cos(a) - dy * math.sin(a), p['y'] + dx * math.sin(a) + dy * math.cos(a)
def lum(c):
    c = np.asarray(c, float) / 255; c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)

# 1) Kontak: tepat di bawah dasar lambung harus air lapis atas (#BDE9FB) — 0..4px = menempel
gaps = []
for r in G['rows']:
    p = r['ship']
    if r['f'] < 40 or p['x'] < 5: continue
    img = frame(r['f']); cx = round(p['x']); y = round(p['y']) - 3
    while y < 1919 and np.abs(img[y, cx] - BACKC).max() >= 30: y += 1
    gaps.append(y - p['y'])
print(f'[kontak] dasar lambung → air di bawahnya: min {min(gaps):.0f}px, maks {max(gaps):.0f}px pada {len(gaps)} frame (|≤4| = menempel)')

# 2) Matahari vs lambung sebelum transformasi (frame 40–82): jarak tepi matahari ke titik-titik tepi atas lambung
hull = np.array(Image.open('public/outro/hull.png'))[..., 3] > 128; hv = json.load(open('public/outro/layout.json'))['icon_parts']['hull']
cols = np.nonzero(hull.any(0))[0][::6]
top_pts = [(hv['x'] + c, hv['y'] + np.nonzero(hull[:, c])[0].min()) for c in cols]
worst = min((min(math.hypot(x - SUN['x'], y - r['sunY']) for x, y in (to_screen(px, py, r['ship']) for px, py in top_pts)) - SUN['r'], r['f'])
            for r in G['rows'] if 40 <= r['f'] < G['T']['stretch'][0])
print(f'[matahari] jarak terdekat tepi matahari ↔ lambung sebelum transformasi: {worst[0]:.0f}px (frame {worst[1]}) — >0 = tidak menabrak')

# 3) CTA di dalam laut, frame 170–194: puncak ombak lapis depan selalu di atas tepi atas CTA; latar kotak CTA = air lapis depan
cta_rows = [r for r in G['rows'] if r['f'] >= 170]
margin = min(G['CTA_TOP'] - r['frontMin'] for r in cta_rows)
img = frame(180)
band = img[int(G['CTA_TOP']) - 10:int(G['CTA_TOP']) + 160]
white = (band.min(-1) > 235).sum(); orange = (np.abs(band - [0xF1, 0x99, 0x01]).max(-1) < 20).sum()
bgfront = (np.abs(band - FRONTC).max(-1) < 14).mean()
print(f'[CTA] permukaan lapis depan tertinggi berada {margin:.0f}px DI ATAS tepi atas CTA (frame 170–194) → CTA seluruhnya di dalam air')
print(f'[CTA] frame 180: piksel teks putih {white}, piksel pill oranye {orange}, latar pita CTA = air lapis depan {bgfront * 100:.1f}%')
print(f'[CTA] kontras putih vs #1E9BDC = {contrast([255] * 3, FRONTC):.2f}:1 (teks besar tebal ≥3:1); hitam vs #F19901 = {contrast([0] * 3, [0xF1, 0x99, 0x01]):.2f}:1')

# 4) Lockup (still qcFreeze frame 165: kapal diam di posisi lockup) vs logo-lockup resmi, skala & posisi sama
q = np.array(Image.open('out/laut/qc-f165.png').convert('RGB')).astype(float)
L = G['LOCK_S']
ref = np.array(Image.open('public/outro/src/logo-lockup.webp').convert('RGBA')).astype(float)
ys, xs = np.nonzero(ref[..., 3] > 250)
sx = np.round(G['LOCK_LEFT'] + (xs - 456) * L).astype(int); sy = np.round(G['LOCK_TOP'] + (ys - 944) * L).astype(int)
ok = (np.abs(q[sy, sx] - ref[ys, xs, :3]).max(-1) < 30)
icon_ok = ok[xs < 1100].mean(); word_ok = ok[xs >= 1100].mean()
print(f'[lockup] piksel buram logo-lockup yang warnanya cocok di render (frame 165, kapal diam): ikon {icon_ok * 100:.2f}%, wordmark {word_ok * 100:.2f}%')

# 5) Overlay 50% ikon resmi (logo-icon) di atas frame 130, ditransformasi dengan pose kapal frame 130
f = 130; p = G['rows'][f]['ship']
base = Image.open(f'{FR}/{f + 1:03d}.png').convert('RGBA')
icon = Image.open('public/outro/src/logo-icon.webp').convert('RGBA')
arr = np.array(icon).astype(float); iy, ix = np.nonzero(arr[..., 3] > 250)
pts = np.array([to_screen(x, y, p) for x, y in zip(ix[::7], iy[::7])])
b = np.array(base.convert('RGB')).astype(int)
m = np.abs(b[np.round(pts[:, 1]).astype(int), np.round(pts[:, 0]).astype(int)] - arr[iy[::7], ix[::7], :3]).max(-1) < 30
print(f'[overlay f130] {m.mean() * 100:.2f}% sampel piksel ikon resmi (pose kapal f130: rot {p["rot"]:.2f}°) jatuh di warna yang sama di render')
# gambar overlay: ikon resmi di-render ulang lewat transformasi affine yang sama, opacity 50%, diberi kontur magenta
a = math.radians(p['rot'])
M = [S * math.cos(a), -S * math.sin(a), S * math.sin(a), S * math.cos(a)]
det = M[0] * M[3] - M[1] * M[2]; inv = [M[3] / det, -M[1] / det, -M[2] / det, M[0] / det]
tx, ty = p['x'], p['y']
coeffs = (inv[0], inv[1], HB['x'] - inv[0] * tx - inv[1] * ty, inv[2], inv[3], HB['y'] - inv[2] * tx - inv[3] * ty)
warped = icon.transform(base.size, Image.AFFINE, coeffs, resample=Image.BICUBIC)
w = np.array(warped).astype(float); w[..., 3] *= 0.5
ov = base.copy(); ov.alpha_composite(Image.fromarray(w.astype(np.uint8)))
edge = np.array(warped)[..., 3] > 128; e2 = edge ^ (np.roll(edge, 1, 0) & np.roll(edge, -1, 0) & np.roll(edge, 1, 1) & np.roll(edge, -1, 1))
o = np.array(ov); o[e2] = [255, 0, 255, 255]
crop = Image.fromarray(o).crop((40, 690, 1060, 1180)).convert('RGB')
crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
d = ImageDraw.Draw(crop); ft = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
d.text((560, 16), f'frame 130 + ikon resmi 50% (kontur magenta) — cocok {m.mean() * 100:.1f}%', fill=(0, 0, 0), font=ft)
crop.save('hasil/outro-basabasi-laut-qc-overlay-f130.png')

# 6) Bingkai aman: kotak elemen logo (oranye/biru resmi, di atas laut) & CTA (putih/oranye, di dalam laut)
for f in (165, 194):
    img = frame(f)
    logo = (np.abs(img - [0xF1, 0x99, 0x01]).max(-1) < 30) | (np.abs(img - [0x3E, 0xB5, 0xEF]).max(-1) < 14)
    logo[int(G['LOCK_TOP']) + 420:, :] = False  # di bawah garis air = laut
    yy, xx = np.nonzero(logo)
    cta = np.zeros_like(logo); cta[int(G['CTA_TOP']) - 20:int(G['CTA_TOP']) + 200] = True
    cta &= (img.min(-1) > 235) | (np.abs(img - [0xF1, 0x99, 0x01]).max(-1) < 30)
    cy, cx = np.nonzero(cta)
    print(f'[aman] frame {f}: logo x {xx.min()}–{xx.max()}, y {yy.min()}–{yy.max()} | CTA x {cx.min()}–{cx.max()}, y {cy.min()}–{cy.max()}')
