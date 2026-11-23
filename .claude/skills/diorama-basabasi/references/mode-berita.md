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
Amendemen 23 Nov 2026 (dari review user atas produksi Mode D
pertama): tiga aturan ditambah — foto tokoh wajib, latar tidak
boleh diam, dan lapisan efek suara (SFX) wajib tipis. Pengetatan
lanjutan di hari yang sama: prioritas dokumentasi peristiwa di
atas foto resmi/arsip, dan potongan foto formal wajib ter-center.
Amendemen v3.5 (23 Nov 2026, review user): aturan watermark foto
berita — foto ber-watermark tampil UTUH sebagai KartuFoto, tidak
pernah dipotong; kredit "HO" dikenali sebagai rilis lembaga;
kredit foto pers bukan izin pakai.

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
  tidak ada rig cahaya — konsistensi datang dari template. Latar
  TIDAK BOLEH diam total: gerak latar halus wajib (lihat bagian
  Gerakan & transisi).
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

## Foto tokoh & dokumentasi pendukung (WAJIB)

- Setiap tokoh yang DISEBUT NAMANYA dan menjadi pusat sebuah
  scene (kandidat, pemberi kutipan, pejabat penentu) WAJIB tampil
  dengan FOTO ASLI terkredit — bukan avatar inisial, bukan siluet.
  Foto dicari di Tahap 1 (pengumpulan bahan) dari sumber resmi
  atau terkredit jelas (biro pers lembaga, kantor berita, media
  dengan kredit foto, Wikipedia/Wikimedia) dan dicatat sumber +
  kreditnya di paket produksi; kredit tampil di layar mengikuti
  aturan foto Mode D.
- **Prioritas sumber dokumentasi (berjenjang, wajib berurutan)**:
  (1) dokumentasi PERISTIWA itu sendiri — foto pers hari yang
  sama dari biro pers/agensi/media (mis. BPMI Setpres, ANTARA,
  foto wartawan media) yang memperlihatkan momennya atau tokohnya
  di lokasi kejadian; ini wajib dicari PERTAMA. (2) foto resmi/
  portret tokoh — hanya bila tokohnya tidak tertangkap
  dokumentasi peristiwa. (3) foto arsip lama — jalan terakhir,
  dan wajib dilabeli "foto arsip <tahun>" di layar. Scene momen
  (FotoBeat) DILARANG memakai foto stok/arsip bila dokumentasi
  peristiwanya tersedia; kartu tokoh mengutamakan crop dari
  dokumentasi peristiwa sebelum portret studio — KECUALI foto
  ber-watermark, yang tidak boleh di-crop (lihat "Watermark foto
  berita"); untuk kartu tokoh pakai foto tanpa watermark.
- **Kredit "HO" & status hak cipta**: kredit kantor berita
  berpola "<MEDIA>/HO-<LEMBAGA>" (mis. "ANTARA/HO-DPR RI") berarti
  foto HANDOUT lembaga itu — bila lembaganya instansi negara,
  statusnya rilis resmi (domain publik, UU 28/2014 Pasal 43 huruf
  b); tulis kredit persis seperti di sumber. Kartu media yang
  menyebut sumber resmi (mis. "YouTube Sekretariat Presiden")
  dilacak ke sumber resminya dulu. Foto karya jurnalis media
  (Kompas, detik, ANTARA non-HO, dsb.) BERHAK CIPTA — kredit bukan
  izin; dipakai hanya atas keputusan operator per video, dicatat
  di laporan beserta risikonya (klaim/takedown).
- Penempatan baku: foto lingkaran di kartu tokoh/kandidat;
  foto lingkaran kecil di samping atribusi KartuKutipan; FotoBeat
  tetap untuk momen peristiwanya.
- **Potongan foto formal wajib ter-center**: titik potong foto
  resmi/portret disesuaikan agar wajah subjek berada di TENGAH
  bingkai (lingkaran/kartu), posisi vertikal di sepertiga atas,
  dengan ruang kepala yang konsisten antar kartu dalam satu
  video. Hasil crop diperiksa di still QC — wajah yang kepotong,
  minggir, atau terlalu kecil/besar dibetulkan titik potongnya
  (object-position) sebelum render, bukan dibiarkan.
- Avatar inisial/siluet HANYA cadangan bila foto benar-benar
  tidak ditemukan setelah dicari — dan pemakaiannya WAJIB
  dinyatakan eksplisit di laporan produksi, tidak diam-diam.

### Watermark foto berita (amendemen v3.5)

Foto dari media/kantor berita sering membawa watermark (logo di
sudut, banner nama media di bawah). Aturannya:

- **Watermark TIDAK BOLEH dipotong, ditutup, diburamkan, di-crop,
  atau dihapus** — termasuk tidak boleh "terpotong tidak sengaja"
  oleh object-fit cover, crop lingkaran, atau zoom Ken Burns.
- Foto ber-watermark tampil sebagai **KartuFoto**: kartu
  berbingkai putih tipis, gambar `object-fit: contain` (seluruh
  bidang foto terlihat, termasuk watermark), lebar ±960 px,
  proporsi asli foto. DILARANG dijadikan FotoBeat full-bleed,
  foto lingkaran tokoh, atau latar blur — semua itu memotong tepi.
- Ken Burns untuk KartuFoto dilakukan pada **skala kartu**
  (mis. 1,00 → 1,05 sepanjang beat), BUKAN zoom di dalam bingkai,
  sehingga watermark tetap utuh di setiap frame.
- Elemen lain (kartu jam, label, kartu tokoh, pill, sitasi) tidak
  boleh menimpa area watermark; atur tata letak di sekitarnya.
- Kredit foto tetap wajib tampil (kanan atas) walau watermark
  sudah menyebut medianya — watermark bukan pengganti kredit.
- Pakai file resolusi terbaik dari halaman artikel (og:image /
  gambar utama); jangan memakai thumbnail kartu berita yang sudah
  ditambahi judul/desain, dan jangan screenshot siaran TV.
- Foto TANPA watermark (rilis resmi, Commons) tetap boleh
  full-bleed / lingkaran / blur seperti biasa.
- Laporan akhir mencatat per foto: ada/tidaknya watermark, status
  hak cipta (rilis resmi/HO, lisensi terbuka, atau berhak cipta +
  keputusan operator), dan konfirmasi watermark utuh di semua frame.

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
   Foto tampil dengan zoom Ken Burns lambat — tidak pernah diam.
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
   di bawahnya. Atribusi disertai foto lingkaran kecil tokohnya
   (lihat aturan foto tokoh). Hanya kutipan yang benar-benar diucapkan sumber —
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
- **Gerak latar halus WAJIB**: latar navy tidak boleh beku —
  pakai drift gradasi sangat lambat, grid/garis samar yang
  bergerak perlahan, atau partikel debu cahaya tipis; semuanya
  deterministik dari `useCurrentFrame()` dan cukup halus untuk
  tidak merebut perhatian dari isi.
- **Ukuran minimal gerak**: di setiap scene, selain karaoke,
  minimal ada SATU elemen yang bergerak terus atau berubah
  mengikuti isi kalimat yang sedang dibacakan (foto ber-Ken
  Burns, angka menghitung, jalur tergambar, latar berdrift).
  Scene yang seluruh elemennya diam setelah pop-in pembuka
  dianggap GAGAL QC.

## Lapisan efek suara (SFX — WAJIB, tipis)

- Narasi tetap audio utama. Di bawahnya WAJIB ada lapisan SFX
  tipis yang menandai beat visual — video tanpa SFX terasa datar
  dan dianggap belum selesai.
- Peta bunyi baku: **whoosh** lembut tiap pergantian scene;
  **pop** saat kartu/elemen utama masuk; **sobek kertas/amplop**
  untuk beat dokumen, surat, dan amplop; **shutter kamera** saat
  FotoBeat masuk; **duk stempel** untuk stempel/vonis/keputusan;
  **ding** lembut saat kata kunci kutipan menyala.
- Level SFX jauh di bawah narasi (patokan: puncak SFX ±15–20 dB
  di bawah puncak narasi; loudness akhir video tetap lolos
  gerbang inti). SFX tidak pernah menutupi suku kata narasi.
- Sumber SFX hanya yang bebas lisensi atau dibangkitkan sendiri
  (sintesis) — dilarang mengambil dari video/karya berhak cipta.
  Daftar SFX yang dipakai dicatat di paket produksi.

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
- Setiap tokoh pusat bernama tampil dengan foto asli terkredit;
  avatar inisial hanya cadangan yang dinyatakan di laporan.
- Dokumentasi mengikuti prioritas sumber (peristiwa > resmi >
  arsip berlabel tahun) dan potongan foto formal ter-center:
  wajah di tengah bingkai, ruang kepala konsisten antar kartu.
- Tidak ada scene yang seluruh elemennya diam: gerak latar halus
  berjalan dan foto selalu ber-Ken Burns.
- Lapisan SFX hadir mengikuti peta bunyi baku dan tidak menutupi
  narasi (loudness akhir tetap lolos gerbang inti).
- Watermark foto berita utuh di setiap frame (tidak terpotong
  oleh crop, lingkaran, blur, zoom, atau elemen lain); foto
  ber-watermark hanya tampil sebagai KartuFoto; kredit tetap ada.
