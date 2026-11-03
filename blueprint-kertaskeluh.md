# BLUEPRINT: KERTAS KELUH

> Dokumen instruksi untuk CLI AI coding tool **agy**.
> Baca SELURUH dokumen sebelum menulis satu baris kode pun. Semua aturan bersifat MUTLAK kecuali ditandai `[OPSIONAL]`.

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
5. Keluarkan semua file dalam SATU respons, berurutan sesuai Bagian 3.2 (urutan output).
6. Komentar boleh ada DI DALAM kode (ringkas, bahasa Indonesia) hanya jika menjelaskan keputusan non-obvious. Dilarang komentar dekoratif atau basa-basi.
7. Jika ada ambiguitas, ambil keputusan paling konservatif sesuai blueprint ini. DILARANG bertanya balik.

---

## 1. RINGKASAN PRODUK

**Nama:** Kertas Keluh
**Konsep:** Papan kanvas lebar interaktif (mirip FigJam/Miro) tempat pengguna menempelkan catatan curhat berbentuk sticky note. Isi catatan dapat berupa teks rich-format (bold, italic, list) dan/atau satu gambar.
**Monetisasi:** Rp 2.000 per catatan. Catatan hanya terbit di kanvas setelah melewati modal pembayaran (MOCKUP, tanpa gateway sungguhan).
**Bahasa antarmuka:** Indonesia.
**Nada copywriting:** Pendek, jujur, sedikit sinis, tidak sok puitis. Huruf kapital untuk label antarmuka.
**Tanpa backend.** Seluruh state disimpan di `localStorage`.

---

## 2. ATURAN ARSITEKTUR (WAJIB)

### 2.1 Pemisahan berkas
- HTML, CSS, dan JS WAJIB berada di berkas terpisah. DILARANG: `<style>` blok, atribut `style="..."` (kecuali custom property dinamis, lihat 2.4), handler inline (`onclick=...`), dan `<script>` berisi logika di dalam HTML.
- Satu-satunya pengecualian: `<script src="js/modules/theme.js"></script>` di `<head>` TANPA `defer`/`module` agar tema terpasang sebelum render pertama (mencegah kilatan tema salah).

### 2.2 Teknologi
- HTML5 semantik. CSS vanilla murni (tanpa preprocessor, tanpa Tailwind/Bootstrap/framework apa pun). JS vanilla ES Modules (`type="module"`).
- DILARANG: npm package, bundler, CDN library JS/CSS, jQuery, framework UI, ikon dari library. Satu-satunya sumber eksternal yang diizinkan adalah Google Fonts (lihat 4.3), dengan fallback stack lengkap.
- DILARANG emoji sebagai ikon. Ikon dibuat dari karakter teks sederhana (`+`, `×`, `B`, `I`) atau SVG inline minimal bergaris tegas.

### 2.3 Penamaan class: BEM STRIK
- Format: `block`, `block__element`, `block--modifier`, `block__element--modifier`.
- Huruf kecil, kata dipisah tanda hubung (`kebab-case`). Contoh: `note-card__body`, `note-card--yellow`.
- DILARANG: elemen bersarang (`block__el__el`), selector tag (kecuali di `reset.css`), selector ID untuk styling, selector turunan lebih dari satu level yang melewati batas block, `!important`, class utilitas (`.mt-4`, `.flex`), dan class berbasis state tanpa block (`.active`, `.is-open`). State dinyatakan lewat modifier: `modal--open`, `toolbar__button--active`.
- Hook JavaScript memakai atribut `data-js="nama-hook"`, BUKAN class. Class hanya untuk styling.
- Setiap block memiliki berkas CSS sendiri bernama sesuai block-nya.

### 2.4 Custom property dinamis
Nilai acak per elemen (rotasi, posisi) diberikan lewat custom property yang diset JS memakai `element.style.setProperty('--note-rotation', '-3.2deg')`. Hanya cara ini yang boleh menyentuh `style`. CSS yang membaca: `transform: rotate(var(--note-rotation));`.

### 2.5 Struktur direktori (WAJIB persis)

```
kertas-keluh/
├── index.html
├── assets/
│   └── dot-grid.svg
├── css/
│   ├── main.css                 (hanya @import berurutan)
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── typography.css
│   └── blocks/
│       ├── app.css
│       ├── masthead.css
│       ├── rail.css
│       ├── canvas.css
│       ├── note-card.css
│       ├── composer.css
│       ├── toolbar.css
│       ├── editor.css
│       ├── uploader.css
│       ├── modal.css
│       ├── payment.css
│       ├── ticker.css
│       ├── button.css
│       └── toast.css
└── js/
    ├── main.js
    └── modules/
        ├── theme.js
        ├── storage.js
        ├── canvas.js
        ├── notes.js
        ├── editor.js
        ├── sanitizer.js
        ├── uploader.js
        ├── composer.js
        ├── payment.js
        ├── toast.js
        └── utils.js
```

### 2.6 Standar kode JS
- Satu modul = satu tanggung jawab. Ekspor fungsi bernama (named export), tanpa variabel global.
- `const`/`let` saja, tanpa `var`. Fungsi kecil, nama deskriptif bahasa Inggris, komentar bahasa Indonesia.
- Semua akses `localStorage` dibungkus `try/catch` dan harus tetap berjalan bila storage kosong atau penuh (tampilkan toast error saat quota terlampaui).
- Event listener dipasang lewat `data-js` hook. Gunakan event delegation bila elemen dibuat dinamis.
- DILARANG `innerHTML` dengan data pengguna yang belum melewati `sanitizer.js`.

---

## 3. RENCANA BERKAS

### 3.1 Tanggung jawab tiap modul JS

| Modul | Tanggung jawab |
|---|---|
| `theme.js` | Menentukan tema dari jam lokal, set `data-theme` pada `<html>`, perbarui tiap menit. Dimuat sinkron di `<head>`. Tanpa `import`/`export` (script klasik). |
| `storage.js` | `loadNotes()`, `saveNotes(notes)`. Key: `kertaskeluh:notes:v1`. Aman terhadap JSON rusak dan quota penuh. |
| `canvas.js` | Pan kanvas (drag + wheel + touch), batas area, konversi koordinat layar ke koordinat kanvas, pusat tampilan awal. |
| `notes.js` | Membuat elemen catatan, render semua catatan, penempatan acak tanpa tumpang tindih berlebihan, rotasi acak, drag catatan `[OPSIONAL]`. |
| `editor.js` | Logika `contenteditable`: bold, italic, daftar; sinkronisasi status tombol toolbar; paste sebagai teks polos; batas karakter. |
| `sanitizer.js` | Whitelist tag HTML, buang atribut, buang tag tak dikenal. |
| `uploader.js` | Input file + drag-drop, validasi tipe/ukuran, baca `FileReader`, preview, hapus gambar. |
| `composer.js` | Orkestrasi alur: buka panel tulis, validasi draf, buka modal bayar, publikasi. |
| `payment.js` | Modal pembayaran mockup, state machine pembayaran, focus trap. |
| `toast.js` | Notifikasi singkat (`aria-live`). |
| `utils.js` | `randomBetween`, `seededRandom`, `generateId`, `clamp`, `formatRupiah`. |
| `main.js` | Entry point: inisialisasi semua modul berurutan. |

### 3.2 Urutan output `agy`
1. `index.html`
2. `assets/dot-grid.svg`
3. `css/main.css`, lalu semua `css/base/*`, lalu semua `css/blocks/*` (urutan sesuai 2.5)
4. `js/modules/theme.js`, lalu modul lain sesuai tabel 3.1, terakhir `js/main.js`

---

## 4. ATURAN DESAIN & UI (BRUTALIST / EDITORIAL)

### 4.1 DAFTAR LARANGAN KERAS
Salah satu dari ini muncul = output GAGAL:
- `backdrop-filter`, efek kaca/blur (glassmorphism)
- `box-shadow` dengan blur radius > 0, bayangan lembut/berlapis
- Semua gradien: `linear-gradient`, `radial-gradient`, `conic-gradient` (termasuk untuk dotted grid, lihat 4.5)
- `border-radius` > 0 (semua sudut tajam). Satu-satunya pengecualian: indikator status bulat 8px.
- Palet ungu-biru "AI generik", kartu putih membulat, tombol pil, ikon emoji, ilustrasi 3D/blob
- `opacity` transparan untuk membuat efek "lembut" pada panel. Warna solid saja.
- Animasi berlebihan (bounce, float, parallax, shimmer)

### 4.2 Bahasa visual
- **Asimetri grid:** Layout HUD memakai CSS Grid dengan kolom tidak seimbang (contoh: `grid-template-columns: 1fr 3fr 8fr`). Elemen sengaja menempel ke tepi, terpotong sebagian, atau digeser di luar sumbu.
- **Ruang negatif ekstrem:** Kanvas dibiarkan lapang. HUD seminimal mungkin. Jarak antar elemen besar dan tidak seragam.
- **Rotasi acak:** Setiap catatan memiliki rotasi acak antara `-6deg` dan `+6deg`, disimpan di data catatan agar stabil saat reload. Label/stiker HUD tertentu diberi rotasi tetap tidak simetris (misal `-2deg`, `1.5deg`).
- **Garis tegas:** Border solid `3px` warna tinta pada semua panel, tombol, catatan. Tanpa border tipis 1px.
- **Bayangan keras (diizinkan):** hanya offset solid tanpa blur, contoh `box-shadow: 6px 6px 0 var(--color-ink);`.
- **Skala tipografi ekstrem:** Judul masthead raksasa (min `clamp(4rem, 12vw, 11rem)`), label antarmuka kecil kapital dengan letter-spacing lebar.

### 4.3 Tipografi
- **Antarmuka:** sans-serif tebal. Google Fonts `Archivo` bobot 800 dan 900 (kapital untuk judul/tombol/label). Fallback: `"Arial Black", "Helvetica Neue", Arial, sans-serif`.
- **Isi catatan:** font tulisan tangan. Google Fonts `Caveat` bobot 500 dan 700. Fallback: `"Segoe Print", "Bradley Hand", cursive`.
- Muat font via satu `<link>` di `index.html` dengan `display=swap`, plus `preconnect`.
- Ukuran isi catatan min `1.5rem`, `line-height: 1.25`.

### 4.4 Palet warna (variabel di `css/base/variables.css`)

Definisikan SEMUA warna sebagai CSS custom property. Dua set: siang (default `:root`) dan malam (`[data-theme="night"]`).

| Variabel | Siang | Malam |
|---|---|---|
| `--color-paper` | `#F2EFE6` | `#121212` |
| `--color-ink` | `#111111` | `#F2EFE6` |
| `--color-grid-dot` | `#B9B4A4` | `#3A3A3A` |
| `--color-accent` | `#FF3B00` | `#C6FF00` |
| `--color-accent-ink` | `#111111` | `#111111` |
| `--color-panel` | `#FFFFFF` | `#1C1C1C` |

Warna catatan (solid, sama di kedua tema, teks catatan selalu `#111111`):
`--note-yellow: #FFE600`, `--note-pink: #FF8FB8`, `--note-blue: #7FD1FF`, `--note-green: #9BF08A`, `--note-orange: #FFA94D`.

Variabel lain wajib: `--space-*` (skala tidak seragam: 4, 8, 16, 32, 64, 128px), `--border-thick: 3px`, `--shadow-hard: 6px 6px 0 var(--color-ink)`, `--font-ui`, `--font-hand`, `--z-*` untuk layer.

Transisi tema: `transition: background-color 200ms steps(4), color 200ms steps(4);` (gerak patah, bukan halus).

### 4.5 Latar dotted grid (TANPA GRADIEN)
`radial-gradient` DILARANG. Buat titik grid dengan file `assets/dot-grid.svg`:
- SVG 24x24 berisi satu `<circle cx="12" cy="12" r="1.5">`.
- Warna lingkaran HARUS bisa mengikuti tema. Karena `background-image: url()` tidak dapat membaca CSS variable, gunakan salah satu: (a) dua file SVG (`dot-grid-day.svg`, `dot-grid-night.svg`) lalu pilih lewat variabel `--grid-image: url(...)` per tema, atau (b) satu SVG dengan `fill="currentColor"` yang dipasang sebagai CSS `mask-image` pada pseudo-element `canvas__grid` berlatar `var(--color-grid-dot)`. **Pilih (b)**, dan sesuaikan daftar berkas: tetap satu file `dot-grid.svg`.
- Lapisan grid ikut bergeser bersama pan kanvas.

### 4.6 Layout HUD

- **Masthead** (block `masthead`): pojok kiri atas, teks "KERTAS / KELUH" bertumpuk dua baris, baris kedua digeser ke kanan (offset), ukuran raksasa. Boleh terpotong sebagian di tepi layar. Di bawahnya satu baris kecil kapital: "PAPAN CURHAT. Rp 2.000 PER KELUHAN."
- **Rail** (block `rail`): bilah vertikal sempit menempel tepi kiri. Berisi tombol utama "+ TEMPEL" (aksen), penanda tema aktif (SIANG/MALAM, read-only), dan tombol "PUSAT" untuk kembali ke tengah kanvas. Teks rail diputar 90 derajat (`writing-mode: vertical-rl`).
- **Ticker** (block `ticker`): pojok kanan bawah, kotak bergaris tebal berisi jumlah catatan ("0042 KELUHAN") dan harga. Tidak simetris dengan masthead.
- **Canvas** (block `canvas`): mengisi seluruh viewport di belakang HUD, ukuran dunia 6000 x 4000 px, kursor `grab`/`grabbing`.
- **Empty state:** bila belum ada catatan, tampilkan satu teks besar miring di tengah kanvas: "KOSONG. BELUM ADA YANG BERANI." dan panah teks `↘` menuju tombol tempel.
- **Responsif:** di bawah 720px, rail pindah menjadi bilah horizontal bawah, composer menjadi panel layar penuh, masthead mengecil namun tetap terpotong asimetris.

---

## 5. FUNGSI INTI

### 5.1 Tema siang/malam dinamis (berdasarkan jam lokal)
- `theme.js` membaca `new Date().getHours()`. Jam 06:00-17:59 = `day`, selain itu `night`.
- Set `document.documentElement.dataset.theme = 'day' | 'night'`.
- Seluruh warna HANYA berubah lewat CSS variables di bawah selector `[data-theme="night"]`. DILARANG mengubah warna lewat JS langsung.
- Periksa ulang tiap 60 detik (`setInterval`) dan saat tab kembali aktif (`visibilitychange`). Terapkan perubahan hanya bila tema berbeda dari sebelumnya.
- Tema TIDAK bisa diubah manual (sengaja). Rail hanya menampilkan statusnya.

### 5.2 Model data catatan

```js
// Note
{
  id: string,            // generateId()
  html: string,          // sudah disanitasi
  image: string | null,  // data URL
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange',
  x: number,             // koordinat kanvas (px)
  y: number,
  rotation: number,      // derajat, -6 s.d. +6
  createdAt: number,     // epoch ms
  paid: true             // selalu true untuk catatan yang tersimpan
}
```

Hanya catatan yang sudah melewati pembayaran (mockup) yang boleh masuk ke `storage`.

### 5.3 Rich Text Editor sederhana (`contenteditable`)
- Area tulis: `<div class="editor__field" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Tulis keluhanmu" data-js="editor-field">`.
- Toolbar (block `toolbar`) berisi tiga tombol: **B** (bold), *I* (italic), dan LIST (unordered list). Tombol bertipe `<button type="button">`, memakai `aria-pressed`, dan modifier `toolbar__button--active` saat format aktif pada posisi kursor.
- Implementasi perintah memakai `document.execCommand('bold' | 'italic' | 'insertUnorderedList')`, dibungkus helper di `editor.js` dengan pengecekan keberadaan fungsi. Perbarui status tombol lewat `document.queryCommandState` pada event `selectionchange`/`keyup`/`mouseup`.
- Pintasan: `Ctrl/Cmd+B`, `Ctrl/Cmd+I`.
- **Paste:** cegah paste HTML. Tangkap event `paste`, ambil `text/plain`, sisipkan dengan `insertText`.
- **Batas:** maksimum 500 karakter teks (hitung `innerText`). Tampilkan penghitung "123 / 500" di composer. Blokir input baru saat penuh (kecuali hapus).
- **Placeholder:** tampilkan lewat CSS `:empty::before` dengan `content: attr(data-placeholder)`. Teks: "TULIS DI SINI. TIDAK ADA YANG MENGHAKIMI (MUNGKIN)."
- **Sanitasi (`sanitizer.js`):** whitelist tag `B, STRONG, I, EM, UL, OL, LI, BR, DIV, P`. Tag lain dibuka (unwrap) menjadi teks. Semua atribut dibuang. Sanitasi dijalankan sebelum draf dikirim ke pembayaran dan sebelum render catatan dari `localStorage`.
- Validasi: draf tidak valid bila teks kosong DAN tidak ada gambar.

### 5.4 Fitur unggah fail (gambar)
- Block `uploader`: zona drop bergaris putus-putus tebal (`border: 3px dashed`) + tombol "PILIH FAIL" yang memicu `<input type="file" accept="image/png,image/jpeg,image/webp" hidden data-js="uploader-input">`.
- Dukung drag-and-drop ke zona dan ke composer. Modifier `uploader--dragover` saat file di atas zona.
- Validasi: tipe MIME harus png/jpeg/webp, ukuran maksimum **2 MB**. Bila gagal, tampilkan toast error spesifik ("FAIL TERLALU BESAR. MAKS 2 MB.", "FORMAT TIDAK DIDUKUNG.").
- Baca dengan `FileReader.readAsDataURL`. Tampilkan preview (maks tinggi 160px, `object-fit: cover`, border tebal) dengan tombol "HAPUS GAMBAR".
- Hanya SATU gambar per catatan. Mengunggah ulang menggantikan yang lama.
- Di catatan terbit, gambar tampil di atas teks dengan border `3px` tinta.

### 5.5 Composer (panel tulis)
- Block `composer`: panel menempel di sisi kiri (desktop) / layar penuh (mobile), bergaris tebal, bayangan keras, sedikit miring (`-1deg`).
- Isi berurutan: judul "TEMPEL KELUHAN", pilihan warna (lima kotak warna solid, `role="radiogroup"`, modifier `composer__swatch--selected`), toolbar, editor, uploader, penghitung karakter, ringkasan harga "Rp 2.000", tombol "LANJUT KE PEMBAYARAN" (aksen) dan "BATAL".
- Tombol lanjut `disabled` selama draf tidak valid.
- ESC atau tombol BATAL menutup panel; bila draf terisi, minta konfirmasi lewat `confirm`-style modal sederhana (boleh pakai block `modal` yang sama), bukan `window.confirm`.

### 5.6 Modal pembayaran Rp 2.000 (MOCKUP)
Block `modal` (overlay solid hitam/putih sesuai tema, TANPA transparansi blur) membungkus block `payment`.

Konten `payment`:
1. Label kuning miring: "SIMULASI. TIDAK ADA UANG SUNGGUHAN."
2. Ringkasan: "1 KELUHAN" dan total besar `Rp 2.000` (format lewat `formatRupiah`, titik pemisah ribuan).
3. Pilihan metode (radio, hanya tampilan): QRIS, E-WALLET, TRANSFER BANK. Default QRIS.
4. Untuk QRIS: kotak persegi berisi pola kotak-kotak hitam-putih statis (SVG inline sederhana, bukan QR valid) sebagai ilustrasi.
5. Tombol "BAYAR Rp 2.000" (aksen) dan "KEMBALI KE DRAF".

State machine di `payment.js`: `idle -> processing -> success | error`.
- `processing`: tombol dikunci, teks "MEMPROSES...", durasi tiruan 1500 ms (`setTimeout`).
- Hasil mockup: selalu `success` (sediakan konstanta `SIMULATE_FAILURE_RATE = 0` agar mudah diuji).
- `success`: tampilkan "LUNAS" sebentar (700 ms), tutup modal, lalu panggil callback publikasi.
- `error`: tampilkan pesan dan tombol "COBA LAGI".
- KEMBALI KE DRAF menutup modal tanpa menghapus draf.
- Catatan TIDAK boleh terpublikasi lewat jalur lain selain callback sukses pembayaran.

Aksesibilitas modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap (Tab/Shift+Tab berputar), ESC menutup (kecuali saat `processing`), fokus kembali ke pemicu setelah ditutup, scroll latar dikunci.

### 5.7 Kanvas lebar & interaksi
- Dunia kanvas 6000 x 4000 px, dipindah dengan `transform: translate()` pada block `canvas__world`.
- Pan: drag pada area kosong (pointer events), gulir roda/trackpad, sentuhan satu jari. Batasi (clamp) agar tidak keluar dunia.
- Tampilan awal: pusat dunia.
- Publikasi: posisi catatan baru dipilih acak di sekitar area yang sedang terlihat di viewport (bukan di seluruh dunia), hindari tumpang tindih penuh dengan mencoba hingga 20 kali; bila gagal, terima posisi terakhir. Setelah terbit, kanvas menggeser halus (tanpa easing lembut, gunakan `steps`) agar catatan baru terlihat, dan catatan diberi modifier `note-card--fresh` selama 1 detik (border aksen).
- Catatan baru muncul dengan animasi "tempel" singkat: skala 1.08 ke 1 dalam 160 ms linear. Hormati `prefers-reduced-motion` (matikan animasi).
- `[OPSIONAL]` Drag catatan terbit untuk dipindah (pointer events), simpan posisi baru ke storage. Jika diimplementasikan, bedakan drag catatan dari pan kanvas.

### 5.8 Kartu catatan (`note-card`)
Elemen: `note-card`, `note-card__image`, `note-card__body`, `note-card__stamp`.
- Kartu persegi bergaris tebal, bayangan keras, lebar tetap 280px, tinggi mengikuti isi (maks 420px, overflow tersembunyi).
- `note-card__stamp`: label kecil kapital berisi tanggal ("02 NOV 2026") di pojok, miring berlawanan arah dengan kartu.
- Isi teks memakai `--font-hand`. Style `ul`/`li` di dalam `note-card__body` ditulis lewat selector turunan satu level dalam block yang sama (diizinkan sebagai pengecualian untuk konten rich-text); tanpa class tambahan.
- Warna lewat modifier: `note-card--yellow`, `--pink`, `--blue`, `--green`, `--orange`.

### 5.9 Toast
Block `toast`: kotak solid di kanan atas, miring ringan, hilang otomatis 3 detik, `role="status"` `aria-live="polite"`. Modifier `toast--error` memakai warna aksen.

### 5.10 Persistensi
- Muat catatan saat start, render ulang semua, perbarui ticker.
- Simpan setiap kali catatan ditambah.
- Bila quota penuh: batalkan penyimpanan, tampilkan toast "PENYIMPANAN PENUH. HAPUS GAMBAR LAIN ATAU KURANGI UKURAN."

---

## 6. SPESIFIKASI `index.html`

- `<html lang="id" data-theme="day">`. `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Judul: "Kertas Keluh | Papan Curhat Rp 2.000".
- Urutan di `<head>`: meta, preconnect + link Google Fonts, `<script src="js/modules/theme.js"></script>`, `<link rel="stylesheet" href="css/main.css">`.
- `<body class="app">` berisi: `masthead`, `rail`, `canvas` (dengan `canvas__grid` dan `canvas__world`), `composer`, `modal` (kosong, diisi `payment`), `ticker`, `toast`.
- Akhir body: `<script type="module" src="js/main.js"></script>`.
- Gunakan elemen semantik (`header`, `nav`, `main`, `aside`, `section`, `button`). Semua kontrol interaktif adalah `<button>` atau `<input>` asli.

`css/main.css` hanya berisi `@import` berurutan: variables, reset, typography, lalu semua block sesuai 2.5.

---

## 7. AKSESIBILITAS & KUALITAS

- Kontras teks minimal WCAG AA pada kedua tema.
- `:focus-visible` memakai outline `4px solid var(--color-accent)` dengan `outline-offset: 2px` pada semua kontrol.
- Semua tombol ikon punya `aria-label`.
- Dukungan keyboard penuh: composer, toolbar, modal, pemilih warna (panah kiri/kanan).
- Hormati `prefers-reduced-motion: reduce`.
- Tidak ada error di console pada alur normal.
- Tidak ada variabel/fungsi tak terpakai, tidak ada kode mati, tidak ada `console.log` tersisa.

---

## 8. CHECKLIST PENERIMAAN (agy wajib memverifikasi secara internal sebelum mengeluarkan kode)

- [ ] Output hanya blok kode, tanpa teks di luar blok.
- [ ] Struktur berkas persis sesuai 2.5, urutan sesuai 3.2.
- [ ] Tidak ada `<style>`, `style=""` (selain custom property), `onclick`, atau logika di HTML.
- [ ] Semua class mengikuti BEM, tanpa class utilitas, tanpa ID untuk styling, tanpa `!important`.
- [ ] Tidak ada gradien, blur, `backdrop-filter`, `border-radius`, atau bayangan dengan blur.
- [ ] Dotted grid berasal dari `dot-grid.svg`, bukan gradien.
- [ ] Tema siang/malam dari jam lokal, hanya lewat CSS variables, diperbarui tiap menit.
- [ ] Editor `contenteditable` mendukung bold, italic, list; paste teks polos; sanitasi aktif.
- [ ] Unggah fail tervalidasi (tipe, 2 MB), preview, hapus, drag-drop.
- [ ] Catatan hanya terbit setelah modal pembayaran Rp 2.000 mockup sukses.
- [ ] Rotasi catatan acak (-6 s.d. +6 deg) tersimpan dan stabil saat reload.
- [ ] Font tulisan tangan (Caveat) untuk isi catatan, Archivo tebal untuk antarmuka.
- [ ] Layout asimetris, ruang negatif lapang, responsif di bawah 720px.
- [ ] Modal punya focus trap, ESC, dan pengembalian fokus.

---

## 9. PERINTAH EKSEKUSI

Bangun seluruh proyek "Kertas Keluh" sekarang sesuai blueprint ini. Ingat Bagian 0: keluarkan HANYA blok kode, satu per berkas, berurutan, tanpa pengantar, narasi, atau penutup.

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
