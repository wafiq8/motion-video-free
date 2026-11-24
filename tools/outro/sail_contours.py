"""Ukur kontur dua layar dari PNG hasil masking (public/outro/sail-*.png) → titik polar dari centroid,
dipakai HANYA sebagai target morph matahari→layar. Setelah layar 'klik', komposisi memakai PNG aslinya.
Hasil: public/outro/sail-contours.json (koordinat logo-icon 2625px)."""
import json, math, numpy as np
from PIL import Image
L = json.load(open('public/outro/layout.json'))
N = 96
out = {}
for key, f in (('sailL', 'sail-left'), ('sailR', 'sail-right')):
    a = np.array(Image.open(f'public/outro/{f}.png'))[..., 3].astype(float) / 255
    v = L['icon_parts'][key]
    ys, xs = np.nonzero(a > 0.5); cx, cy = xs.mean(), ys.mean()
    def alpha(x, y):  # bilinear
        x0, y0 = int(x), int(y)
        if x0 < 0 or y0 < 0 or x0 + 1 >= a.shape[1] or y0 + 1 >= a.shape[0]: return 0.0
        fx, fy = x - x0, y - y0
        return (a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x0 + 1] * fx * (1 - fy) + a[y0 + 1, x0] * (1 - fx) * fy + a[y0 + 1, x0 + 1] * fx * fy)
    pts = []
    for i in range(N):
        th = -math.pi / 2 + 2 * math.pi * i / N  # mulai dari atas, searah jarum jam (y ke bawah)
        dx, dy = math.cos(th), math.sin(th); r = 0.0
        while alpha(cx + dx * (r + 0.25), cy + dy * (r + 0.25)) >= 0.5: r += 0.25
        pts.append([round(v['x'] + cx + dx * r, 2), round(v['y'] + cy + dy * r, 2)])
    # pangkal (jangkar kedip) = titik tengah tepi bawah: rata-rata piksel di 6px terbawah
    # pangkal (jangkar kedip) = titik tengah tepi bawah, antara sudut kiri-bawah & kanan-bawah
    P = np.array(pts); low = P[P[:, 1] > v['y'] + cy]
    bl = low[np.argmax(low[:, 1] - 0.3 * low[:, 0])]; br = low[np.argmax(low[:, 0] + 2 * low[:, 1])]
    base = [round(float(bl[0] + br[0]) / 2, 1), round(float(bl[1] + br[1]) / 2, 1)]
    out[key] = dict(centroid=[round(float(v['x'] + cx), 2), round(float(v['y'] + cy), 2)], pts=pts, base=base, corners=[bl.tolist(), br.tolist()])
    # cek: luas poligon vs luas mask
    P = np.array(pts); area = 0.5 * abs(np.dot(P[:, 0], np.roll(P[:, 1], 1)) - np.dot(P[:, 1], np.roll(P[:, 0], 1)))
    print(key, 'luas poligon', round(area), 'luas mask', round(a.sum()), 'rasio %.4f' % (area / a.sum()), 'pangkal', base)
json.dump(out, open('public/outro/sail-contours.json', 'w'))
# salinan TS (agar bisa diimpor bundler Remotion maupun node QC tanpa atribut impor JSON)
with open('src/outro/sail-contours.ts', 'w') as fh:
    fh.write('// DIHASILKAN oleh tools/outro/sail_contours.py — jangan diedit manual\nexport default ' + json.dumps(out) + ' as const;\n')
