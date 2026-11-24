"""QC: bandingkan frame 70 dengan logo-lockup asli yang ditransformasi identik (skala, posisi, rotasi goyang)."""
import sys, numpy as np
from PIL import Image
ROT = float(sys.argv[1]); frame_png = sys.argv[2]
LB = (456, 2159, 944, 1680); S = 880 / (LB[1] - LB[0]); CX, CY = 540, 830
PIV = ((456 + 1072) / 2, 1680)
ref = Image.open('public/outro/src/logo-lockup.webp').convert('RGBA')
# rotasi di sekitar poros (CSS rotate positif = searah jarum jam; PIL positif = berlawanan)
ref = ref.rotate(-ROT, resample=Image.BICUBIC, center=PIV)
W = round(2625 * S); ref = ref.resize((W, W), Image.LANCZOS)
ox = round(CX - (LB[0] + (LB[1] - LB[0]) / 2) * S); oy = round(CY - (LB[2] + (LB[3] - LB[2]) / 2) * S)
canvas = Image.new('RGBA', (1080, 1920), (0, 0, 0, 255)); canvas.alpha_composite(ref, (ox, oy))
A = np.array(canvas.convert('RGB'), float); B = np.array(Image.open(frame_png).convert('RGB'), float)
y0, y1 = 600, 1060  # area lockup (tanpa CTA)
a, b = A[y0:y1], B[y0:y1]
d = np.abs(a - b).max(-1)
ma, mb = a.max(-1) > 128, b.max(-1) > 128
iou = (ma & mb).sum() / (ma | mb).sum()
ya, xa = np.nonzero(ma); yb, xb = np.nonzero(mb)
print(f'IoU logo {iou:.4f} | bbox ref x{xa.min()}-{xa.max()} y{ya.min()+y0}-{ya.max()+y0} | render x{xb.min()}-{xb.max()} y{yb.min()+y0}-{yb.max()+y0}')
print(f'selisih piksel rata2 {d.mean():.2f}/255, piksel >64: {(d>64).sum()} ({(d>64).mean()*100:.3f}%)')
for nm, hexc in (('oranye', (0xF1, 0x99, 0x01)), ('biru', (0x3E, 0xB5, 0xEF))):
    m = np.abs(b - hexc).max(-1) < 6; print(f'piksel {nm} persis-hex (±5) di render: {m.sum()}, median warna: {np.median(b[m],0) if m.any() else "-"}')
Image.fromarray(np.hstack([a, b, np.repeat(np.clip(d * 3, 0, 255)[..., None], 3, -1)]).astype(np.uint8)).save(sys.argv[3])
