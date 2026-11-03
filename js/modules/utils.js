// FILE: js/modules/utils.js
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function seededRandom(seed) {
  let s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

export function generateId() {
  return 'cerita_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function formatRupiah(amount) {
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${parts}`;
}

export function debounce(fn, waitMs) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, waitMs);
  };
}

export function trapFocus(containerEl, onEscape) {
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      if (typeof onEscape === 'function') {
        onEscape();
      }
      return;
    }

    if (e.key !== 'Tab') return;

    const focusables = containerEl.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return function cleanup() {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
