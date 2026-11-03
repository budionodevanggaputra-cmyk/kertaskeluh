// FILE: js/modules/pause.js
import { BREATHING } from './config.js';
import { trapFocus } from './utils.js';

let modalRoot = null;
let modalDialog = null;
let previousActiveElement = null;
let cleanupFocusTrap = null;
let breathingTimeout = null;
let currentCycle = 0;

function runCycle(circleEl, labelEl) {
  if (currentCycle >= BREATHING.cycles) {
    if (labelEl) labelEl.textContent = 'Kamu sudah melakukannya dengan baik.';
    if (circleEl) {
      circleEl.className = 'pause__circle';
    }
    return;
  }

  // Fase 1: Tarik napas
  if (labelEl) labelEl.textContent = 'Tarik napas...';
  if (circleEl) {
    circleEl.style.setProperty('--phase-ms', `${BREATHING.inhaleMs}ms`);
    circleEl.className = 'pause__circle pause__circle--inhale';
  }

  breathingTimeout = setTimeout(() => {
    // Fase 2: Tahan
    if (labelEl) labelEl.textContent = 'Tahan...';
    if (circleEl) {
      circleEl.style.setProperty('--phase-ms', `${BREATHING.holdMs}ms`);
      circleEl.className = 'pause__circle pause__circle--hold';
    }

    breathingTimeout = setTimeout(() => {
      // Fase 3: Hembuskan pelan
      if (labelEl) labelEl.textContent = 'Hembuskan pelan...';
      if (circleEl) {
        circleEl.style.setProperty('--phase-ms', `${BREATHING.exhaleMs}ms`);
        circleEl.className = 'pause__circle pause__circle--exhale';
      }

      breathingTimeout = setTimeout(() => {
        currentCycle += 1;
        runCycle(circleEl, labelEl);
      }, BREATHING.exhaleMs);
    }, BREATHING.holdMs);
  }, BREATHING.inhaleMs);
}

export function openPauseModal() {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');

  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;
  currentCycle = 0;

  modalDialog.innerHTML = `
    <div class="pause">
      <h2 class="pause__title" id="modal-title">Jeda sebentar</h2>
      <p class="pause__intro">Tarik napas pelan. Ikuti lingkaran.</p>

      <div class="pause__stage">
        <div class="pause__circle" data-js="pause-circle"></div>
      </div>

      <div class="pause__label" data-js="pause-label" aria-live="polite">Siap...</div>

      <button type="button" class="button button--pill button--secondary pause__done-btn" data-js="pause-done">
        Selesai
      </button>
    </div>
  `;

  modalRoot.hidden = false;
  document.body.style.overflow = 'hidden';

  const circle = modalDialog.querySelector('[data-js="pause-circle"]');
  const label = modalDialog.querySelector('[data-js="pause-label"]');
  const doneBtn = modalDialog.querySelector('[data-js="pause-done"]');

  if (doneBtn) {
    doneBtn.addEventListener('click', closePauseModal);
  }

  cleanupFocusTrap = trapFocus(modalDialog, closePauseModal);
  if (doneBtn) doneBtn.focus();

  breathingTimeout = setTimeout(() => {
    runCycle(circle, label);
  }, 500);
}

export function closePauseModal() {
  if (breathingTimeout) {
    clearTimeout(breathingTimeout);
    breathingTimeout = null;
  }

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
