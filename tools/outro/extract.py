"""Pisahkan bagian logo Basabasi Trip dengan masking warna (bentuk asli, tidak digambar ulang).
Sumber: public/outro/src/logo-icon.webp & logo-lockup.webp (RGBA, latar transparan).
Hasil: public/outro/*.png (warna resmi persis, alpha = coverage asli) + public/outro/layout.json"""
import json, numpy as np
from PIL import Image
from collections import deque
OR, BL = (0xF1, 0x99, 0x01), (0x3E, 0xB5, 0xEF)
def load(p):
    a = np.array(Image.open(p).convert('RGBA')).astype(float)
    return a[..., :3], a[..., 3] / 255
def masks(rgb, al):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    orange = (r > b + 40) & (al > 0.02)   # oranye: R jauh > B
    blue = (b > r + 40) & (al > 0.02)     # biru: B jauh > R
    return orange, blue
def components(m):
    """label 8-tetangga sederhana (BFS) → list bbox+mask"""
    H, W = m.shape; lab = np.zeros((H, W), int); n = 0
    ys, xs = np.nonzero(m)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]: continue
        n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n
        while q:
            y, x = q.popleft()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n; q.append((yy, xx))
    out = []
    for i in range(1, n + 1):
        yy, xx = np.nonzero(lab == i)
        if len(yy) < 30: continue  # buang serpih
        out.append(dict(id=i, x0=xx.min(), x1=xx.max(), y0=yy.min(), y1=yy.max(), area=len(yy)))
    return lab, out
def save(name, sel, al, color, pad=4):
    ys, xs = np.nonzero(sel)
    x0, x1, y0, y1 = xs.min() - pad, xs.max() + pad + 1, ys.min() - pad, ys.max() + pad + 1
    A = np.where(sel, al, 0)[y0:y1, x0:x1]
    img = np.zeros(A.shape + (4,), np.uint8); img[..., :3] = color; img[..., 3] = np.round(A * 255)
    Image.fromarray(img).save(f'public/outro/{name}.png', optimize=True)
    return dict(x=int(x0), y=int(y0), w=int(x1 - x0), h=int(y1 - y0))
def grow(m, k=3):  # dilasi kecil agar tepi antialias ikut
    out = m.copy()
    for dy in range(-k, k + 1):
        for dx in range(-k, k + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out

layout = {}
# ---- IKON (logo-icon) ----
rgb, al = load('public/outro/src/logo-icon.webp')
o, b = masks(rgb, al)
lab, comps = components(o)
sails = sorted([c for c in comps if c['area'] > 1000], key=lambda c: c['x0'])
assert len(sails) == 2, sails
icon = {}
icon['sailL'] = save('sail-left', grow(lab == sails[0]['id']) & o, al, OR)
icon['sailR'] = save('sail-right', grow(lab == sails[1]['id']) & o, al, OR)
lab, comps = components(b)
hull = max(comps, key=lambda c: c['area'])
icon['hull'] = save('hull', grow(lab == hull['id']) & b, al, BL)
ys, xs = np.nonzero(al > 0.5); icon_bbox = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]

# ---- LOCKUP: icon bbox (pemetaan) + huruf ----
rgb, al = load('public/outro/src/logo-lockup.webp')
o, b = masks(rgb, al)
H, W = al.shape
solid = al > 0.5
# ikon = semua piksel di kiri celah besar
cols = solid.any(0); xs = np.nonzero(cols)[0]
gaps = np.nonzero(np.diff(xs) > 60)[0]; split = xs[gaps[0]] + 1
ys2, xs2 = np.nonzero(solid[:, :split]); lock_icon_bbox = [int(xs2.min()), int(ys2.min()), int(xs2.max()), int(ys2.max())]
word = np.zeros_like(solid); word[:, split:] = True
letters = []
for col, cname, m in ((BL, 'blue', b), (OR, 'orange', o)):
    lab, comps = components(m & word)
    for c in comps: c['col'] = cname; c['lab'] = lab
    letters += comps
# Pisah: Trip = komponen biru di kanan x terbesar huruf baris bawah
basa = sorted([c for c in letters if c['col'] == 'blue' and c['y1'] < H * 0.5 and c['x1'] - c['x0'] > 50], key=lambda c: c['x0'])
basi = sorted([c for c in letters if c['col'] == 'orange'], key=lambda c: c['x0'])
basiRight = max(c['x1'] for c in basi)
trip = [c for c in letters if c['col'] == 'blue' and c['x0'] > basiRight - 5]
print('basa', len(basa), 'basi', len(basi), 'trip', len(trip))
assert len(basa) == 4, [(c['x0'], c['y0'], c['area']) for c in basa]
# Basi: titik i digabung dengan batang i (kolom bertumpuk)
groups = []
for c in basi:
    for g in groups:
        if min(g[-1]['x1'], c['x1']) - max(g[-1]['x0'], c['x0']) > 0.5 * (c['x1'] - c['x0']): g.append(c); break
    else: groups.append([c])
assert len(groups) == 4, len(groups)
word_layout = {}
for i, c in enumerate(basa):
    word_layout[f'basa{i}'] = save(f'basa-{i}', grow(c['lab'] == c['id']) & b & word, al, BL)
for i, g in enumerate(groups):
    sel = np.zeros_like(solid)
    for c in g: sel |= grow(c['lab'] == c['id'])
    word_layout[f'basi{i}'] = save(f'basi-{i}', sel & o & word, al, OR)
sel = np.zeros_like(solid)
for c in trip: sel |= grow(c['lab'] == c['id'])
word_layout['trip'] = save('trip', sel & b & word, al, BL)
layout = dict(canvas=[W, H], icon_src_bbox=icon_bbox, lockup_icon_bbox=lock_icon_bbox, icon_parts=icon, word=word_layout)
json.dump(layout, open('public/outro/layout.json', 'w'), indent=1)
print(json.dumps(layout))
