Kamu adalah agen yang MENULIS BERKAS KE DISK di folder proyek saat ini. Tugas: bangun atau ubah proyek "Kertas Keluh" menjadi terowongan 3D berbasis scroll, memakai blueprint v3, folder referensi terowongan foto, dan skill desain di workspace. Menampilkan kode di chat tanpa menulisnya ke disk dianggap GAGAL.

## LANGKAH 0: PERSIAPAN (wajib, lewat tool shell, sebelum menulis apa pun)
1. Jalankan `pwd && ls -la`. Direktori ini adalah root proyek. Jangan menulis ke direktori lain dan jangan membuat folder proyek baru.
2. Cari dan baca PENUH `blueprint-kertaskeluh.md` (v3). Jika tidak ada di sini: `find .. -maxdepth 3 -name "blueprint-kertaskeluh.md"` dan pakai hasilnya.
3. Cari dan baca seluruh folder `per-appelgren-404-photo-tunnel-three-js`: `find . .. -maxdepth 3 -type d -name "per-appelgren-404-photo-tunnel-three-js"`. Catat versi Three.js dan cara impor, ada tidaknya bundler, bentuk terowongan, mekanisme scroll (wheel hijack atau native, touch, damping), gerak kamera, fog dan fade, hover dan klik, loading tekstur, resize, render loop.
4. Baca SKILL.md keempat skill ini: `.agents/skills/antigravity-design-expert`, `.agents/skills/frontend-design`, `.agents/skills/impeccable`, `.agents/skills/ui-ux-pro-max`. Jika path berbeda, cari dengan `find . ~/.gemini -name SKILL.md`. Boleh juga memanggil `/frontend-design` dan sejenisnya bila perintah slash tersedia. Ikuti alur kerja tiap skill, tetapi patuhi prioritas aturan di bawah.
5. Cek kondisi proyek. Jika sudah ada kode (index.html, css/, js/), UBAH DI TEMPAT dan hapus berkas yang tidak dipakai lagi. Jika belum ada, bangun dari nol. Jika folder referensi tidak ditemukan, berhenti dan laporkan di blok kode akhir `BLOCKER: folder referensi tidak ditemukan`.

## PRIORITAS ATURAN (jika ada pertentangan, yang lebih atas menang)
1. Larangan keras blueprint v3 (Bagian 2 dan 4.1): HTML/CSS/JS terpisah, CSS vanilla, BEM ketat, tanpa gradien CSS, tanpa `backdrop-filter` atau blur, tanpa bayangan blur, tanpa `style=""` selain custom property lewat JS, tanpa `onclick` inline, tanpa `!important`, tanpa `innerHTML` dengan data yang belum disanitasi, tanpa Tailwind atau framework, semua konstanta di `config.js`.
2. Spesifikasi terowongan di bawah, lalu bagian lain blueprint v3.
3. Tampilan referensi visual v3: bingkai hijau-abu gelap, kartu `stage` membulat, latar `assets/scene.jpg`, headline Cormorant Garamond, UI Poppins, isi catatan Caveat, tiga pil navbar (Home, Tambah Cerita, Information), kartu mint.
4. Panduan skill. Saran skill yang melanggar prioritas 1 (glassmorphism, blur, gradien, bayangan lembut, library via CDN) DIABAIKAN. GSAP boleh dipakai hanya untuk gerak elemen DOM (hero, modal, navbar), hanya jika berkas lokalnya sudah ada di `vendor/gsap/`; jangan mengunduh. Jika tidak ada, pakai CSS transition dan Web Animations API. Gerak kamera Three.js memakai damping sendiri, bukan GSAP.

## PERAN SKILL
- `frontend-design`: arah estetika dan tipografi supaya hasil tidak terkesan template. Terapkan pada hero, panel, dan modal tanpa keluar dari palet blueprint.
- `antigravity-design-expert`: pelapisan kedalaman (depth layering), parallax halus, dan koreografi gerak. Terapkan hanya yang sejalan dengan prioritas 1, tanpa efek kaca.
- `ui-ux-pro-max`: token sistem desain, aksesibilitas, kontras, target sentuh 44px, responsif, reduced motion, dan checklist sebelum penyerahan.
- `impeccable`: setelah build selesai, jalankan critique, audit, polish, dan harden pada hasilnya, lalu perbaiki temuannya langsung di berkas.

## SPESIFIKASI PERUBAHAN: TEROWONGAN 3D
Kanvas 2D (pan dan zoom) diganti terowongan 3D berbasis scroll yang meniru folder referensi. Jangan membuat `js/modules/canvas.js` maupun `css/blocks/canvas.css`; jika sudah ada, hapus.

**Konsep:**
- Setiap cerita adalah satu panel di dinding terowongan. Scroll memajukan kamera (mekanisme persis seperti referensi). Cerita terbaru paling dekat pintu masuk.
- Posisi panel deterministik dari urutan `createdAt` dan `seed`; roll panel acak `-3deg` s.d. `+3deg` dari `seed`. Model data: hapus `x` dan `y`, tambah `seed`.
- Belum ada cerita: satu panel kosong dekat pintu masuk ("Belum ada cerita di sini. Tidak apa-apa. Kamu boleh mulai kapan saja."). Ujung terowongan: panel "Itu semua cerita untuk saat ini."
- Setelah pembayaran sukses, kamera terbang halus ke panel baru, lalu panel diberi cincin aksen 1,5 detik.
- Hover: sorot halus (skala sampai 1.04). Klik: kamera mendekat dan panel lain meredup; ESC atau klik area kosong kembali. Ikuti perilaku referensi bila berbeda.

**Fitur v3 yang dipetakan:**
- Home: kamera kembali ke progres 0, zoom 100%, hero penuh. Tambah Cerita, Information, composer, pembayaran Rp 2.000, jeda napas, bantuan, draf otomatis, dan kartu mint tetap.
- Hero tetap overlay DOM; `hero--compact` aktif saat progres scroll melewati ambang kecil.
- Zoom lewat FOV kamera, 50%-200%, langkah 1.2x, persen di panel zoom. Input lengkap: tombol +/−, Ctrl/Cmd+roda, pinch dua jari, pintasan `+`, `-`, `0`. Scroll biasa memajukan kamera, bukan zoom. "Lihat semua" menjadi "Maju ke awal" (progres 0 dengan FOV melebar). Tambah tombol "Maju" dan "Mundur" di panel zoom. Panah atas/bawah, PageUp/PageDown, Home/End juga menggerakkan kamera.
- Latar `assets/scene.jpg` tetap DOM di belakang kanvas WebGL (`alpha: true`). Warna panel kosong, cincin, dan fog dibaca dari CSS variables lewat `getComputedStyle` dan diperbarui saat `data-theme` berubah.
- Simpan `{progress, zoom}` di `kertaskeluh:view:v1`.

**Isi panel:** render tiap catatan ke tekstur lewat 2D canvas offscreen (`note-texture.js`): warna `--note-*`, teks Caveat dengan bold, italic, dan daftar dari HTML yang SUDAH disanitasi, gambar, dan stempel tanggal; tekstur maksimum 512 px lebar. Panel datar bersudut membulat setara 10px, tanpa gradien pada tekstur. Opacity material boleh dipakai untuk memudarkan panel jauh. Buat tekstur hanya untuk jendela ±N panel dari kamera dan `dispose` sisanya. Batasi `devicePixelRatio` maksimum 2, hentikan render saat tab tersembunyi, render hanya saat ada perubahan.

**Aksesibilitas dan fallback:** daftar cerita paralel di DOM tersembunyi secara visual (`tunnel__a11y-list`); `prefers-reduced-motion` mematikan damping, terbang kamera, dan parallax; tanpa WebGL tampilkan `tunnel__fallback` (daftar vertikal kartu catatan); kanvas `tabindex="0"`, `role="region"`, `aria-label="Terowongan cerita. Gunakan panah atas dan bawah untuk maju dan mundur, plus dan minus untuk zoom."`

**Teknis:** Three.js adalah satu-satunya library JS dan harus lokal di `vendor/three/`, disalin dengan `cp` dari folder referensi (hanya modul yang benar-benar diimpor), tanpa CDN dan tanpa npm. Jika referensi memakai bundler, ambil logikanya dan tulis ulang sebagai ES Modules vanilla. Impor lewat path relatif atau blok `<script type="importmap">` JSON.

**Struktur tambahan:**
    vendor/three/
    js/modules/tunnel/scene.js
    js/modules/tunnel/camera-rig.js
    js/modules/tunnel/input.js
    js/modules/tunnel/note-panels.js
    js/modules/tunnel/note-texture.js
    js/modules/tunnel/fallback-list.js
    css/blocks/tunnel.css
Ubah juga: `config.js`, `storage.js`, `notes.js`, `zoom-controls.js`, `hero.js`, `nav.js`, `composer.js`, `main.js`, `index.html`, `main.css`. `assets/scene.jpg` sudah tersedia, jangan dibuat.

## TAHAP KERJA
1. Analisis (Langkah 0). 2. Build: tulis semua berkas ke disk. 3. Quality pass: jalankan `impeccable` (critique, audit, polish, harden) dan checklist `ui-ux-pro-max`, perbaiki temuan langsung. 4. Verifikasi (di bawah).

## VERIFIKASI (wajib lewat shell, perbaiki sampai bersih)
- `find . -type f -not -path "./vendor/*" -not -path "./.git/*" | sort` dan pastikan semua berkas di struktur blueprint dan struktur tambahan ada.
- `grep -rnE "linear-gradient|radial-gradient|conic-gradient|backdrop-filter|!important|onclick=" css js index.html` harus kosong. `grep -rn 'style="' index.html` harus kosong.
- Pastikan `js/modules/canvas.js` dan `css/blocks/canvas.css` tidak ada, dan `index.html` tidak memuat CDN selain Google Fonts.
- Jika Node tersedia, periksa sintaks setiap berkas JS dengan menyalinnya ke `/tmp/x.mjs` lalu `node --check`.
- Pastikan `vendor/three/` berisi berkas dan semua impor Three.js menunjuk ke sana.

## ATURAN OUTPUT
- Selama bekerja jangan menulis narasi atau penjelasan.
- Balasan akhir HANYA SATU blok kode murni (info-string `text`) berisi: daftar berkas yang ditulis atau diubah, hasil tiap perintah verifikasi (jumlah pelanggaran), dan daftar temuan `impeccable` yang sudah diperbaiki. Tanpa pengantar atau penutup di luar blok.
- Bila ada yang ambigu, ambil keputusan paling konservatif dan paling dekat dengan folder referensi. Jangan bertanya balik.

Mulai sekarang dengan Langkah 0.
