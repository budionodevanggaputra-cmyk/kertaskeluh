Proyek "Kertas Keluh" sudah punya `blueprint-kertaskeluh.md` (v3) dan kode hasil blueprint itu. Sekarang ubah konsep scroll dan jelajah situs dari kanvas 2D (pan + zoom) menjadi terowongan 3D berbasis scroll, mengikuti folder referensi `per-appelgren-404-photo-tunnel-three-js`. Blueprint v3 tetap berlaku untuk semua hal yang tidak diubah di bawah. Jika ada konflik, prompt ini menang.

## TAHAP 1: ANALISIS REFERENSI (lakukan diam-diam, jangan tulis hasilnya)
Cari dan baca seluruh folder `per-appelgren-404-photo-tunnel-three-js` (di folder kerja atau folder induknya). Catat:
- versi Three.js dan cara impornya, serta apakah memakai bundler (Vite/Webpack/npm)
- bentuk terowongan: geometri, jumlah segmen, jarak antar panel, susunan foto di dinding, apakah menyambung tanpa ujung (loop)
- mekanisme scroll: wheel hijack atau scroll native, touch, damping/lerp, kecepatan, arah
- gerak kamera: posisi, FOV, rotasi/roll, parallax mengikuti mouse
- efek: fog, fade jarak, easing, animasi masuk
- interaksi: hover, klik, loading texture, resize, render loop
Semua tahap berikutnya meniru perilaku itu semirip mungkin. Jika folder tidak ditemukan, keluarkan satu blok kode berisi hanya `// BLOCKER: folder per-appelgren-404-photo-tunnel-three-js tidak ditemukan` lalu berhenti.

## TAHAP 2: PERUBAHAN KONSEP

### A. Pemetaan konsep
- Setiap cerita (catatan) menjadi satu panel di dinding terowongan, menggantikan "foto" pada referensi.
- Scroll memajukan kamera menyusuri terowongan (mekanisme persis seperti referensi). Cerita terbaru berada paling dekat dengan pintu masuk, yang lama semakin jauh.
- Posisi tiap panel dihitung deterministik dari urutan `createdAt` dan `seed` catatan (sebaran di sekeliling sumbu terowongan, jarak mengikuti referensi). Rotasi roll panel acak `-3deg` s.d. `+3deg` dari `seed`.
- Model data: hapus field `x` dan `y`, tambah `seed: number`. Field lain tetap.
- Terowongan memanjang sesuai jumlah cerita. Di ujung terdalam ada satu panel penutup: "Itu semua cerita untuk saat ini." Bila belum ada cerita, tampilkan satu panel kosong di dekat pintu masuk: "Belum ada cerita di sini. Tidak apa-apa. Kamu boleh mulai kapan saja."
- Setelah cerita terbit, kamera terbang halus ke panel baru, lalu panel diberi cincin aksen selama 1,5 detik (ganti `note-card--fresh`).
- Hover pada panel: sorot halus (skala sampai 1.04, easing tenang). Klik: kamera mendekat di depan panel dan panel lain meredup. ESC atau klik area kosong kembali. Jika referensi punya perilaku klik berbeda, ikuti referensi.

### B. Pemetaan fitur v3 ke terowongan
- **Home**: kamera kembali ke pintu masuk (progres 0), zoom 100%, hero penuh.
- **Tambah Cerita** dan **Information**: tidak berubah (composer dan modal tetap DOM).
- **Hero**: tetap overlay DOM di atas kanvas WebGL. `hero--compact` aktif saat progres scroll melewati ambang kecil (misal 2% panjang terowongan).
- **Zoom**: diubah menjadi pembesaran lewat FOV kamera, rentang 50%-200% (`ZOOM.min=0.5`, `ZOOM.max=2`), langkah tombol 1.2x, persen di panel zoom tetap. Input zoom tetap lengkap: tombol +/−, Ctrl/Cmd+roda, pinch dua jari, pintasan `+`, `-`, `0`. Scroll biasa (tanpa Ctrl) menggerakkan kamera maju-mundur, bukan zoom.
- **"Lihat semua"** menjadi "Maju ke awal": kamera menuju progres 0 dengan FOV melebar ke zoom minimum agar panel terdekat terlihat sekaligus.
- **Navigasi tambahan**: tombol panah atas/bawah dan PageUp/PageDown memajukan kamera; Home/End ke awal/ujung terowongan. Tambahkan dua tombol kecil "Maju" dan "Mundur" ke panel `zoom` untuk pengguna tanpa roda.
- **Latar**: `assets/scene.jpg` tetap menjadi latar DOM (`scene`) di belakang kanvas WebGL. Renderer WebGL memakai `alpha: true` dan latar transparan agar ilustrasi terlihat di sela panel. Tint siang/malam tetap lewat CSS variables.
- **Tema siang/malam**: warna panel kosong, cincin, dan fog dibaca dari CSS variables (`getComputedStyle`) dan diperbarui saat `data-theme` berubah. Dilarang menulis warna terpisah di JS.
- **Persistensi tampilan**: simpan `{progress, zoom}` ke `kertaskeluh:view:v1` (menggantikan `{scale, tx, ty}`).
- **Penghitung** di kartu mint dan modal Information tetap.

### C. Tampilan isi panel
- Setiap catatan dirender ke tekstur lewat 2D canvas offscreen (modul `note-texture.js`): warna latar sesuai `--note-*`, teks tulisan tangan Caveat, dukungan bold, italic, dan daftar dari HTML yang SUDAH disanitasi (parse whitelist saja, jangan `innerHTML`), gambar catatan di atas teks, stempel tanggal di pojok. Tekstur maksimum 512 px lebar, `colorSpace` sesuai versi Three.js yang dipakai.
- Panel berbentuk bidang datar dengan sudut membulat (radius setara 10px). Tanpa bayangan lembut, tanpa blur, tanpa gradien pada tekstur.
- Pudarkan panel jauh lewat opacity material berdasarkan jarak ke kamera (diizinkan khusus untuk ini, tanpa blur).
- Optimasi: buat tekstur hanya untuk panel dalam jangkauan sekitar kamera (jendela ±N panel, N dari `config.js`), lepas (`dispose`) yang keluar jangkauan. Batasi `devicePixelRatio` maksimum 2. Hentikan render saat tab tersembunyi. Render hanya saat ada perubahan (nilai ber-damping belum mencapai target).

### D. Aksesibilitas dan fallback
- Sediakan daftar cerita paralel di DOM yang tersembunyi secara visual (`tunnel__a11y-list`) berisi teks catatan yang sudah disanitasi, agar pembaca layar bisa mengakses semuanya.
- `prefers-reduced-motion: reduce`: matikan damping dan terbang kamera (lompat langsung), matikan parallax mouse.
- Jika WebGL tidak tersedia atau konteks gagal dibuat: tampilkan `tunnel__fallback`, daftar vertikal kartu catatan 2D (gaya `note-card` v3, bergulir native). Fungsi lain (composer, pembayaran, modal) tetap berjalan.
- Keyboard: kanvas `tabindex="0"`, `role="region"`, `aria-label="Terowongan cerita. Gunakan panah atas dan bawah untuk maju dan mundur, plus dan minus untuk zoom."`
- Semua kontrol DOM tetap memenuhi aturan aksesibilitas Bagian 7 blueprint.

## TAHAP 3: ATURAN TEKNIS TAMBAHAN (mengubah Bagian 2.2 blueprint)
- Three.js diizinkan sebagai SATU-SATUNYA library JS. Syaratnya: di-vendor lokal di `vendor/three/`, TANPA CDN dan TANPA npm. Salin berkasnya dari folder referensi atau dari `node_modules` referensi dengan perintah shell (`cp`), jangan menulis ulang atau mengunduh. Impor memakai path relatif ES Module atau `<script type="importmap">` yang menunjuk ke berkas lokal tersebut. Berkas JS yang diimpor lewat importmap boleh ada di `index.html` hanya sebagai blok importmap JSON (tanpa logika).
- Jika referensi memakai bundler, ambil logikanya saja dan tulis ulang sebagai ES Modules vanilla tanpa bundler.
- Jangan memakai addon/loader yang tidak dipakai. Salin hanya modul Three.js yang benar-benar diimpor.
- Semua aturan v3 yang lain tetap: HTML/CSS/JS terpisah, CSS vanilla, BEM ketat, tanpa gradien CSS, tanpa `backdrop-filter`, tanpa bayangan blur, tanpa `style=""` (kecuali custom property), tanpa `innerHTML` dengan data yang belum disanitasi, semua konstanta di `config.js`.

## PERUBAHAN STRUKTUR BERKAS
Hapus (lewat shell): `js/modules/canvas.js`, `css/blocks/canvas.css`.
Tambah:
```
vendor/three/                      (hasil salinan, bukan ditulis ulang)
js/modules/tunnel/scene.js         (renderer, scene, kamera, loop render, resize)
js/modules/tunnel/camera-rig.js    (progres scroll, damping, FOV/zoom, terbang ke panel)
js/modules/tunnel/input.js         (wheel, touch, keyboard, pinch, Ctrl+wheel)
js/modules/tunnel/note-panels.js   (posisi deterministik, hover, klik, jendela tekstur)
js/modules/tunnel/note-texture.js  (render catatan ke tekstur 2D canvas)
js/modules/tunnel/fallback-list.js (daftar 2D bila tanpa WebGL + daftar a11y)
css/blocks/tunnel.css              (blok `tunnel`: viewport, a11y-list, fallback, empty)
```
Ubah: `config.js` (konstanta tunnel: jarak panel, jendela tekstur N, damping, FOV dasar, ZOOM baru), `storage.js` (format view baru), `notes.js` (hanya data dan seed, tanpa DOM kanvas), `zoom-controls.js`, `hero.js`, `nav.js`, `composer.js` (setelah publikasi memanggil terbang kamera), `main.js`, `index.html` (ganti `canvas` dengan `tunnel`, tambah importmap), `main.css` (impor `tunnel.css`).

## ATURAN OUTPUT (PRIORITAS TERTINGGI)
1. Respons HANYA berisi blok kode murni, satu blok per berkas yang BARU atau BERUBAH. Jangan ulangi berkas yang tidak berubah.
2. Tanpa pengantar, narasi, penjelasan, ringkasan, atau penutup di luar blok kode.
3. Baris pertama tiap blok adalah komentar penanda path (`<!-- FILE: ... -->`, `/* FILE: ... */`, atau `// FILE: ...`).
4. Untuk berkas yang berubah, keluarkan isi LENGKAP berkas, bukan potongan diff.
5. Operasi berkas (salin vendor, hapus berkas lama) dilakukan lewat shell, bukan dituliskan sebagai narasi.
6. Urutan output: `vendor` (via shell), `index.html`, CSS (`tunnel.css`, lalu CSS yang berubah), `config.js`, `storage.js`, `notes.js`, modul `tunnel/*`, modul lain yang berubah, terakhir `main.js`.
7. Bila ambigu, ambil keputusan paling konservatif dan paling dekat dengan referensi. Jangan bertanya balik.

## CHECKLIST (verifikasi diam-diam sebelum mengeluarkan kode)
- [ ] Mekanisme scroll dan gerak kamera meniru folder referensi.
- [ ] Three.js lokal di `vendor/three/`, tanpa CDN dan npm; tidak ada library lain.
- [ ] Cerita tampil sebagai panel dengan teks tulisan tangan, bold/italic/list, gambar, dan stempel tanggal.
- [ ] Panel baru langsung terlihat setelah pembayaran sukses; kamera terbang ke sana.
- [ ] Zoom FOV 50%-200% lengkap (tombol, Ctrl/Cmd+roda, pinch, keyboard); scroll biasa tidak mengubah zoom.
- [ ] Home, Tambah Cerita, Information, hero, kartu mint, jeda napas, dan modal bantuan tetap berfungsi.
- [ ] Latar `scene.jpg` terlihat di sela panel; warna WebGL mengikuti CSS variables siang/malam.
- [ ] Tekstur dilepas di luar jangkauan; render berhenti saat idle atau tab tersembunyi.
- [ ] Fallback tanpa WebGL, daftar a11y, dan reduced motion berfungsi.
- [ ] Tidak ada gradien CSS, blur, atau bayangan blur; BEM tetap ketat.

Mulai sekarang: lakukan Tahap 1 diam-diam, lalu keluarkan semua berkas sesuai aturan output.
