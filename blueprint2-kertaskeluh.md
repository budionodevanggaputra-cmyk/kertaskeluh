# BLUEPRINT: KERTAS KELUH (v3)

> Dokumen instruksi untuk CLI AI coding tool **agy**.
> Baca SELURUH dokumen sebelum menulis satu baris kode pun. Semua aturan bersifat MUTLAK kecuali ditandai `[OPSIONAL]`.
> **Perubahan v3:** tampilan bingkai tepi dan latar mengikuti gambar referensi situs kesehatan mental (langit malam berilustrasi, headline serif, navbar pil putih, kartu mint); font disamakan dengan referensi; navbar berisi **Home, Tambah Cerita, Information**; fitur **zoom in/zoom out** dari v2 digabung penuh.

---

## 0. ATURAN OUTPUT UNTUK `agy` (PRIORITAS TERTINGGI)

1. Respons HANYA boleh berisi blok kode murni (fenced code block).
2. DILARANG keras menulis kalimat pengantar, narasi, penjelasan, ringkasan, ucapan penutup, atau komentar di luar blok kode.
3. Satu file = satu blok kode. Baris pertama di dalam setiap blok WAJIB berupa komentar penanda path file:
   - HTML: `<!-- FILE: index.html -->`
   - CSS: `/* FILE: css/base/variables.css */`
   - JS: `// FILE: js/modules/theme.js`
   - SVG: `<!-- FILE: assets/dot-grid.svg -->`
4. Info-string fence memakai bahasa file: `html`, `css`, `js`, `svg`.
5. Keluarkan semua file dalam SATU respons, berurutan sesuai Bagian 3.2.
6. Komentar boleh ada DI DALAM kode (ringkas, bahasa Indonesia) hanya jika menjelaskan keputusan non-obvious. Dilarang komentar dekoratif atau basa-basi.
7. Jika ada ambiguitas, ambil keputusan paling konservatif sesuai blueprint ini. DILARANG bertanya balik.
8. DILARANG membuat, menggambar, mengunduh, atau meng-encode gambar latar. Gambar latar `assets/scene.jpg` sudah disediakan pengguna di folder proyek; kode hanya mereferensikannya.

---

## 1. RINGKASAN PRODUK

**Nama:** Kertas Keluh
**Konsep:** Papan kanvas lebar interaktif (mirip FigJam/Miro) tempat pengguna menempelkan **cerita** berbentuk sticky note. Isi catatan: teks rich-format (bold, italic, list) dan/atau satu gambar. Kanvas dapat di-zoom dan digeser.
**Monetisasi:** Rp 2.000 per cerita. Cerita terbit setelah modal pembayaran (MOCKUP, tanpa gateway sungguhan).
**Anonim:** Tidak ada nama, akun, atau profil. Catatan hanya menampilkan tanggal.
**Bahasa antarmuka:** Indonesia. Istilah yang dipakai di antarmuka: "cerita" (bukan "keluhan").
**Nada produk:** Tenang, hangat, tidak menghakimi, tidak menekan. Tidak ada kata bernada urgensi, hitung mundur, atau rasa bersalah. Bukan layanan konseling dan tidak boleh mengklaim demikian.
**Tanpa backend.** Seluruh state disimpan di `localStorage`.

---

## 2. ATURAN ARSITEKTUR (WAJIB)

### 2.1 Pemisahan berkas
- HTML, CSS, dan JS WAJIB berada di berkas terpisah. DILARANG: blok `<style>`, atribut `style="..."` (kecuali custom property dinamis, lihat 2.4), handler inline (`onclick=...`), dan `<script>` berisi logika di dalam HTML.
- Satu-satunya pengecualian: `<script src="js/modules/theme.js"></script>` di `<head>` TANPA `defer`/`module` agar tema terpasang sebelum render pertama.

### 2.2 Teknologi
- HTML5 semantik. CSS vanilla murni (tanpa preprocessor, Tailwind, Bootstrap, atau framework). JS vanilla ES Modules (`type="module"`).
- DILARANG: npm package, bundler, CDN library JS/CSS, jQuery, framework UI, library ikon. Satu-satunya sumber eksternal yang diizinkan adalah Google Fonts (lihat 4.3) dengan fallback stack lengkap.
- DILARANG emoji sebagai ikon. Ikon dibuat dari karakter teks (`+`, `−`, `×`) atau SVG inline minimal.

### 2.3 Penamaan class: BEM STRIK
- Format: `block`, `block__element`, `block--modifier`, `block__element--modifier`.
- Huruf kecil, `kebab-case`. Contoh: `nav__item--active`, `note-card--butter`.
- DILARANG: elemen bersarang (`block__el__el`), selector tag (kecuali di `reset.css`), selector ID untuk styling, selector turunan yang melewati batas block, `!important`, class utilitas (`.mt-4`, `.flex`), dan class state tanpa block (`.active`, `.is-open`). State dinyatakan lewat modifier: `modal--open`, `toolbar__button--active`.
- Hook JavaScript memakai atribut `data-js="nama-hook"`, BUKAN class.
- Setiap block memiliki berkas CSS sendiri bernama sesuai block-nya.

### 2.4 Custom property dinamis
Nilai per elemen diberikan lewat custom property yang diset JS memakai `element.style.setProperty(...)`. Hanya cara ini yang boleh menyentuh `style`. Variabel: `--note-rotation`, `--note-x`, `--note-y`, `--view-x`, `--view-y`, `--view-scale`, `--phase-ms`. CSS membacanya, misal: `transform: translate(var(--view-x), var(--view-y)) scale(var(--view-scale));`.

### 2.5 Struktur direktori (WAJIB persis)

```
kertas-keluh/
├── index.html
├── assets/
│   ├── scene.jpg                (DISEDIAKAN PENGGUNA, jangan dibuat)
│   └── dot-grid.svg
├── css/
│   ├── main.css                 (hanya @import berurutan)
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── typography.css
│   └── blocks/
│       ├── app.css
│       ├── stage.css
│       ├── scene.css
│       ├── topbar.css
│       ├── brand.css
│       ├── nav.css
│       ├── hero.css
│       ├── canvas.css
│       ├── zoom.css
│       ├── note-card.css
│       ├── composer.css
│       ├── toolbar.css
│       ├── editor.css
│       ├── uploader.css
│       ├── modal.css
│       ├── payment.css
│       ├── pause.css
│       ├── support.css
│       ├── info.css
│       ├── ticker.css
│       ├── button.css
│       └── toast.css
└── js/
    ├── main.js
    └── modules/
        ├── theme.js
        ├── config.js
        ├── storage.js
        ├── canvas.js
        ├── zoom-controls.js
        ├── notes.js
        ├── editor.js
        ├── sanitizer.js
        ├── uploader.js
        ├── composer.js
        ├── care.js
        ├── payment.js
        ├── pause.js
        ├── support.js
        ├── info.js
        ├── nav.js
        ├── hero.js
        ├── toast.js
        └── utils.js
```

### 2.6 Standar kode JS
- Satu modul = satu tanggung jawab. Named export, tanpa variabel global.
- `const`/`let` saja. Fungsi kecil, nama deskriptif bahasa Inggris, komentar bahasa Indonesia.
- Semua akses `localStorage` dibungkus `try/catch` dan harus tetap berjalan bila storage kosong, rusak, atau penuh.
- Event listener lewat hook `data-js`; gunakan event delegation untuk elemen dinamis.
- DILARANG `innerHTML` dengan data pengguna yang belum melewati `sanitizer.js`.
- Semua angka konfigurasi (batas zoom, durasi, batas karakter, daftar kata, kontak bantuan) dikumpulkan di `config.js`.

---

## 3. RENCANA BERKAS

### 3.1 Tanggung jawab tiap modul JS

| Modul | Tanggung jawab |
|---|---|
| `theme.js` | Tema dari jam lokal, set `data-theme` di `<html>`, perbarui tiap menit. Script klasik (tanpa `import`/`export`), dimuat sinkron di `<head>`. |
| `config.js` | Semua konstanta: `ZOOM`, `WORLD`, `LIMITS`, `BREATHING`, `CARE_KEYWORDS`, `SUPPORT`, `SIMULATE_FAILURE_RATE`. |
| `storage.js` | `loadNotes/saveNotes`, `loadView/saveView`, `loadDraft/saveDraft/clearDraft`. Aman terhadap JSON rusak dan quota penuh. |
| `canvas.js` | State tampilan `{scale, tx, ty}`; pan (pointer, wheel, keyboard), pinch zoom, `zoomAt`, `zoomBy`, `resetView`, `fitToNotes`, `centerOn`, konversi koordinat, `getVisibleWorldRect`, clamp. |
| `zoom-controls.js` | Panel zoom (tombol, persen, state tombol di batas), pintasan keyboard zoom. |
| `nav.js` | Aksi navbar: Home, Tambah Cerita, Information, Butuh bantuan; status `nav__item--active`; navbar bawah di mobile. |
| `hero.js` | Mengatur hero penuh/ringkas (`hero--compact`) berdasarkan posisi tampilan. |
| `notes.js` | Membuat elemen catatan, render, penempatan acak, rotasi acak, `[OPSIONAL]` drag catatan. |
| `editor.js` | `contenteditable`: bold, italic, list; sinkron status toolbar; paste teks polos; batas karakter. |
| `sanitizer.js` | Whitelist tag HTML, buang atribut, unwrap tag tak dikenal. |
| `uploader.js` | Input file + drag-drop, validasi tipe/ukuran, `FileReader`, preview, hapus. |
| `composer.js` | Orkestrasi: buka/tutup panel tulis, validasi, draf otomatis, buka pembayaran, publikasi. |
| `care.js` | Deteksi kata kunci sensitif di draf (lokal) dan tampilkan pesan peduli yang tidak memblokir. |
| `payment.js` | Modal pembayaran mockup, state machine, focus trap. |
| `pause.js` | Modal "Jeda napas" dengan panduan pernapasan. |
| `support.js` | Modal informasi bantuan. |
| `info.js` | Modal "Information": tentang, cara pakai, tarif, privasi, kontrol kanvas, tema aktif. |
| `toast.js` | Notifikasi singkat (`aria-live`). |
| `utils.js` | `randomBetween`, `seededRandom`, `generateId`, `clamp`, `formatRupiah`, `debounce`, `trapFocus`. |
| `main.js` | Entry point: inisialisasi semua modul berurutan. |

### 3.2 Urutan output `agy`
1. `index.html`
2. `assets/dot-grid.svg`
3. `css/main.css`, lalu semua `css/base/*`, lalu semua `css/blocks/*` (urutan sesuai 2.5)
4. `js/modules/theme.js`, `js/modules/config.js`, lalu modul lain sesuai 2.5, terakhir `js/main.js`

---

## 4. ATURAN DESAIN & UI (MENGIKUTI GAMBAR REFERENSI)

Gambar referensi: situs kesehatan mental dengan bingkai tepi berwarna hijau-abu gelap, kartu hero berujung membulat berlatar ilustrasi langit malam berbintang dan bukit berumput dengan pintu bercahaya, headline serif besar berwarna putih hangat di kiri atas, subteks sans-serif, tombol pil, navbar berupa tiga pil putih (logo, menu, CTA), dan kartu mint di kanan bawah. Tiru tata letak, warna, tipografi, dan suasananya. Karakter sticky note (kertas pastel, tulisan tangan, rotasi kecil acak) tetap dipertahankan hanya pada catatan.

### 4.1 DAFTAR LARANGAN KERAS
Salah satu dari ini muncul = output GAGAL:
- `backdrop-filter`, efek kaca/blur, panel tembus pandang berbingkai blur (glassmorphism). Tombol "Start Your Recovery" di referensi tampak tembus pandang; JANGAN tiru efek itu, pakai warna solid.
- `box-shadow` dengan blur radius > 0, atau bayangan lembut/berlapis. Satu-satunya bayangan yang diizinkan adalah offset solid tanpa blur pada catatan (`--shadow-note`).
- Semua gradien CSS: `linear-gradient`, `radial-gradient`, `conic-gradient` (termasuk untuk dotted grid dan untuk memperhalus latar). Seluruh nuansa gradasi hanya boleh berasal dari berkas gambar `assets/scene.jpg`.
- Warna neon atau terlalu jenuh, kontras hitam murni di atas putih murni, palet ungu-biru "AI generik", emoji sebagai ikon, ilustrasi 3D/blob.
- `opacity`/transparansi selain untuk tiga hal ini saja: (a) lapisan tint latar `scene__tint`, (b) lapisan dotted grid, (c) pelapis redup modal `modal__backdrop` (warna rata, tanpa blur).
- Animasi berkedip, bergetar, memantul (bounce), atau berulang tanpa henti selain panduan napas.
- Kalimat panjang atau pesan utama berhuruf kapital semua.
- Kata bernada menekan: "segera", "jangan sampai", "terakhir", hitung mundur.

DIIZINKAN (mengikuti referensi): pil (`border-radius: 999px`) untuk navbar dan tombol, sudut membulat `14px` pada kartu hero/stage, `16px` pada panel dan modal, `10px` pada catatan, `12px` pada kartu mint.

### 4.2 Bingkai tepi dan latar (INTI v3)

**Bingkai (`app` + `stage`):**
- `body.app` berlatar `var(--color-frame)` (hijau-abu gelap seperti tepi referensi). `padding: clamp(10px, 2.5vw, 40px)`. `overflow: hidden`; halaman tidak boleh bergulir.
- `stage` adalah kartu besar di dalam bingkai: `position: relative; height: calc(100dvh - 2 * padding); border-radius: 14px; overflow: hidden;`. Semua elemen (scene, kanvas, HUD) berada di dalam `stage`. Layout `stage` memakai CSS Grid/posisi absolut, margin dalam tidak simetris (kiri lebih lebar dari kanan, seperti referensi).

**Latar (`scene`), tiga lapis di dalam `stage`, urutan dari bawah:**
1. `scene__image`: `background-color: var(--color-scene-fallback); background-image: url("../../assets/scene.jpg"); background-size: cover; background-position: 72% 100%; background-repeat: no-repeat;`. Tulis `url()` LANGSUNG di `css/blocks/scene.css` (bukan lewat custom property) agar path relatif benar. Pada layar di bawah 720px gunakan `background-position: 68% 100%`. Jika berkas gambar tidak ada, warna fallback tetap tampil rapi.
2. `scene__tint`: lapisan warna rata `background-color: var(--color-scene-tint); opacity: var(--scene-tint-opacity);` (malam `0`, siang `0.7`). Ini cara membuat versi "siang" dari ilustrasi malam TANPA gradien.
3. `canvas__grid` (lihat 4.5): dotted grid tipis di atas scene.

Gambar latar DIAM terhadap bingkai (tidak ikut zoom/pan) agar suasana tetap tenang; hanya `canvas__world` (grid + catatan) yang bergerak.

**Hero (`hero`):** blok teks di kiri atas di bawah topbar, digeser ke kanan sekitar 6-8% lebar stage (asimetris). Isi:
- Headline serif (`--font-display`) berwarna `--color-hero-ink`: "Tempat menaruh keluh, tanpa dihakimi." `font-size: clamp(2.4rem, 5.2vw, 4.6rem); line-height: 1.05; font-weight: 500; max-width: 12ch` (memecah menjadi 2-3 baris seperti referensi).
- Subteks (`--font-ui`, 400, `1rem`, lebar maks 34ch): "Tulis ceritamu, tempelkan di papan, dan biarkan ia beristirahat di sini."
- Tombol pil `button--cta` "Tulis ceritamu" (solid biru `--color-cta`, teks putih, border `1px` putih) yang membuka composer.
- Tautan teks kecil di bawahnya: "Jeda napas satu menit" yang membuka modal jeda.
- `hero` memakai `pointer-events: none`; hanya tombol/tautan di dalamnya `pointer-events: auto` agar kanvas tetap bisa digeser lewat area hero.
- `hero--compact` (diatur `hero.js`): bila tampilan kanvas bergeser dari kondisi awal (skala != 1 atau |tx|, |ty| menyimpang > 40px dari posisi awal), subteks, tombol, dan tautan disembunyikan dan headline mengecil ke `1.6rem`. Transisi 300 ms. Tombol Home mengembalikan hero penuh.

**Empty state:** di tengah dunia kanvas, teks Cormorant italic `1.6rem` berwarna `--color-hero-ink`, miring `-1deg`: "Belum ada cerita di sini. Tidak apa-apa. Kamu boleh mulai kapan saja." Hilang setelah ada catatan pertama.

### 4.3 Tipografi (SAMA DENGAN REFERENSI)
- **Headline & logo:** serif humanis elegan. Google Fonts `Cormorant Garamond` bobot 500 dan 600, plus italic 500 (untuk logo). Fallback: `Georgia, "Times New Roman", serif`.
- **UI (navbar, tombol, subteks, kartu, modal):** `Poppins` bobot 400, 500, 600. Fallback: `"Helvetica Neue", Arial, sans-serif`.
- **Isi catatan:** tulisan tangan, `Caveat` bobot 500 dan 700. Fallback: `"Segoe Print", "Bradley Hand", cursive`. Ukuran `1.6rem`, `line-height: 1.35`.
- Variabel: `--font-display`, `--font-ui`, `--font-hand` di `variables.css` (mudah diganti).
- Satu `<link>` Google Fonts di `index.html` dengan `display=swap`, plus `preconnect`.
- Ukuran: navbar `0.8rem` (500), tombol `0.875rem` (500/600), teks modal `0.95rem`/`1.6` line-height. Huruf campuran (sentence/Title Case). Kapital hanya untuk label mikro maks 3 kata dengan `letter-spacing: 0.06em`.

### 4.4 Palet warna (`css/base/variables.css`)

Semua warna adalah CSS custom property. Dua set: malam (tampilan identik referensi) dan siang (`[data-theme="day"]`). Default `:root` = malam.

| Variabel | Malam | Siang |
|---|---|---|
| `--color-frame` | `#4B6262` | `#7D9892` |
| `--color-scene-fallback` | `#10213F` | `#BFD3D6` |
| `--color-scene-tint` | `#E6EEE8` | `#E6EEE8` |
| `--scene-tint-opacity` | `0` | `0.7` |
| `--color-hero-ink` | `#F6F3EC` | `#1B2A3A` |
| `--color-pill` | `#FFFFFF` | `#FFFFFF` |
| `--color-pill-ink` | `#1B2A3A` | `#1B2A3A` |
| `--color-pill-active` | `#E4EEEA` | `#E4EEEA` |
| `--color-cta` | `#3A5B86` | `#2F4E78` |
| `--color-cta-ink` | `#FFFFFF` | `#FFFFFF` |
| `--color-mint` | `#A8DAC4` | `#A8DAC4` |
| `--color-mint-ink` | `#1F3B3A` | `#1F3B3A` |
| `--color-panel` | `#172746` | `#FFFFFF` |
| `--color-panel-ink` | `#F6F3EC` | `#1B2A3A` |
| `--color-line` | `#2F4468` | `#D3DEDA` |
| `--color-overlay` | `#0B1730` | `#2B3A3A` |
| `--color-accent` | `#F2B84B` | `#F2B84B` |
| `--color-accent-ink` | `#1B2A3A` | `#1B2A3A` |
| `--color-grid-dot` | `#FFFFFF` | `#1B2A3A` |
| `--grid-opacity` | `0.14` | `0.10` |
| `--shadow-note` | `3px 3px 0 #0C1830` | `3px 3px 0 #8FA39E` |

Aksen amber (cahaya pintu di ilustrasi) dipakai hemat: outline fokus, penanda catatan baru, titik status.

Warna catatan (solid pastel hangat; teks catatan selalu `--color-note-ink: #2B2A28`):

| Variabel | Malam | Siang |
|---|---|---|
| `--note-butter` | `#D8C886` | `#F6E3A1` |
| `--note-rose` | `#D4A79F` | `#F2C1B8` |
| `--note-sky` | `#9DBBCB` | `#BFD9E6` |
| `--note-sage` | `#A9C3A2` | `#C6DDBF` |
| `--note-lilac` | `#BCB2CF` | `#D9CFE8` |

Variabel lain wajib: `--space-*` (skala tidak seragam: 4, 8, 16, 32, 64, 128px), `--radius-pill: 999px`, `--radius-stage: 14px`, `--radius-panel: 16px`, `--radius-card: 12px`, `--radius-note: 10px`, `--z-*`, `--ease-calm: cubic-bezier(0.22, 0.61, 0.36, 1)`.

Transisi tema: `transition: background-color 400ms var(--ease-calm), color 400ms var(--ease-calm), opacity 400ms var(--ease-calm);`. Nonaktif bila `prefers-reduced-motion: reduce`.

### 4.5 Dotted grid (TANPA GRADIEN)
- Titik dibuat dengan `assets/dot-grid.svg` (SVG 24x24, satu `<circle cx="12" cy="12" r="1.5" fill="currentColor">`) sebagai `mask-image` pada `canvas__grid` yang berlatar `var(--color-grid-dot)` dan `opacity: var(--grid-opacity)` (sangat tipis di atas ilustrasi).
- `canvas__grid` adalah anak `canvas__world` (ikut zoom/pan), ukuran sama dengan dunia kanvas.
- Saat zoom di bawah `0.5`, `canvas` mendapat modifier `canvas--overview` dan `canvas__grid` memakai `mask-size` dua kali lebih besar.

### 4.6 Topbar (meniru tiga pil referensi)

`topbar` berada di atas `stage`, grid tiga kolom `auto 1fr auto` dengan padding dalam `clamp(12px, 2.2vw, 28px)`; pil tengah ditempatkan agak ke kanan (asimetris), seperti referensi.

1. **`brand`** (pil putih kiri): logo SVG inline kecil (kotak kertas dengan lipatan sudut, garis `1.5px`, warna `--color-pill-ink`) + wordmark "Kertas Keluh" Cormorant Garamond italic 600, `1.15rem`. Padding `8px 18px`.
2. **`nav`** (pil putih tengah): tiga item `<button type="button">`:
   - **Home** (`data-js="nav-home"`): `resetView` beranimasi ke 100% dan pusat dunia, hero kembali penuh, tutup panel terbuka.
   - **Tambah Cerita** (`data-js="nav-add"`): membuka composer.
   - **Information** (`data-js="nav-info"`): membuka modal informasi.
   - Item aktif memakai `nav__item--active` (latar `--color-pill-active`, bentuk pil) dan `aria-current="page"` untuk Home saat tidak ada panel terbuka. Item "Tambah Cerita"/"Information" aktif selama panelnya terbuka. Hover: garis bawah `1px`. Jarak antar item `8px`, padding item `8px 18px`.
3. **`button--pill`** (pil putih kanan, mirip "Call Now for Free"): "Butuh bantuan?" (`data-js="nav-support"`) membuka modal bantuan. Selalu terlihat di semua viewport.

Mobile (di bawah 720px): `brand` dan tombol bantuan mengecil (bantuan menjadi "Bantuan"); `nav` pindah menjadi bilah pil putih menempel di bawah `stage` selebar penuh dengan tiga item sama lebar, target sentuh minimal 44px.

### 4.7 Kartu mint (`ticker`)
Meniru kartu testimoni kanan bawah referensi: kartu `--color-mint`, teks `--color-mint-ink`, radius `12px`, tanpa border, tanpa bayangan, padding `16px 20px`, lebar maks `260px`, kanan bawah `stage`.
- Baris 1 (Poppins 400, `0.85rem`): "42 cerita sudah ditempel di papan ini."
- Baris 2 (Poppins 600, `0.85rem`): "Anonim. Rp 2.000 per cerita."
- Di kanan bawah kartu, lencana kecil melingkar bergaris `1.5px` bertuliskan "Tanpa nama" (dua baris, `0.6rem`), menggantikan lencana daun di referensi.
- Disembunyikan di bawah 720px (jumlah cerita tampil di modal Information).

### 4.8 Gerak (motion)
- Semua gerak lambat dan lembut: 250-400 ms, easing `--ease-calm`. Tidak ada animasi berulang kecuali panduan napas.
- Catatan baru muncul dengan fade + naik 8px dalam 300 ms.
- `prefers-reduced-motion: reduce`: matikan semua transisi dan animasi (zoom animasi, fade, tint, panduan napas hanya berupa teks).

### 4.9 Bank copywriting (WAJIB dipakai persis)

| Konteks | Teks |
|---|---|
| Navbar | Home / Tambah Cerita / Information |
| Tombol bantuan | Butuh bantuan? |
| Judul composer | Tulis yang kamu rasakan |
| Placeholder editor | Tulis apa saja yang sedang kamu rasakan. Tidak ada yang salah di sini. |
| Helper uploader | Kamu boleh menambahkan satu gambar. Hindari wajah atau data pribadi orang lain. |
| Draf tersimpan | Draf disimpan. Kamu bisa lanjut kapan saja. |
| Tombol lanjut | Lanjut ke pembayaran |
| Tombol batal | Tutup dulu |
| Label modal bayar | Simulasi. Tidak ada uang sungguhan. |
| Sukses bayar | Berhasil. Ceritamu sudah ditempel. |
| Gagal bayar | Pembayaran belum berhasil. Tidak apa-apa, coba lagi kapan pun kamu siap. |
| Fail terlalu besar | Fail terlalu besar. Maksimal 2 MB. |
| Format salah | Format belum didukung. Gunakan PNG, JPG, atau WebP. |
| Storage penuh | Penyimpanan penuh. Coba kurangi ukuran gambar. |
| Tombol fit zoom | Lihat semua |
| Pesan peduli | Terima kasih sudah menuliskannya. Kalau terasa terlalu berat untuk ditanggung sendiri, kamu boleh bicara dengan seseorang. |

### 4.10 Responsif
Di bawah 720px: bingkai `padding: 8px`; `nav` menjadi bilah bawah; `zoom` pindah ke kiri bawah tepat di atas bilah nav; `ticker` disembunyikan; composer menjadi panel layar penuh; headline hero `clamp(2rem, 9vw, 2.8rem)`; tombol hero selebar penuh.

---

## 5. FUNGSI INTI

### 5.1 Tema siang/malam dinamis (jam lokal)
- `theme.js` membaca `new Date().getHours()`. Jam 06:00-17:59 = `day`, selain itu `night`.
- Set `document.documentElement.dataset.theme = 'day' | 'night'`. Variabel `:root` (default) = malam; siang di `[data-theme="day"]`.
- Seluruh perubahan tampilan (termasuk tint latar dan warna hero) HANYA lewat CSS variables. DILARANG mengubah warna lewat JS langsung.
- Periksa ulang tiap 60 detik dan saat `visibilitychange`; terapkan hanya bila tema berubah.
- Tema tidak bisa diubah manual. Status tema aktif ditampilkan di modal Information.

### 5.2 Model data catatan

```js
// Note
{
  id: string,
  html: string,          // sudah disanitasi
  image: string | null,  // data URL
  color: 'butter' | 'rose' | 'sky' | 'sage' | 'lilac',
  x: number,             // koordinat dunia (px)
  y: number,
  rotation: number,      // derajat, -3 s.d. +3
  createdAt: number,     // epoch ms
  paid: true
}
```

Hanya catatan yang sudah melewati pembayaran (mockup) boleh disimpan. Key: `kertaskeluh:notes:v1`.

### 5.3 Rich Text Editor (`contenteditable`)
- Area tulis: `<div class="editor__field" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Tulis ceritamu" data-js="editor-field" data-placeholder="...">`.
- Toolbar (`toolbar`): pil-pil kecil **B**, *I*, Daftar. `<button type="button">`, `aria-pressed`, modifier `toolbar__button--active`.
- Perintah memakai `document.execCommand('bold' | 'italic' | 'insertUnorderedList')` lewat helper dengan pengecekan keberadaan fungsi. Status tombol via `document.queryCommandState` pada `selectionchange`/`keyup`/`mouseup`.
- Pintasan: `Ctrl/Cmd+B`, `Ctrl/Cmd+I`.
- Paste: cegah HTML, sisipkan `text/plain` dengan `insertText`.
- Batas 500 karakter teks (`innerText`), penghitung "123 / 500". Blokir input baru saat penuh, kecuali hapus.
- Placeholder via CSS `:empty::before { content: attr(data-placeholder); }`.
- Sanitasi (`sanitizer.js`): whitelist `B, STRONG, I, EM, UL, OL, LI, BR, DIV, P`; atribut dibuang; tag lain di-unwrap. Dijalankan sebelum pembayaran dan sebelum render dari storage.
- Draf valid bila ada teks ATAU gambar.

### 5.4 Unggah fail (gambar)
- `uploader`: zona drop bergaris putus-putus `1.5px dashed var(--color-line)`, radius `12px`, + tombol "Pilih fail" yang memicu `<input type="file" accept="image/png,image/jpeg,image/webp" hidden data-js="uploader-input">`.
- Drag-and-drop ke zona dan ke composer; modifier `uploader--dragover`.
- Validasi: MIME png/jpeg/webp, maksimum **2 MB**; pesan error dari bank copy via toast.
- `FileReader.readAsDataURL`; preview maks tinggi 160px, `object-fit: cover`, radius `8px`, tombol "Hapus gambar".
- Satu gambar per catatan; unggah ulang menggantikan.

### 5.5 Composer (panel tulis) dan draf otomatis
- `composer`: panel di sisi kiri `stage` (desktop) / layar penuh (mobile), latar `--color-panel`, teks `--color-panel-ink`, border `1.5px solid var(--color-line)`, radius `16px`, tanpa bayangan. Dibuka dari hero, dari "Tambah Cerita".
- Isi berurutan: judul (Cormorant Garamond 600, `1.6rem`), pilihan warna (lima lingkaran/kotak, `role="radiogroup"`, modifier `composer__swatch--selected`, panah kiri/kanan), toolbar, editor, uploader, penghitung, pesan peduli (`composer__care`, tersembunyi default), ringkasan harga "Rp 2.000", tombol "Lanjut ke pembayaran" (pil solid aksen, `disabled` selama draf tidak valid) dan "Tutup dulu" (pil outline).
- **Draf otomatis:** simpan `{html, image, color}` ke `kertaskeluh:draft:v1` (debounce 500 ms). Dipulihkan saat panel dibuka kembali; dihapus setelah publikasi sukses. Tulisan pengguna TIDAK boleh hilang hanya karena panel ditutup.
- "Tutup dulu" dan ESC menutup panel TANPA dialog konfirmasi, lalu toast "Draf disimpan..." bila draf tidak kosong.

### 5.6 Pesan peduli (`care.js`)
- Pantau teks draf (debounce 600 ms). Bila cocok dengan salah satu frasa di `CARE_KEYWORDS` (huruf kecil, `includes`), tampilkan `composer__care` (`role="status"`) berisi pesan peduli dan tombol "Lihat kontak bantuan" yang membuka modal bantuan.
- Nilai awal: `['bunuh diri', 'mengakhiri hidup', 'ingin mati', 'menyakiti diri', 'self harm']`.
- Aturan keras: pesan TIDAK memblokir, TIDAK mengubah tombol, TIDAK dikirim atau disimpan ke mana pun, dapat ditutup, dan tidak muncul berulang setelah ditutup pada draf yang sama.

### 5.7 ZOOM & PAN KANVAS (WAJIB)

**Konstanta (`config.js`):**
```js
export const WORLD = { width: 6000, height: 4000 };
export const ZOOM = {
  min: 0.25,
  max: 2,
  initial: 1,
  buttonFactor: 1.2,    // pengali per klik +/-
  wheelSensitivity: 0.0015,
  panKeyStep: 80,       // px per tekan panah
  fitPadding: 120,      // px dunia di sekeliling catatan saat "Lihat semua"
  animationMs: 280
};
```

**State & transformasi:**
- State `{ scale, tx, ty }` (tx/ty dalam piksel layar, titik asal kiri-atas dunia).
- `canvas__world` memakai `transform-origin: 0 0; transform: translate(var(--view-x), var(--view-y)) scale(var(--view-scale));`. JS hanya memperbarui tiga custom property itu. `will-change: transform` hanya pada `canvas__world`.
- `canvas` mengisi seluruh `stage` (di atas `scene`, di bawah HUD). `scene` TIDAK ikut ditransformasi.

**Zoom berpusat pada titik anchor (titik di bawah kursor/jari tidak boleh bergeser):**
```js
// anchor (ax, ay) dalam koordinat viewport relatif terhadap elemen canvas
const ratio = newScale / oldScale;
tx = ax - (ax - tx) * ratio;
ty = ay - (ay - ty) * ratio;
scale = newScale;
```
Setelah itu jalankan `clampView()`.

**Clamp:**
- `scale` dijepit ke `[ZOOM.min, ZOOM.max]`.
- Per sumbu: bila `ukuranDunia * scale` lebih besar dari viewport, `tx ∈ [viewport - ukuranDunia*scale, 0]`; bila lebih kecil, tengahkan dunia pada sumbu itu.

**Cara input (SEMUA wajib):**
1. **Tombol** panel `zoom`: perbesar/perkecil memakai `zoomAt` di tengah viewport dengan `ZOOM.buttonFactor`, beranimasi.
2. **Ctrl/Cmd + roda** dan **pinch trackpad** (event `wheel` dengan `ctrlKey === true`): zoom di posisi kursor, `newScale = scale * Math.exp(-deltaY * ZOOM.wheelSensitivity)`. Panggil `preventDefault()` agar zoom halaman browser tidak terjadi. Listener `wheel` wajib `{ passive: false }`.
3. **Roda biasa**: geser kanvas (`deltaX`/`deltaY`); `Shift + roda` memetakan `deltaY` ke horizontal.
4. **Pinch layar sentuh**: dua pointer aktif; rasio jarak untuk skala, titik tengah sebagai anchor, perpindahan titik tengah sebagai pan. `touch-action: none` pada `canvas`.
5. **Keyboard** (hanya bila fokus tidak di input/`contenteditable` dan tidak ada modal/composer terbuka): `+` atau `=` perbesar, `-` perkecil, `0` kembali 100% dan ke tengah, `Shift+1` "Lihat semua", panah menggeser sebesar `ZOOM.panKeyStep`. `canvas` memiliki `tabindex="0"`, `role="region"`, `aria-label="Kanvas cerita. Gunakan tanda panah untuk menggeser, plus dan minus untuk zoom."`.
6. **Double-click** area kosong kanvas: zoom in satu langkah di titik klik `[OPSIONAL]`.

**Pan:** drag pada area kosong (pointer events, satu pointer); perpindahan dalam piksel layar. Kursor `grab`/`grabbing` (modifier `canvas--panning`).

**Animasi zoom:**
- Hanya untuk tombol, Home/reset, dan "Lihat semua": tambahkan modifier `canvas__world--animated` (`transition: transform 280ms var(--ease-calm)`) lalu lepas setelah `transitionend`/`ZOOM.animationMs`.
- TIDAK ada transisi saat wheel, pinch, atau drag.
- Hormati `prefers-reduced-motion`.

**Panel kontrol (`zoom`):**
- Satu pil putih (gaya sama dengan navbar), kiri bawah `stage`, digeser dari tepi (asimetris dengan kartu mint). Isi berurutan horizontal: `−` (`zoom__button--out`), persen (`zoom__readout`, juga tombol: klik = kembali 100% dan ke tengah), `+` (`zoom__button--in`), pemisah tipis, "Lihat semua" (`zoom__button--fit`).
- `aria-label`: "Perkecil", "Perbesar", "Kembali ke 100 persen", "Lihat semua cerita".
- Tombol `−` dan `+` mendapat atribut `disabled` dan modifier `zoom__button--disabled` saat di batas min/max.
- `zoom__readout` menampilkan `Math.round(scale * 100) + '%'`, `aria-live="polite"`, pembaruan didebounce 400 ms.

**"Lihat semua" (`fitToNotes`):** hitung kotak batas semua catatan (+ `ZOOM.fitPadding`), skala = `clamp(min(viewportW / kotakW, viewportH / kotakH), ZOOM.min, 1)`, tengahkan kotak, animasi aktif. Tanpa catatan: sama dengan reset (100%, pusat dunia).

**Mode ringkasan (`canvas--overview`):** saat `scale < 0.5`: `note-card__stamp` disembunyikan, grid lebih jarang (4.5).

**Persistensi tampilan:** simpan `{scale, tx, ty}` ke `kertaskeluh:view:v1` (debounce 300 ms). Muat saat start; bila tidak valid, pakai tampilan awal (skala 1, pusat dunia).

**Dampak pada fitur lain (WAJIB konsisten):**
- Penempatan catatan baru memakai `getVisibleWorldRect()` (`(sx - tx) / scale`), sehingga selalu muncul di area yang sedang dilihat pada skala berapa pun.
- Setelah publikasi, bila catatan baru di luar area terlihat, `centerOn(x, y)` (animasi; bila skala < 0.5 naikkan ke 0.8).
- `hero.js` berlangganan perubahan tampilan untuk mengatur `hero--compact`.
- Drag catatan `[OPSIONAL]`: perpindahan dunia = perpindahan layar / `scale`.

### 5.8 Kartu catatan (`note-card`)
Elemen: `note-card`, `note-card__image`, `note-card__body`, `note-card__stamp`.
- Lebar tetap 280px, tinggi mengikuti isi (maks 420px, overflow tersembunyi), tanpa border, `border-radius: 10px`, `box-shadow: var(--shadow-note)` (offset solid tanpa blur), rotasi acak `-3deg` s.d. `+3deg` lewat `--note-rotation`.
- `note-card__stamp`: label kecil Poppins `0.65rem` berisi tanggal ("2 Nov 2026") di pojok, miring berlawanan arah dengan kartu.
- Teks memakai `--font-hand`. Gaya `ul`/`li`/`b`/`i` di dalam `note-card__body` ditulis lewat selector turunan satu level dalam block yang sama (pengecualian untuk konten rich-text).
- Warna lewat modifier: `note-card--butter`, `--rose`, `--sky`, `--sage`, `--lilac`.
- Gambar di catatan: `note-card__image` di atas teks, radius `6px`.
- Modifier `note-card--fresh` selama 1,5 detik setelah terbit: ring `2px` berwarna aksen (tanpa kedip).

### 5.9 Modal pembayaran Rp 2.000 (MOCKUP)
`modal` (dengan `modal__backdrop` warna rata `--color-overlay`, `opacity: 0.72`, TANPA blur) membungkus `payment` (panel `--color-panel`, radius `16px`).

Konten `payment`:
1. Label kecil mint: "Simulasi. Tidak ada uang sungguhan."
2. Ringkasan: "1 cerita" dan total besar `Rp 2.000` (Cormorant Garamond 600, `2.4rem`, `formatRupiah`).
3. Metode (radio, tampilan saja): QRIS, E-Wallet, Transfer Bank. Default QRIS.
4. Untuk QRIS: kotak persegi berisi pola kotak statis (SVG inline sederhana, bukan QR valid).
5. Tombol pil "Bayar Rp 2.000" (aksen) dan "Kembali ke draf" (outline).

State machine `payment.js`: `idle -> processing -> success | error`.
- `processing`: tombol dikunci, teks "Sebentar ya...", 1500 ms tiruan.
- Hasil mockup: selalu `success` (`SIMULATE_FAILURE_RATE = 0` di `config.js`).
- `success`: tampilkan "Berhasil. Ceritamu sudah ditempel." 900 ms, tutup modal, panggil callback publikasi.
- `error`: pesan lembut dan tombol "Coba lagi".
- "Kembali ke draf" menutup modal tanpa menghapus draf.
- Cerita TIDAK boleh terbit lewat jalur selain callback sukses pembayaran.

Aksesibilitas semua modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, ESC menutup (kecuali saat `processing`), fokus kembali ke pemicu, scroll latar dikunci.

### 5.10 Jeda napas (`pause.js`)
- Dibuka dari tautan hero "Jeda napas satu menit" dan dari modal Information. Modal `pause`: judul "Jeda sebentar", teks "Tarik napas pelan. Ikuti lingkaran.", `pause__circle` (lingkaran datar `--note-sage`, tanpa border tebal), label fase `pause__label` (`aria-live="polite"`), tombol "Selesai".
- `BREATHING = { inhaleMs: 4000, holdMs: 4000, exhaleMs: 6000, cycles: 5 }` di `config.js`.
- Fase: "Tarik napas..." (skala 1.4), "Tahan..." (tetap), "Hembuskan pelan..." (kembali 1.0). Modifier `pause__circle--inhale|hold|exhale`, durasi transisi lewat `--phase-ms`.
- Setelah semua siklus: "Kamu sudah melakukannya dengan baik." dan lingkaran berhenti.
- `prefers-reduced-motion`: tanpa animasi skala, hanya label teks yang berganti.
- Tanpa suara, tanpa pewaktu yang menekan, tanpa skor.

### 5.11 Modal bantuan (`support.js`)
- Dibuka dari pil "Butuh bantuan?" di topbar dan dari pesan peduli. Akses WAJIB selalu tersedia di semua viewport.
- Isi dari `SUPPORT` di `config.js`:
```js
export const SUPPORT = {
  serviceName: 'Healing119 (Kementerian Kesehatan RI)',
  phoneText: 'Hubungi 119, lalu pilih ekstensi 8',
  telHref: 'tel:119',
  siteLabel: 'healing119.id',
  siteHref: 'https://healing119.id',
  emergencyText: 'Dalam keadaan darurat medis, hubungi 119.'
};
```
- Teks pembuka: "Kamu tidak sendirian. Kalau kamu merasa tidak aman atau ingin menyakiti diri sendiri, bicaralah dengan seseorang sekarang."
- Teks penutup: "Kertas Keluh bukan layanan konseling dan tidak menggantikan bantuan tenaga kesehatan jiwa."
- Tautan eksternal: `target="_blank" rel="noopener noreferrer"`.
- Komentar di `config.js`: `// Periksa ulang kontak ini sebelum rilis; layanan dapat berubah.`

### 5.12 Modal Information (`info.js`)
Dibuka dari item navbar "Information". Panel `info` (scroll internal bila panjang), judul Cormorant Garamond 600 `2rem`. Bagian berurutan, masing-masing dengan subjudul Poppins 600:
1. **Tentang:** "Kertas Keluh adalah papan bersama untuk menempelkan cerita dan keluh, tanpa nama dan tanpa dihakimi."
2. **Cara menggunakan** (daftar bernomor): "Tekan Tambah Cerita." / "Tulis ceritamu. Tambahkan satu gambar jika kamu mau." / "Lanjut ke pembayaran Rp 2.000 (simulasi)." / "Ceritamu ditempel di papan."
3. **Tarif:** "Rp 2.000 per cerita. Saat ini hanya simulasi, tidak ada uang sungguhan."
4. **Privasi:** "Semua cerita tersimpan di perangkat ini saja. Tidak ada akun dan tidak ada nama."
5. **Kontrol kanvas** (tabel dua kolom): Perbesar/perkecil: tombol + dan −, Ctrl/Cmd + roda, cubit dua jari. Geser: seret, roda mouse, tombol panah. Kembali ke awal: tombol Home atau tekan 0. Lihat semua: tombol "Lihat semua" atau Shift+1.
6. **Tema:** "Tema mengikuti jam di perangkatmu. Sekarang: Malam/Siang." (dinamis dari `data-theme`) ditambah jumlah cerita saat ini.
7. **Jeda dan bantuan:** dua tombol pil "Coba jeda napas" (membuka `pause`) dan "Kontak bantuan" (membuka `support`).
8. Penutup kecil: "Kertas Keluh bukan layanan konseling."

### 5.13 Toast
`toast`: kartu solid `--color-panel` di kanan atas (di bawah topbar), radius `12px`, border `1.5px`, miring `0.5deg`, hilang otomatis setelah 4 detik, `role="status"` `aria-live="polite"`. `toast--error` memakai border `--color-accent`. Pesan singkat dan lembut sesuai 4.9.

### 5.14 Persistensi
- Muat catatan, tampilan, dan draf saat start; render ulang catatan; perbarui kartu mint dan modal Information.
- Simpan catatan setiap kali bertambah.
- Quota penuh: batalkan simpan, tampilkan toast "Penyimpanan penuh. Coba kurangi ukuran gambar."

---

## 6. SPESIFIKASI `index.html`

- `<html lang="id" data-theme="night">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Judul: "Kertas Keluh | Tempat Menaruh Keluh".
- Urutan `<head>`: meta, preconnect + link Google Fonts (Cormorant Garamond, Poppins, Caveat), `<link rel="preload" as="image" href="assets/scene.jpg">`, `<script src="js/modules/theme.js"></script>`, `<link rel="stylesheet" href="css/main.css">`.
- `<body class="app">`:
  - `<div class="stage">` berisi, berurutan: `scene` (`scene__image`, `scene__tint`), `canvas` (berisi `canvas__world` yang membungkus `canvas__grid` dan `canvas__notes`, plus `canvas__empty`), `hero`, `topbar` (`brand`, `nav`, tombol bantuan), `zoom`, `ticker`.
  - Di luar `stage` namun dalam body: `composer`, `modal` (kontainer kosong, diisi `payment`/`pause`/`support`/`info`), `toast`.
- Akhir body: `<script type="module" src="js/main.js"></script>`.
- Elemen semantik (`header`, `nav`, `main`, `aside`, `section`, `button`). Semua kontrol interaktif memakai `<button>` atau `<input>` asli.

`css/main.css` hanya berisi `@import` berurutan: variables, reset, typography, lalu semua block sesuai 2.5.

---

## 7. AKSESIBILITAS & KUALITAS

- Kontras teks minimal WCAG AA pada kedua tema; jangan ubah nilai palet 4.4 tanpa menghitung ulang. Teks di atas ilustrasi (hero) wajib memenuhi AA pada kedua tema.
- `:focus-visible`: `outline: 3px solid var(--color-accent); outline-offset: 2px;` pada semua kontrol.
- Semua tombol ikon punya `aria-label`.
- Dukungan keyboard penuh: navbar, composer, toolbar, pemilih warna, semua modal, panel zoom, dan kanvas.
- Hormati `prefers-reduced-motion: reduce` di semua animasi.
- Target sentuh minimal 44x44 px pada layar sentuh.
- Tidak ada error di console pada alur normal (termasuk bila `assets/scene.jpg` belum ada). Tidak ada kode mati, variabel tak terpakai, atau `console.log` tersisa.

---

## 8. CHECKLIST PENERIMAAN (agy wajib memverifikasi secara internal sebelum mengeluarkan kode)

- [ ] Output hanya blok kode, tanpa teks di luar blok; struktur berkas persis sesuai 2.5, urutan sesuai 3.2; tidak ada gambar yang dibuat atau di-encode.
- [ ] Tidak ada `<style>`, `style=""` (selain custom property), `onclick`, atau logika di HTML.
- [ ] Semua class mengikuti BEM, tanpa class utilitas, tanpa ID untuk styling, tanpa `!important`.
- [ ] Tidak ada gradien CSS, blur, `backdrop-filter`, atau bayangan dengan blur; transparansi hanya pada tint latar, grid, dan backdrop modal.
- [ ] Bingkai tepi hijau-abu gelap, `stage` membulat 14px, latar `assets/scene.jpg` (`cover`, posisi kanan-bawah) dengan fallback warna; tint siang tanpa gradien.
- [ ] Font: Cormorant Garamond (headline/logo), Poppins (UI), Caveat (isi catatan).
- [ ] Topbar tiga pil: brand, nav (Home, Tambah Cerita, Information), "Butuh bantuan?"; nav bawah di mobile.
- [ ] Hero: headline serif, subteks, tombol pil, tautan jeda napas; berubah ke `hero--compact` saat tampilan bergeser; Home mengembalikan hero penuh.
- [ ] Kartu mint kanan bawah menampilkan jumlah cerita.
- [ ] Zoom: batas 25%-200%, tombol +/−, persen yang bisa diklik (reset), "Lihat semua"; Ctrl/Cmd+roda dan pinch trackpad berpusat di kursor; pinch layar sentuh; pintasan `+`, `-`, `0`, `Shift+1`, panah.
- [ ] Zoom: titik di bawah anchor tidak bergeser; clamp bekerja; animasi hanya untuk tombol/Home/fit, bukan wheel/pinch/drag; scene tidak ikut zoom, grid dan catatan ikut.
- [ ] Penempatan catatan baru benar pada semua level zoom; tampilan tersimpan dan dipulihkan.
- [ ] Tema siang/malam dari jam lokal, hanya lewat CSS variables, diperbarui tiap menit.
- [ ] Editor `contenteditable` mendukung bold, italic, list; paste teks polos; sanitasi aktif.
- [ ] Unggah fail tervalidasi (tipe, 2 MB), preview, hapus, drag-drop.
- [ ] Draf otomatis tersimpan dan dipulihkan; menutup composer tidak menghilangkan tulisan.
- [ ] Cerita hanya terbit setelah modal pembayaran Rp 2.000 mockup sukses.
- [ ] Modal Information lengkap (8 bagian), jeda napas berfungsi (4-4-6, 5 siklus), modal bantuan selalu terjangkau.
- [ ] Pesan peduli tidak memblokir, tidak menyimpan, tidak mengirim data.
- [ ] Semua modal: focus trap, ESC, pengembalian fokus. Responsif di bawah 720px.

---

## 9. PERINTAH EKSEKUSI

Bangun seluruh proyek "Kertas Keluh" sekarang sesuai blueprint ini. Ingat Bagian 0: keluarkan HANYA blok kode, satu per berkas, berurutan, tanpa pengantar, narasi, atau penutup.
