// FILE: js/modules/info.js
import { trapFocus } from './utils.js';
import { openPauseModal } from './pause.js';
import { openSupportModal } from './support.js';
import { getNotesCount } from './notes.js';

let modalRoot = null;
let modalDialog = null;
let previousActiveElement = null;
let cleanupFocusTrap = null;

export function openInfoModal() {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');

  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;
  const currentTheme = document.documentElement.dataset.theme === 'day' ? 'Siang' : 'Malam';
  const totalNotes = getNotesCount();

  modalDialog.innerHTML = `
    <div class="info">
      <h2 class="info__title" id="modal-title">Information</h2>

      <section class="info__section">
        <h3 class="info__section-title">Tentang</h3>
        <p class="info__text">Kertas Keluh adalah terowongan bersama untuk menempelkan cerita dan keluh, tanpa nama dan tanpa dihakimi.</p>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Cara Menggunakan</h3>
        <ol class="info__list">
          <li class="info__list-item">Tekan Tambah Cerita.</li>
          <li class="info__list-item">Tulis ceritamu. Tambahkan satu gambar jika kamu mau.</li>
          <li class="info__list-item">Lanjut ke pembayaran Rp 2.000 (simulasi).</li>
          <li class="info__list-item">Ceritamu ditempel di dinding terowongan.</li>
        </ol>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Tarif</h3>
        <p class="info__text">Rp 2.000 per cerita. Saat ini hanya simulasi, tidak ada uang sungguhan.</p>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Privasi</h3>
        <p class="info__text">Semua cerita tersimpan di perangkat ini saja. Tidak ada akun dan tidak ada nama.</p>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Kontrol Terowongan</h3>
        <table class="info__table">
          <tbody>
            <tr><td>Maju/Mundur</td><td>Roda mouse, geser sentuh, tombol panah atas/bawah, tombol Maju/Mundur</td></tr>
            <tr><td>Zoom FOV</td><td>Tombol + dan &minus;, Ctrl/Cmd + roda, cubit dua jari</td></tr>
            <tr><td>Mendekat ke cerita</td><td>Klik pada panel cerita yang ingin dibaca</td></tr>
            <tr><td>Kembali ke awal</td><td>Tombol Home, tekan 0, atau klik persentase zoom</td></tr>
          </tbody>
        </table>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Tema & Statistik</h3>
        <p class="info__text">Tema mengikuti jam di perangkatmu. Sekarang: ${currentTheme}.</p>
        <p class="info__text">Total saat ini: ${totalNotes} cerita tertempel.</p>
      </section>

      <section class="info__section">
        <h3 class="info__section-title">Jeda & Bantuan</h3>
        <div class="info__actions">
          <button type="button" class="button button--pill button--secondary" data-js="info-open-pause">Coba jeda napas</button>
          <button type="button" class="button button--pill button--outline" data-js="info-open-support">Kontak bantuan</button>
        </div>
      </section>

      <p class="support__disclaimer">Kertas Keluh bukan layanan konseling.</p>

      <button type="button" class="button button--pill button--secondary info__close-btn" data-js="info-close">
        Tutup
      </button>
    </div>
  `;

  modalRoot.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = modalDialog.querySelector('[data-js="info-close"]');
  const btnPause = modalDialog.querySelector('[data-js="info-open-pause"]');
  const btnSupport = modalDialog.querySelector('[data-js="info-open-support"]');

  if (closeBtn) closeBtn.addEventListener('click', closeInfoModal);
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      closeInfoModal();
      openPauseModal();
    });
  }
  if (btnSupport) {
    btnSupport.addEventListener('click', () => {
      closeInfoModal();
      openSupportModal();
    });
  }

  cleanupFocusTrap = trapFocus(modalDialog, closeInfoModal);
  if (closeBtn) closeBtn.focus();

  window.dispatchEvent(new CustomEvent('kertaskeluh:infostate', { detail: { open: true } }));
}

export function closeInfoModal() {
  if (!modalRoot) return;

  modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  document.body.style.overflow = '';

  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }

  window.dispatchEvent(new CustomEvent('kertaskeluh:infostate', { detail: { open: false } }));

  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}
