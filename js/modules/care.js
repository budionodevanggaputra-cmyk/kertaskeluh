// FILE: js/modules/care.js
import { CARE_KEYWORDS } from './config.js';
import { debounce } from './utils.js';
import { openSupportModal } from './support.js';

let careElement = null;
let careBtn = null;
let careDismiss = null;
let isDismissedForCurrentDraft = false;

export function resetCareState() {
  isDismissedForCurrentDraft = false;
  if (careElement) {
    careElement.hidden = true;
  }
}

export const checkCareText = debounce((text) => {
  if (isDismissedForCurrentDraft || !careElement) return;

  const lower = (text || '').toLowerCase();
  const matched = CARE_KEYWORDS.some((kw) => lower.includes(kw));

  if (matched) {
    careElement.hidden = false;
  }
}, 600);

export function initCare() {
  careElement = document.querySelector('[data-js="composer-care"]');
  careBtn = document.querySelector('[data-js="care-open-support"]');
  careDismiss = document.querySelector('[data-js="care-dismiss"]');

  if (careBtn) {
    careBtn.addEventListener('click', () => {
      openSupportModal();
    });
  }

  if (careDismiss) {
    careDismiss.addEventListener('click', () => {
      isDismissedForCurrentDraft = true;
      if (careElement) careElement.hidden = true;
    });
  }
}
