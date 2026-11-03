// FILE: js/modules/payment.js
import { formatRupiah, trapFocus } from './utils.js';
import { SIMULATE_FAILURE_RATE } from './config.js';

const PAYMENT_AMOUNT = 2000;

let modalRoot = null;
let modalDialog = null;
let currentDraft = null;
let onPaymentSuccessCallback = null;
let previousActiveElement = null;
let currentPaymentState = 'idle';
let cleanupFocusTrap = null;

const QR_SVG = `
  <svg class="payment__qr-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="100" height="100" fill="#FFFFFF"/>
    <rect x="8" y="8" width="24" height="24" fill="#1B2A3A"/>
    <rect x="12" y="12" width="16" height="16" fill="#FFFFFF"/>
    <rect x="16" y="16" width="8" height="8" fill="#1B2A3A"/>
    <rect x="68" y="8" width="24" height="24" fill="#1B2A3A"/>
    <rect x="72" y="12" width="16" height="16" fill="#FFFFFF"/>
    <rect x="76" y="16" width="8" height="8" fill="#1B2A3A"/>
    <rect x="8" y="68" width="24" height="24" fill="#1B2A3A"/>
    <rect x="12" y="72" width="16" height="16" fill="#FFFFFF"/>
    <rect x="16" y="76" width="8" height="8" fill="#1B2A3A"/>
    <rect x="40" y="12" width="8" height="8" fill="#1B2A3A"/>
    <rect x="52" y="20" width="8" height="8" fill="#1B2A3A"/>
    <rect x="40" y="40" width="20" height="20" fill="#1B2A3A"/>
    <rect x="46" y="46" width="8" height="8" fill="#FFFFFF"/>
    <rect x="68" y="40" width="12" height="6" fill="#1B2A3A"/>
    <rect x="16" y="44" width="14" height="6" fill="#1B2A3A"/>
    <rect x="40" y="68" width="14" height="14" fill="#1B2A3A"/>
    <rect x="68" y="68" width="22" height="8" fill="#1B2A3A"/>
    <rect x="76" y="82" width="14" height="10" fill="#1B2A3A"/>
    <rect x="60" y="82" width="8" height="8" fill="#1B2A3A"/>
  </svg>
`;

function renderPaymentView() {
  if (!modalDialog) return;

  modalDialog.innerHTML = `
    <div class="payment">
      <span class="payment__notice">Simulasi. Tidak ada uang sungguhan.</span>

      <div class="payment__summary">
        <span class="payment__summary-item">1 cerita</span>
        <span class="payment__summary-total">${formatRupiah(PAYMENT_AMOUNT)}</span>
      </div>

      <div class="payment__methods" role="radiogroup" aria-label="Metode Pembayaran">
        <label class="payment__method payment__method--active">
          <input type="radio" name="payment-method" value="qris" checked class="payment__method-input" data-js="method-radio">
          <span class="payment__method-label">QRIS (Instan)</span>
        </label>
        <label class="payment__method">
          <input type="radio" name="payment-method" value="ewallet" class="payment__method-input" data-js="method-radio">
          <span class="payment__method-label">E-Wallet</span>
        </label>
        <label class="payment__method">
          <input type="radio" name="payment-method" value="bank" class="payment__method-input" data-js="method-radio">
          <span class="payment__method-label">Transfer Bank</span>
        </label>
      </div>

      <div class="payment__qr-box">
        ${QR_SVG}
      </div>

      <div class="payment__status-area" data-js="payment-status-area" hidden></div>

      <div class="payment__actions">
        <button type="button" class="button button--pill button--accent payment__pay-btn" data-js="pay-confirm-btn">
          Bayar ${formatRupiah(PAYMENT_AMOUNT)}
        </button>
        <button type="button" class="button button--pill button--outline payment__cancel-btn" data-js="pay-cancel-btn">
          Kembali ke draf
        </button>
      </div>
    </div>
  `;

  bindPaymentEvents();
}

function bindPaymentEvents() {
  const payBtn = modalDialog.querySelector('[data-js="pay-confirm-btn"]');
  const cancelBtn = modalDialog.querySelector('[data-js="pay-cancel-btn"]');
  const methodRadios = modalDialog.querySelectorAll('[data-js="method-radio"]');

  methodRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      modalDialog.querySelectorAll('.payment__method').forEach((item) => {
        item.classList.remove('payment__method--active');
      });
      e.target.closest('.payment__method').classList.add('payment__method--active');
    });
  });

  if (payBtn) {
    payBtn.addEventListener('click', handlePayClick);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (currentPaymentState === 'processing') return;
      closePaymentModal();
    });
  }
}

function handlePayClick() {
  if (currentPaymentState === 'processing') return;

  const payBtn = modalDialog.querySelector('[data-js="pay-confirm-btn"]');
  const cancelBtn = modalDialog.querySelector('[data-js="pay-cancel-btn"]');
  const statusArea = modalDialog.querySelector('[data-js="payment-status-area"]');

  currentPaymentState = 'processing';
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = 'Sebentar ya...';
  }
  if (cancelBtn) cancelBtn.disabled = true;

  if (statusArea) {
    statusArea.hidden = false;
    statusArea.className = 'payment__status payment__status--processing';
    statusArea.textContent = 'Menghubungkan ke bank simulasi...';
  }

  setTimeout(() => {
    const isSuccess = Math.random() >= SIMULATE_FAILURE_RATE;

    if (isSuccess) {
      currentPaymentState = 'success';
      if (statusArea) {
        statusArea.className = 'payment__status payment__status--success';
        statusArea.textContent = 'Berhasil. Ceritamu sudah ditempel.';
      }

      setTimeout(() => {
        const paidDraft = currentDraft;
        closePaymentModal();
        if (onPaymentSuccessCallback && paidDraft) {
          onPaymentSuccessCallback(paidDraft);
        }
      }, 900);
    } else {
      currentPaymentState = 'error';
      if (statusArea) {
        statusArea.className = 'payment__status payment__status--error';
        statusArea.textContent = 'Pembayaran belum berhasil. Tidak apa-apa, coba lagi kapan pun kamu siap.';
      }
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.textContent = 'Coba lagi';
      }
      if (cancelBtn) cancelBtn.disabled = false;
    }
  }, 1500);
}

export function openPaymentModal({ draft, onSuccess }) {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');

  if (!modalRoot || !modalDialog) return;

  currentDraft = draft;
  onPaymentSuccessCallback = onSuccess;
  currentPaymentState = 'idle';
  previousActiveElement = document.activeElement;

  renderPaymentView();
  modalRoot.hidden = false;
  document.body.style.overflow = 'hidden';

  cleanupFocusTrap = trapFocus(modalDialog, () => {
    if (currentPaymentState !== 'processing') {
      closePaymentModal();
    }
  });

  const firstBtn = modalDialog.querySelector('[data-js="pay-confirm-btn"]');
  if (firstBtn) firstBtn.focus();
}

export function closePaymentModal() {
  if (!modalRoot) return;

  modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  document.body.style.overflow = '';

  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }

  currentPaymentState = 'idle';
  currentDraft = null;

  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}
