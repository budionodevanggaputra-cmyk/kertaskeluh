// FILE: js/modules/support.js
import { SUPPORT } from './config.js';
import { trapFocus } from './utils.js';

let modalRoot = null;
let modalDialog = null;
let previousActiveElement = null;
let cleanupFocusTrap = null;

export function openSupportModal() {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');

  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;

  modalDialog.innerHTML = `
    <div class="support">
      <h2 class="support__title" id="modal-title">Bantuan & Dukungan</h2>
      <p class="support__intro">Kamu tidak sendirian. Kalau kamu merasa tidak aman atau ingin menyakiti diri sendiri, bicaralah dengan seseorang sekarang.</p>

      <div class="support__card">
        <div class="support__service">${SUPPORT.serviceName}</div>
        <p class="support__text">${SUPPORT.phoneText}</p>
        <a class="button button--pill button--cta support__action-btn" href="${SUPPORT.telHref}">Panggil Sekarang</a>
        <a class="support__site-link" href="${SUPPORT.siteHref}" target="_blank" rel="noopener noreferrer">${SUPPORT.siteLabel}</a>
        <p class="support__emergency">${SUPPORT.emergencyText}</p>
      </div>

      <p class="support__disclaimer">Kertas Keluh bukan layanan konseling dan tidak menggantikan bantuan tenaga kesehatan jiwa.</p>

      <button type="button" class="button button--pill button--secondary support__close-btn" data-js="support-close">
        Tutup
      </button>
    </div>
  `;

  modalRoot.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = modalDialog.querySelector('[data-js="support-close"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSupportModal);
  }

  cleanupFocusTrap = trapFocus(modalDialog, closeSupportModal);
  if (closeBtn) closeBtn.focus();
}

export function closeSupportModal() {
  if (!modalRoot) return;

  modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  document.body.style.overflow = '';

  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }

  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}
