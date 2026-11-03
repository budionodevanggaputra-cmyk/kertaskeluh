# PROYEK: Papan Curhat Interaktif (Sticky Notes Board)

Anda adalah Senior Fullstack Engineer dan Art Director. Buatkan arsitektur web berdasarkan spesifikasi berikut. Wajib pisahkan HTML, CSS, dan JS.

## 1. Arahan Visual & UI (Rujuk Gambar)
- **Konsep:** Papan kanvas luas (seperti Miro/FigJam) dengan elemen utama berupa kertas *sticky notes* warna-warni yang berserakan.
- **Background:** Gunakan pola titik-titik (dotted grid) halus.
- **Tipografi:** Gunakan font bergaya tulisan tangan (seperti Google Fonts 'Caveat' atau 'Kalam') untuk isi curhatan, dan font Sans-Serif bersih untuk antarmuka tombol/menu.
- **Kartu Curhatan:** Kotak bersudut tajam tanpa border-radius melengkung, dengan warna solid acak (kuning, hijau pastel, biru, dsb), dan rotasi asimetris acak (misal transform: rotate(-2deg)).

## 2. Fitur Logika & Interaktivitas (JavaScript)
- **Tema Dinamis Waktu:** Buat fungsi JS yang mengecek jam lokal (`new Date().getHours()`). 
  - Siang (06:00 - 17:59): Latar terang, elemen matahari statis pakai CSS/SVG.
  - Malam (18:00 - 05:59): Latar belakang gelap (dark mode), warna *sticky notes* lebih *muted*, dan elemen bulan menggunakan CSS/SVG di pojok atas. Gunakan CSS Variables untuk transisi warna.
- **Rich Text Editor (Lite):** Antarmuka input harus memiliki *toolbar* sederhana untuk Heading, Bold, Italic, Bullet List, dan Number List. Gunakan atribut `contenteditable="true"` pada div input, dikombinasikan dengan fungsi `document.execCommand()` di JS.
- **Upload File:** Sediakan tombol khusus dengan `<input type="file" accept="image/*,.pdf,.doc">` di dalam modal pembuatan catatan.

## 3. Gerbang Pembayaran (Mockup)
- Alur Pembuatan: Saat user mengklik "Posting", jangan langsung muncul di papan. Munculkan modal/popup "Selesaikan Pembayaran Rp 2.000" terlebih dahulu (mockup UI untuk integrasi Midtrans/Xendit nantinya).

## 4. Aturan Kode
- Gunakan metodologi penamaan BEM untuk CSS.
- Jangan gunakan *framework* CSS (Tailwind/Bootstrap). Gunakan murni Vanilla CSS dengan CSS Variables dan CSS Grid/Flexbox.
- Jangan berikan penjelasan naratif, berikan kode murni dengan komentar di dalamnya.
