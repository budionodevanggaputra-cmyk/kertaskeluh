// FILE: js/modules/toast.js
let toastTimeout = null;

export function showToast(message, isError = false) {
  const toastEl = document.querySelector('[data-js="toast-element"]');
  if (!toastEl) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastEl.textContent = message;
  toastEl.classList.toggle('toast--error', isError);
  toastEl.hidden = false;

  toastTimeout = setTimeout(() => {
    toastEl.hidden = true;
    toastEl.classList.remove('toast--error');
    toastEl.textContent = '';
  }, 4000);
}
