// FILE: js/modules/composer.js
import { getEditorHtml, getEditorText, setEditorHtml, clearEditor, isEditorEmpty } from './editor.js';
import { getUploadedImage, setUploadedImage, clearUploadedImage, hasImage } from './uploader.js';
import { openPaymentModal } from './payment.js';
import { addAndPublishNote, updateNote } from './notes.js';
import { saveDraft, loadDraft, clearDraft } from './storage.js';
import { showToast } from './toast.js';
import { checkCareText, resetCareState } from './care.js';
import { debounce } from './utils.js';
import { getCurrentUser } from './auth.js';
import { inspectNoteById } from './tunnel/scene.js';

let composerPanel = null;
let submitButton = null;
let composerTitle = null;
let priceSummary = null;
let swatchElements = [];
let selectedColor = 'butter';
let triggerButton = null;
let editingNoteId = null;

const debouncedSaveDraft = debounce(() => {
  if (isDraftValid()) {
    saveDraft({
      html: getEditorHtml(),
      image: getUploadedImage(),
      color: selectedColor
    });
  }
}, 500);

export function isDraftValid() {
  const hasText = !isEditorEmpty();
  const hasImg = hasImage();
  return hasText || hasImg;
}

export function updateDraftValidity() {
  if (submitButton) {
    submitButton.disabled = !isDraftValid();
  }
  checkCareText(getEditorText());
  debouncedSaveDraft();
}

function selectColor(color) {
  selectedColor = color;
  swatchElements.forEach((swatch) => {
    const isCurrent = swatch.getAttribute('data-color') === color;
    swatch.classList.toggle('composer__swatch--selected', isCurrent);
    swatch.setAttribute('aria-checked', isCurrent ? 'true' : 'false');
  });
  const editor = document.querySelector('[data-js="editor-field"]');
  if (editor) {
    editor.setAttribute('data-color', color);
  }
  debouncedSaveDraft();
}

function handleSwatchKeydown(e, index) {
  let nextIndex = index;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    nextIndex = (index + 1) % swatchElements.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    nextIndex = (index - 1 + swatchElements.length) % swatchElements.length;
  } else {
    return;
  }
  const targetSwatch = swatchElements[nextIndex];
  targetSwatch.focus();
  selectColor(targetSwatch.getAttribute('data-color'));
}

export function openComposer(trigger) {
  if (trigger) triggerButton = trigger;
  editingNoteId = null;

  if (composerTitle) composerTitle.textContent = 'Tulis yang kamu rasakan';
  if (priceSummary) priceSummary.hidden = false;
  if (submitButton) submitButton.textContent = 'Lanjut ke pembayaran';

  const saved = loadDraft();
  if (saved) {
    if (saved.html) setEditorHtml(saved.html);
    if (saved.image) setUploadedImage(saved.image);
    if (saved.color) selectColor(saved.color);
  }

  if (composerPanel) {
    composerPanel.hidden = false;
    const editor = document.querySelector('[data-js="editor-field"]');
    if (editor) {
      setTimeout(() => editor.focus(), 50);
    }
    updateDraftValidity();
  }

  window.dispatchEvent(new CustomEvent('kertaskeluh:composerstate', { detail: { open: true } }));
}

export function openComposerForEdit(note, trigger) {
  if (!note) return;
  if (trigger) triggerButton = trigger;
  editingNoteId = note.id;

  if (composerTitle) composerTitle.textContent = 'Edit Ceritamu';
  if (priceSummary) priceSummary.hidden = true;
  if (submitButton) submitButton.textContent = 'Simpan Perubahan';

  setEditorHtml(note.html || '');
  setUploadedImage(note.image || null);
  selectColor(note.color || 'butter');

  if (composerPanel) {
    composerPanel.hidden = false;
    const editor = document.querySelector('[data-js="editor-field"]');
    if (editor) {
      setTimeout(() => editor.focus(), 50);
    }
    updateDraftValidity();
  }

  window.dispatchEvent(
    new CustomEvent('kertaskeluh:composerstate', { detail: { open: true, editing: true } })
  );
}

export function closeComposer() {
  const isEditing = Boolean(editingNoteId);
  const hadContent = isDraftValid();

  if (composerPanel) {
    composerPanel.hidden = true;
  }

  window.dispatchEvent(new CustomEvent('kertaskeluh:composerstate', { detail: { open: false } }));

  if (!isEditing && hadContent) {
    showToast('Draf disimpan. Kamu bisa lanjut kapan saja.');
  }

  editingNoteId = null;
  if (composerTitle) composerTitle.textContent = 'Tulis yang kamu rasakan';
  if (priceSummary) priceSummary.hidden = false;
  if (submitButton) submitButton.textContent = 'Lanjut ke pembayaran';

  if (triggerButton && typeof triggerButton.focus === 'function') {
    triggerButton.focus();
  }
}

export function initComposer() {
  composerPanel = document.querySelector('[data-js="composer-panel"]');
  submitButton = document.querySelector('[data-js="composer-submit"]');
  composerTitle = document.querySelector('[data-js="composer-title"]');
  priceSummary = document.querySelector('[data-js="composer-price-summary"]');
  swatchElements = Array.from(document.querySelectorAll('[data-js="swatch-item"]'));

  const closeBtn = document.querySelector('[data-js="composer-close"]');
  const cancelBtn = document.querySelector('[data-js="composer-cancel"]');
  const heroAddTrigger = document.querySelector('[data-js="hero-add-trigger"]');

  if (heroAddTrigger) {
    heroAddTrigger.addEventListener('click', () => openComposer(heroAddTrigger));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeComposer());
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeComposer());
  }

  swatchElements.forEach((swatch, index) => {
    swatch.addEventListener('click', () => {
      selectColor(swatch.getAttribute('data-color'));
    });
    swatch.addEventListener('keydown', (e) => handleSwatchKeydown(e, index));
  });

  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isDraftValid()) return;

      if (editingNoteId) {
        const idToUpdate = editingNoteId;
        updateNote(idToUpdate, {
          html: getEditorHtml(),
          image: getUploadedImage(),
          color: selectedColor
        });

        clearEditor();
        clearUploadedImage();
        resetCareState();
        selectColor('butter');
        closeComposer();
        showToast('Perubahan ceritamu berhasil disimpan.');
        setTimeout(() => inspectNoteById(idToUpdate), 120);
        return;
      }

      const currentUser = getCurrentUser();
      const draft = {
        html: getEditorHtml(),
        image: getUploadedImage(),
        color: selectedColor,
        authorId: currentUser ? currentUser.id : 'anonymous',
        authorName: currentUser ? currentUser.name : 'Anonim'
      };

      openPaymentModal({
        draft,
        onSuccess: (paidDraft) => {
          addAndPublishNote(paidDraft);
          clearDraft();
          clearEditor();
          clearUploadedImage();
          resetCareState();
          selectColor('butter');
          closeComposer();
          showToast('Ceritamu berhasil ditempel di papan.');
        }
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && composerPanel && !composerPanel.hidden) {
      const modal = document.querySelector('[data-js="modal-root"]');
      if (modal && !modal.hidden) return;
      closeComposer();
    }
  });

  updateDraftValidity();
}
