# Laporan Produksi — "Pengganti Wapres" (Mode D, BERITA, skill v3.3)

File final: `hasil/pengganti-wapres-final.mp4` (1080×1920, 30 fps, 75,20 detik, 19,5 MB)
Preview: `out/pengganti-wapres-preview.mp4` (skala 0,5) · Contact sheet: `out/contact-sheet.jpg`

## Tabel kalimat → scene

| # | Kalimat (naskah) | Mulai–selesai (dtk) | Scene |
|---|---|---|---|
| 1 | Kursi wakil presiden kosong sejak 12 November. | 0,00–2,62 | 1 KartuHook |
| 2 | Hari ini, amplop putih itu akhirnya dibuka. | 2,90–6,22 | 2 Hook langkah 2 |
| 3 | Senin sore, 23 November 2026, Presiden Prabowo datang langsung ke Gedung MPR, Senayan. | 6,46–13,42 | 3 PetaLokator |
| 4 | CNN Indonesia, Kompas, ANTARA | Foto peristiwa 23/11/2026 tampil UTUH (watermark tidak dipotong): Prabowo tiba disambut Muzani — ANTARA/HO-DPR RI (handout DPR, kategori 1); penyerahan surat/jabat tangan — KOMPAS.com (kategori 3, BERHAK CIPTA, dipakai atas keputusan operator 23/11/2026) · Muzani (KPU RI 2023, PD-IDGov) |
| 5–7 | Isinya dua nama. / Satu: Andi Amran Sulaiman… / Dua: Sugiono… | 19,42–29,32 | 5 Kartu kandidat |
| 8 | Nama Dasco yang ramai digadang-gadang justru tidak ada. | 29,32–32,82 | 6 |
| 9–10 | Kenapa harus dua nama? / Pasal 8 ayat 2 UUD 1945… | 33,00–45,74 | 7 ScenePenjelasan |
| 11–12 | Jadwalnya sempat digugat. / Mahfud MD mengingatkan… | 46,06–54,10 | 8 Parafrase + foto |
| 13–14 | MPR mendengar. / Sidang digeser… 14 hari kerja. | 54,26–65,50 | 9 Kalender + counter |
| 15–16 | Satu dari dua nama ini… / Menurutmu, siapa yang lebih pantas… | 65,58–74,32 | 10 PenutupDampak |

Timing: Whisper large-v3 (`language="id"` dipaksa), teks dari naskah. Catatan: naskah "kursi wapres" diucapkan TTS "kursi wakil presiden" — caption mengikuti ucapan.

## Validator & check_output

- `validate_timeline.py`: **PASS SEMUA** (total 75,20 dtk, variant BERITA, semua batas scene = awal kalimat).
- `check_output.sh out/pengganti-wapres-final.mp4`: **PASS SEMUA** — 1080×1920, 30 fps, 75,2 dtk, tanpa keheningan > 1,2 dtk, loudness −14,1 LUFS.
- Parameter codec 10 file scene identik → concat `-c copy` bersih.

## QC 10 poin

1. Timeline & spesifikasi file — PASS (lihat atas; audio sampai 74,3 dtk + jeda payoff 0,88 dtk + fade).
2. Batas scene ≤ 0,3 dtk — PASS (selisih maks 0,013 dtk, pembulatan frame).
3. Teks tidak terpotong / zona aman — PASS. Semua headline, caption, kredit diukur `fitText`/`measureText` setelah font termuat; caption di y 1470–1560 (di atas zona 310 px bawah), pill di y 262. Diperbaiki di tahap still: kredit foto menimpa headline (S3/S5/S10) dan kredit S4 kepotong kanan.
4. Hook ≤ 1,5 dtk — PASS ("12 NOV" + kursi + "KURSI WAPRES KOSONG" tampil di 0,2 dtk bersama suara).
5. Counter/readout sinkron — PASS (16.48 di 13,62; counter 14 hari kerja selesai di 64,66 = kata "14"). Tidak ada angka hero 3D (Mode D).
6. Keheningan — PASS (silencedetect −45 dB/1 dtk: nol).
7. Loudness — PASS (−14,0 LUFS di master audio, −14,1 di file final; peak −1,5/−1,6 dBFS).
8. Konsistensi gaya — PASS (palet berita-navy, Inter 500–900, karaoke satu kata kotak oranye di semua scene).
9. Cek khusus Mode D — PASS: pill "PENGGANTI WAPRES" identik semua scene; sitasi di setiap scene; kredit di setiap foto; label "peta ilustrasi, tidak berskala"; parafrase Mahfud berlabel "MENURUT MAHFUD MD" tanpa tanda kutip; tak ada gambar AI. v3.3: semua tokoh pusat bernama memakai foto asli lingkaran (tanpa avatar cadangan); latar bergerak (drift gradasi + grid + partikel) dan semua foto ber-Ken Burns — uji beda frame per scene setelah pop-in: semua > 0 (PASS); SFX hadir.
10. Penutup — PASS: verdict ("satu dari dua nama ini akan mendampingi Prabowo sampai 2029") + pertanyaan terbuka spesifik ("Amran, atau Sugiono?"), dua kandidat tampil setara (tanpa memihak), fade ke hitam. Tidak ada kartu seri/pill tahap.

## Kredit & label kejujuran per scene

| Scene | Sitasi di layar | Foto / label |
|---|---|---|
| 1 | NU Online, Kompas | — |
| 2 | CNN Indonesia, Kompas, ANTARA | — |
| 3 | CNN Indonesia, Kompas, ANTARA | Prabowo (Kemensetneg 2024, PD-IDGov) · PETA ILUSTRASI, TIDAK BERSKALA |
| 4 | CNN Indonesia, Kompas, ANTARA | Latar: pidato di Gedung MPR (Setkab RI, 20/10/2024, PD-IDGov) · FOTO ARSIP 2024 · Muzani (KPU RI 2023, PD-IDGov) |
| 5 | + jabatan: Katadata, Suara | Amran (Pemprov Banten, arsip 2014, PD-IDGov) · Sugiono (Kemlu RI 2024, PD-IDGov) |
| 6 | CNN Indonesia, Kompas | Dasco (DPR RI, potret resmi 2024–2029, PD-IDGov) |
| 7 | UUD 1945 Pasal 8 ayat 2 | ikon siluet generik "2 calon" (bukan tokoh bernama) |
| 8 | CNN Indonesia, detik | Mahfud MD (Kemenko Polhukam 2022, PD-IDGov) · label parafrase |
| 9 | NU Online, Kompas | Latar: konferensi pers Ketua MPR soal jadwal 11 Des (MPR RI, 23/11/2026, domain publik — kategori 1) |
| 10 | CNN Indonesia · Kompas · ANTARA · NU Online · detik | Amran, Sugiono (kredit seperti S5) |

## Aset

| Aset | Sumber | Lisensi | Dicek | Ukuran |
|---|---|---|---|---|
| amran.jpg | Wikimedia Commons "Amran Sulaiman.jpg" — Pemprov Banten | PD-IDGov | 23/11/2026 | 1280 px |
| sugiono.jpg | "Sugiono, Menteri Luar Negeri RI (2024).jpg" — Kemlu RI | PD-IDGov | 23/11/2026 | 1280 px |
| prabowo.jpg | "Prabowo Subianto 2024 official portrait.jpg" — Kemensetneg | PD-IDGov | 23/11/2026 | 1280 px |
| paripurna.jpg | "Prabowo Subianto delivers first speech… 01.jpg" — Setkab RI | PD-IDGov | 23/11/2026 | 1280 px |
| dasco-2024.jpg | "Sufmi Dasco Ahmad, Wakil Ketua DPR-RI (2024–2029).jpg" — DPR RI | PD-IDGov | 23/11/2026 | 960×960 |
| mahfud.png | "Mahfud MD, Menkopolhukam (2022).png" — Kemenko Polhukam | PD-IDGov | 23/11/2026 | 172×229 |
| muzani-2024.jpg | "Ahmad Muzani, Gerindra candidate for Lampung I in 2024.jpg" — KPU RI | PD-IDGov | 23/11/2026 | 960×1440 |
| mpr-konpers-20261123.png | mpr.go.id/berita/ahmad-muzani-perubahan-sidang-paripurna-11-desember — MPR RI | domain publik (UU 28/2014 Ps. 43b) | 23/11/2026 | 750×482 |
| antara-tiba-20261123.jpg | sulteng.antaranews.com/berita/401843 — kredit "ANTARA/HO-DPR RI" (handout DPR RI) | kategori 1: rilis lembaga (handout); watermark ANTARA dibiarkan utuh | 23/11/2026 | 1200×800 |
| kompas-serah-20261123.jpg | nasional.kompas.com/read/2026/11/23/17054041 — KOMPAS.com (kemungkinan tangkapan siaran YouTube Sekretariat Presiden) | kategori 3: BERHAK CIPTA — dipakai atas keputusan operator; risiko klaim/takedown ditanggung operator; watermark Kompas utuh | 23/11/2026 | 1200×675 |
| SFX (whoosh, pop, tear, shutter, stamp, ding) | disintesis sendiri (`tools/sfx.py`, seed tetap) | milik sendiri | — | 240 KB |
| Font Inter 500–900 | @fontsource/inter | SIL OFL | — | ~ 100 KB |

Total foto 828 KB, SFX 240 KB. 38 cue SFX tercatat di `docs/sfx-cues.json`; puncak SFX −21,8 dBFS vs narasi −3,1 dBFS (≈ 18,7 dB di bawah). Musik: `Backsound-news.mp3` dari user, dipotong ke 75,2 dtk, ducking sidechain di bawah narasi.

Waktu render (4 CPU): preview 0,5× = 53 dtk; final 1080×1920 = 123 dtk.

Revisi 1 (review user): foto Dasco (2013) dan Muzani (frame video AntaraTV) diganti potret resmi terbaru — Dasco: DPR RI 2024–2029; Muzani: KPU RI 2023/2024. Hanya scene 4 & 6 yang di-render ulang (29 dtk); check_output ulang: PASS SEMUA.

## Pelonggaran gerbang

Tidak ada (produksi Mode D pertama — Gerbang 1 & 2 format penuh, 3 still/scene).

## Usulan caption Instagram

> Kursi wakil presiden kosong sejak 12 November. Senin sore (23/11), Presiden Prabowo menyerahkan surat berisi dua nama ke MPR: Andi Amran Sulaiman (Menteri Pertanian) dan Sugiono (Menko PMK, Sekjen Gerindra).
>
> Kenapa dua? Pasal 8 ayat 2 UUD 1945: bila kursi wapres kosong, presiden mengusulkan dua calon dan MPR memilih satu. Sidang paripurna digeser ke Jumat, 11 Desember 2026, setelah Mahfud MD mengingatkan tenggat 14 hari dihitung hari kerja.
>
> Menurutmu, siapa yang lebih pantas: Amran, atau Sugiono? Tulis alasanmu di komentar.
>
> Sumber: CNN Indonesia, Kompas, ANTARA, NU Online, detik, Katadata.
> Foto: Kemensetneg, Kemlu RI, Pemprov Banten, DPR RI, Kemenko Polhukam, KPU RI (domain publik, via Wikimedia Commons); MPR RI; ANTARA/HO-DPR RI; KOMPAS.com.
>
> Basabasi Berita
> #wakilpresiden #MPR #Prabowo #AmranSulaiman #Sugiono #UUD1945 #beritaterkini #basabasi

Revisi 2 (v3.4, hierarki sumber foto): scene 9 memakai foto resmi MPR RI hari ini (konferensi pers jadwal 11 Des). Foto penyerahan surat (scene 4) belum dirilis sumber resmi saat produksi — Setkab/MPR belum memuat, presidenri.go.id & dpr.go.id menolak akses otomatis (403) — sehingga scene 4 tetap foto arsip 2024 berlabel FOTO ARSIP (kategori 4).

Revisi 3 (operator memilih opsi 3 — foto jurnalis): scene 4 tidak lagi memakai foto arsip 2024. Diganti foto peristiwa 23/11/2026: (a) kedatangan Presiden — ANTARA/HO-DPR RI; (b) penyerahan surat — KOMPAS.com (berhak cipta, keputusan operator). Kedua foto tampil utuh sebagai kartu (object-fit contain), Ken Burns dilakukan pada skala kartu sehingga watermark tidak terpotong. Bila foto resmi Setpres/MPR penyerahan surat terbit, disarankan mengganti foto KOMPAS.com (render ulang scene 4 saja ±30 dtk).
