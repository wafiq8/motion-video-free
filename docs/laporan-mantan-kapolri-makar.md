# Laporan Produksi — "Mantan Kapolri Tersangka Makar" (Mode D, BERITA, skill v3.5)

File final: `out/mantan-kapolri-makar-final.mp4` (1080×1920, 30 fps, 77,47 detik)
Preview: `out/mantan-kapolri-makar-preview.mp4` (skala 0,5) · Contact sheet: `out/contact-sheet.jpg`
Pill topik: **KASUS DUGAAN MAKAR** · Narasi: `mantan-kapolri.mp3` dari operator (77,01 dtk) · Musik: `Backsound-news.mp3` dari operator

## Tabel kalimat → scene

| # | Kalimat (ringkas) | Mulai–selesai (dtk) | Scene |
|---|---|---|---|
| 1 | Seorang mantan Kapolri, kini jadi tersangka makar… | 0,00–5,66 | 1 KartuHook |
| 2 | Senin malam, Bareskrim… enam tersangka… lima perwira aktif. | 5,94–13,82 | 2 Kartu tersangka |
| 3 | Kasusnya pengembangan dari skandal penyadapan ilegal… | 13,92–18,74 | 3 FotoBeat (KartuFoto) |
| 4–7 | Versi penyidik… tiga tahap / Tahap satu… / Tahap dua… / Tahap tiga… | 18,96–38,20 | 4 ScenePenjelasan |
| 8 | Motifnya, kata Kabareskrim… | 38,34–46,50 | 5 Parafrase + foto |
| 9 | Para tersangka dijerat pasal makar… | 46,58–53,76 | 6 Ancaman |
| 10 | Penyidik memeriksa 71 saksi… Rp735 juta. | 53,92–60,20 | 7 CounterIkon |
| 11–12 | Tapi ingat: semua ini masih dugaan. / Belum ada putusan… | 60,24–68,08 | 8 Status bukti |
| 13 | Pertanyaannya: … apa yang sebenarnya terjadi di dalam institusi itu? | 68,30–76,58 | 9 PenutupDampak |

Timing: Whisper large-v3 (faster-whisper, int8, `language="id"` dipaksa); teks dari naskah operator.
ASR salah dengar "Barreskrim/Listio/Kabarreskrim" dan menyisipkan token "70%." sebelum "735". Caption memakai ejaan naskah, dan token sisipan dibuang.

## Validator & check_output

- `validate_timeline.py`: **PASS SEMUA** (total 77,48 dtk, variant BERITA, semua batas scene = awal kalimat, ekor 0,90 dtk).
- `check_output.sh` (preview): semua PASS kecuali resolusi 540×960. Itu memang skala preview.
- `check_output.sh` (final): lihat bagian QC poin 1.

## QC 10 poin

1. Timeline & spesifikasi file: lihat hasil check_output final.
2. Batas scene ≤ 0,3 dtk: PASS (batas scene = awal kalimat; render per scene memakai frame dari timeline).
3. Teks tidak terpotong / zona aman: PASS di contact sheet 27 still. Headline diukur `fitText`, caption ≤ 940 px (build gagal bila lebih), pill y 262, caption y 1470.
4. Hook ≤ 1,5 dtk: PASS. Chip "MANTAN KAPOLRI", lencana, dan "TERSANGKA MAKAR" tampil di 0,0–0,4 dtk bersama suara.
5. Counter sinkron: PASS. "6" tampil di 8,3 dtk (kata "6" di 8,44); 71 saksi menghitung 54,66→55,72; Rp735 juta menghitung 58,0→58,9 (kata "735" di 58,16); 20 tahun di 52,1→52,9.
6. Keheningan: PASS (tidak ada > 1,2 dtk).
7. Loudness: master audio −14,0 LUFS, peak −1,5 dBFS; preview −14,1 LUFS.
8. Konsistensi gaya: PASS (palet berita-navy, Inter 500–900, karaoke satu kata kotak oranye di semua scene).
9. Cek khusus Mode D:
   - Pill topik identik di semua scene.
   - Sitasi ada di setiap scene, dan setiap foto punya kredit.
   - Chip BELUM TERBUKTI tampil di S4 (18,96–38,34) dan S5 (38,34–46,58), bersama chip VERSI PENYIDIK di S4.
   - Versi resmi (Bareskrim) disebut. Motif ditampilkan sebagai parafrase "MENURUT KABARESKRIM" tanpa tanda kutip.
   - Tidak ada gambar AI.
   - Uji beda frame per scene: tidak ada frame beku (0 frame tanpa beda di semua scene).
   - Lapisan SFX hadir (30 cue).
   - Watermark detikcom/ANTARA utuh: KartuFoto memakai object-fit contain, dan Ken Burns diterapkan pada skala kartu.
   - Pengecualian yang dinyatakan: 5 perwira memakai **siluet cadangan**, dengan keterangan di layar "siluet = ilustrasi, foto resmi 5 perwira tidak tersedia". Lihat bagian Foto.
10. Penutup: PASS. Verdict ("semua ini masih dugaan… praduga tak bersalah") ada di S8, pertanyaan terbuka spesifik ada di S9, lalu fade ke hitam. Tidak ada kartu seri atau pill tahap.

## Kredit & label kejujuran per scene

| Scene | Sitasi di layar | Foto / label |
|---|---|---|
| 1 | konferensi pers Bareskrim Polri 23/11/2026 (via detik, ANTARA) | — (ikon lencana generik, bukan lambang resmi) |
| 2 | Bareskrim Polri 23/11/2026 (via detik, Liputan6, Bisnis) | Listyo: BPMI Setpres 2026 · Commons (PD-IDGov) · siluet 5 perwira berlabel ilustrasi |
| 3 | Bareskrim Polri 23/11/2026 (via detik, ANTARA) | KartuFoto detikcom 23/11/2026 (watermark utuh) |
| 4 | keterangan penyidik Bareskrim (via detik, ANTARA) | VERSI PENYIDIK · BELUM TERBUKTI |
| 5 | Kabareskrim, konpers 23/11/2026 (via ANTARA, detik) | KartuFoto ANTARA/Nadia Putri Rahmani 23/11/2026 (watermark utuh) · BELUM TERBUKTI · parafrase |
| 6 | Bareskrim Polri 23/11/2026 (via detik) | "Pasal 191, 193, 196 KUHP (menurut penyidik)" |
| 7 | Bareskrim Polri 23/11/2026 (via detik) | KartuFoto barang bukti detikcom 23/11/2026 (watermark utuh) |
| 8 | status perkara per 23/11/2026 — tahap penyidikan | stempel BELUM ADA PUTUSAN PENGADILAN · PRADUGA TAK BERSALAH |
| 9 | Bareskrim · detik · ANTARA · Liputan6 · Bisnis (23/11/2026) | — |

## Foto

| File | Sumber & kredit | Watermark | Status hak cipta | Ukuran |
|---|---|---|---|---|
| listyo-ksp-2026.jpg | BPMI Setpres, 01/10/2026, via Wikimedia Commons "Listyo Sigit Prabowo, Kepala Staf Kepresidenan (2026).jpg" (dicek 23/11/2026) | tidak | rilis resmi, domain publik (UU 28/2014 Ps. 43 b) | 120 KB |
| detik-konpers-wide-20261123.jpg | detikcom, foto-news d-8766579, 23/11/2026 | ya, banner "detikcom" — utuh | **berhak cipta**, dipakai atas keputusan operator 23/11/2026 (risiko klaim/takedown) | 110 KB |
| detik-barangbukti-20261123.jpg | detikcom, foto-news d-8766579, 23/11/2026 | ya — utuh | **berhak cipta**, keputusan operator | 69 KB |
| antara-asep-konpers-20261123.jpg | ANTARA/Nadia Putri Rahmani/aa, berita 5873299, 23/11/2026 | ya, logo ANTARA — utuh | **berhak cipta** (bukan HO), keputusan operator | 95 KB |

Total aset foto: ±394 KB. Avatar cadangan dipakai untuk Irjen Slamet Uliandi, Irjen Eko Hadi Santoso, Irjen Ahrie Sonta Nasution, Brigjen Tedjo Kusumo, dan Kombes Iman Imanuddin. Foto resmi tanpa watermark tidak ditemukan di Commons. File "Ahrie Sonta.jpg" di Commons ditolak karena klaim CC BY-SA atas nama Detik.com meragukan. Operator memutuskan tetap memakai siluet (23/11/2026).

## SFX

Disintesis sendiri lewat `tools/sfx.py` (bebas lisensi, seed tetap): whoosh, pop, shutter, tear, stamp, ding. Ada 30 cue di `docs/sfx-cues.json`.

## Catatan fakta (cek silang sesi)

- Rp735 juta terkonfirmasi di dua artikel detik (d-8766431, d-8766579). Judul JPNN menulis "Rp750 juta". Video mengikuti angka 735.
- Penetapan tersangka diumumkan Senin 23/11/2026 dalam konferensi pers di Gedung Bareskrim. Kabareskrim adalah Komjen Asep Safrudin (detik, ANTARA).
- **Perlu diperhatikan:** AP (17/11/2026) memberitakan sidang etik telah memutus PTDH untuk Irjen Ahrie Sonta Nasution dan Irjen Eko Hadi Santoso, dan keduanya berencana banding. Frasa "lima perwira aktif" di narasi dan di layar dipertahankan atas keputusan operator. Status aktif keduanya selama banding belum dipastikan sesi.
- Konteks: ANTARA mencatat Listyo terakhir menjabat Kepala Staf Kepresidenan, dan Keppres pemberhentiannya sedang diproses.
- Tanggapan pihak tersangka: tidak ditemukan di laporan yang dibaca operator maupun sesi. Video menampilkan praduga tak bersalah, tanpa baris tambahan (keputusan operator).

## Lingkungan

Sesi dipindah ke environment `motion-video-free` (dulu bernama motion-3D) agar bisa mengunduh model Whisper dan situs berita. Host `cdn.antaranews.com` dan `awsimages.detik.net.id` ditambahkan untuk unduhan foto.

## Caption Instagram (draf)

Mantan Kapolri Listyo Sigit Prabowo dan lima perwira lainnya ditetapkan Bareskrim sebagai tersangka dugaan makar, Senin malam (23/11/2026). Ini pengembangan dari kasus penyadapan ilegal terhadap Presiden. Menurut penyidik, ancamannya pidana mati, penjara seumur hidup, atau 20 tahun penjara.

Semua ini masih dugaan versi penyidik. Belum ada putusan pengadilan, dan para tersangka berhak atas praduga tak bersalah.

Menurutmu, apa yang sebenarnya terjadi di dalam institusi itu?

Sumber: konferensi pers Bareskrim Polri 23/11/2026, via detik, ANTARA, Liputan6, Bisnis. Foto: detikcom, ANTARA/Nadia Putri Rahmani, BPMI Setpres.

#basabasi #berita #makar #bareskrim #polri #hukum #indonesia
