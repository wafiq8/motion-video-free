# Referensi Mode D — Berita (Flat Motion-Graphics News Explainer)

Detail Mode D untuk skill diorama-basabasi. Inti (SKILL.md) tetap
berlaku: timeline.json sebagai sumber kebenaran timing, gerbang,
validator, aturan teks DOM anti-kepotong, audio, QC. File ini
MENGGANTI sistem visual dan struktur narasi Mode A/B/C untuk video
berita. Sumber pola: bedah video @petsreid_ "Kebakaran Baduy Luar"
(X/Instagram, Nov 2026; 77 detik, dua reel-nya menembus 1 juta
tayangan) — grammar formatnya dipakai, identitas visualnya (nama
label, palet persis, aset) TIDAK disalin; tiap seri memakai label
topik dan nama serinya sendiri. Mode D diaktifkan user 23 Nov 2026
atas keputusannya sendiri: style ini "pas buat style news/berita".

## Pengecualian terkunci (HANYA berlaku di Mode D)

Mode D adalah satu-satunya mode yang keluar dari dunia 3D. Untuk
produksi dengan `"mode": "D"` di proyek.config.json, larangan inti
berikut DIGANTI oleh aturan file ini:

1. Larangan "gambar 2D/sprite sebagai scene" → di Mode D scene
   MEMANG ilustrasi vektor 2D datar (komponen DOM/SVG Remotion,
   digambar dari kode — bukan file gambar, bukan hasil generate AI).
2. Larangan foto sebagai scene → di Mode D foto dokumentasi ASLI
   boleh tampil full-bleed sebagai latar scene beat fakta/emosional,
   dengan syarat: foto berasal dari sumber yang disebut user atau
   sumber berita yang dikreditkan, kredit tampil di layar
   ("foto: dok. warga" / "foto: <sumber>"), dan foto dicatat di
   laporan akhir. Foto/gambar hasil generate AI TETAP DILARANG.
3. Aturan "gerakan hanya dari kamera di ruang 3D" → di Mode D gerak
   adalah animasi elemen (pop-in, gambar jalur, count-up, geser
   kartu) yang diturunkan dari `useCurrentFrame()` — tetap
   deterministik, tetap tanpa `Math.random`/`Date.now`.
4. Angka hero 3D emas → TIDAK ADA di Mode D. Semua angka adalah
   readout/counter DOM (di mode ini counter adalah elemen utama,
   bukan pengecualian).
5. Larangan pill/label di layar (v2.8) → di Mode D ada SATU elemen
   tetap yang WAJIB: pill label TOPIK di atas tengah (nama peristiwa,
   mis. "KEBAKARAN BADUY LUAR"). Ini label topik video, bukan pill
   tahap dan bukan kartu seri — pill tahap/penanda posisi tetap
   dilarang, dan nama seri tetap hanya hidup di caption.

Di luar lima poin ini semua keputusan terkunci inti berlaku penuh
(termasuk: fakta dari user menang, klaim belum terverifikasi wajib
ditandai, tidak ada CTA jualan).

## Ruang lingkup

- Topik: peristiwa aktual dan penjelasan aturan/fakta publik —
  kejadian berita (bencana, peristiwa warga, kebijakan baru),
  fakta hukum/konstitusi, klarifikasi isu yang sedang ramai.
  SATU peristiwa/topik per video.
- Pertanyaan pemandu: "apa yang sebenarnya terjadi, dan kenapa ini
  penting?" — dijawab dengan kronologi + fakta bersumber, bukan
  opini.
- Durasi: **30–120 detik** mengikuti audio. Wajib isi
  `"variant": "BERITA"` di timeline.json agar validator memakai
  rentang ini. Palet config: `"berita-navy"` (satu-satunya varian
  terkunci Mode D sampai user menambah sendiri).

## Sistem visual (style lock Mode D)

- Kanvas datar: latar navy gelap polos yang SAMA di semua scene
  grafis (vignette halus diperbolehkan). Tidak ada panggung 3D,
  tidak ada rig cahaya — konsistensi datang dari template.
- Palet terkunci "berita-navy": latar navy gelap; teks putih;
  aksen utama oranye-merah (kata kunci headline, angka besar,
  tanda ✗/penanda masalah); aksen sekunder teal (ikon subjek,
  highlight kutipan). Satu headline = maksimal SATU kata beraksen.
- Ilustrasi vektor datar satu-dua warna: siluet subjek (hewan,
  kendaraan, bangunan), ikon benda, diagram sederhana. Figur
  manusia = siluet datar sederhana, wajah kosong (semangat aturan
  siluet-plus inti, diterjemahkan ke 2D).
- Tipografi: sans-serif bold berat untuk SEMUA teks (tidak ada
  serif di Mode D). Hierarki: headline besar → kartu angka/tanggal
  raksasa → teks penjelas → baris sitasi kecil.
- Elemen tetap: pill label topik di atas tengah di SEMUA scene
  (termasuk scene foto) — huruf kapital, letter-spacing lebar,
  outline tipis, tanpa isi.

## Caption & sitasi (lebih ketat dari inti)

- Caption karaoke **SATU kata per kata** (beda dari Mode A yang
  2–4 kata per halaman): kata yang sedang diucapkan dibungkus kotak
  aksen utama berteks putih; kata lain putih. Posisi zona aman
  bawah, mengikuti aturan teks inti.
- **Baris sitasi WAJIB di setiap scene grafis**: teks kecil redup
  tepat di atas caption, pola "sumber: <nama sumber>" (boleh
  menumpuk beberapa sumber di scene penutup). Scene tanpa klaim
  fakta baru tetap membawa sitasi sumber scene sebelumnya atau
  sumber utama video. Scene foto: kredit foto di kanan atas +
  sitasi di posisi biasa.
- Label kejujuran inti berlaku, ditambah pola khas Mode D:
  peta ilustrasi WAJIB berlabel "peta ilustrasi, tidak berskala";
  dugaan yang belum terbukti WAJIB berlabel BELUM TERBUKTI selama
  kalimatnya dibacakan DAN versi resmi (polisi/lembaga) WAJIB
  disebut di video yang sama. Hook boleh mengajukan pertanyaan
  tajam ("kebetulan… atau bukan?") — badan video dilarang
  menyimpulkan yang tidak dibuktikan sumber.

## Tipe scene (komponen baku — bangun sekali, pakai ulang)

1. **KartuHook** — kartu tanggal/fakta pembuka: tanggal atau fakta
   pertama dalam huruf raksasa + ikon subjek + tanda vonis
   (✗ oranye / ✓ teal). Memuat langkah pertama hook (lihat struktur).
2. **FotoBeat** — foto dokumentasi full-bleed + satu teks besar di
   atasnya (kartu waktu "±23.00 WIB" + ikon jam, atau kalimat
   dampak). Untuk beat fakta/emosional, maksimal ±1/3 video.
3. **PetaLokator** — peta ilustrasi sederhana: wilayah aksen
   ber-outline + pin + kartu label nama tempat; label "peta
   ilustrasi, tidak berskala" wajib.
4. **CounterIkon** — ikon benda berjajar + angka count-up besar
   beraksen di bawahnya + label kecil (pola: "2 leuit — lumbung
   padi"). Angka selesai menghitung tepat saat narasi selesai
   menyebutnya.
5. **ScenePenjelasan** — diagram/scene datar penyebab-mekanisme:
   satu adegan sisi (kendaraan + jalur titik + rintangan + tanda ✗)
   atau diagram benda (rumah + label bahan). Satu gagasan per scene.
6. **KartuKutipan** — tanda kutip besar beraksen sekunder + teks
   kutipan (kata kunci beraksen sekunder) + atribusi nama + peran
   di bawahnya. Hanya kutipan yang benar-benar diucapkan sumber —
   dilarang mengarang kutipan; parafrase diberi label "menurut
   <sumber>" tanpa tanda kutip.
7. **PenutupDampak** — kalimat dampak di atas FotoBeat atau latar
   polos + baris sitasi bertumpuk; narasi menutup dengan verdict
   singkat + pertanyaan terbuka spesifik untuk komentar (mengikuti
   pengecualian penutup A2 perjalanan bukti di inti). Fade ke hitam.

## Struktur narasi (baku Mode D)

1. **Hook dua langkah** (±5 detik pertama): dua fakta/tanggal yang
   berdampingan menimbulkan pertanyaan — langkah 1 di KartuHook,
   langkah 2 di scene berikutnya. Teks+suara+visual hook lengkap
   dalam 1,5 detik pertama (aturan inti).
2. **Kronologi & lokasi**: kapan, jam berapa (FotoBeat kartu waktu),
   di mana (PetaLokator).
3. **Skala dampak**: CounterIkon (rumah, lumbung, keluarga, angka
   resmi lainnya).
4. **Kenapa bisa terjadi / kenapa sulit ditangani**: satu-dua
   ScenePenjelasan.
5. **Suara pihak terkait**: KartuKutipan (tokoh adat, warga,
   pejabat) — sisi manusia dari peristiwa.
6. **Versi resmi & status bukti**: dugaan resmi disebut eksplisit;
   yang belum terbukti dilabeli. Langkah ini WAJIB ada bila hook
   mengajukan kecurigaan.
7. **Penutup dampak**: PenutupDampak + pertanyaan terbuka.

Urutan 2–5 boleh menyesuaikan peristiwa; langkah 1, 6 (bila
relevan), dan 7 tidak boleh hilang.

## Gerakan & transisi

- Animasi elemen: ikon pop-in berurutan mengikuti urutan sebut
  narasi; jalur titik DIGAMBAR progresif; angka count-up; kartu
  geser masuk dari bawah. Semua dari `useCurrentFrame()`.
- Transisi antar scene: cut bersih atau fade hitam ±0,1 detik
  (pola inti). Dilarang transisi dekoratif (wipe berputar, zoom
  gambar 2D mensimulasikan kamera 3D).
- Kamera statis. Yang bergerak adalah elemen di dalam scene.

## QC khusus Mode D (menambah QC inti)

- Pill label topik hadir dan IDENTIK di semua scene; tidak ada
  pill tahap/penanda posisi lain di frame mana pun.
- Setiap scene grafis membawa baris sitasi; setiap foto membawa
  kredit foto; peta membawa label tidak-berskala; klaim dugaan
  membawa label BELUM TERBUKTI + versi resmi disebut.
- Karaoke satu-kata sinkron: kata ter-highlight adalah kata yang
  sedang diucapkan (selisih ≤ 0,3 detik dari timeline).
- Palet tidak bocor: tidak ada warna di luar palet berita-navy
  selain warna foto dokumentasi.
- Tidak ada gambar generate AI di frame mana pun; ilustrasi semua
  vektor dari kode.
- Penutup memuat verdict + pertanyaan terbuka spesifik; BUKAN
  kesimpulan netral ala Mode A dan bukan CTA jualan.
