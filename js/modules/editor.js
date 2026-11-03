// FILE: js/modules/editor.js
import { LIMITS } from './config.js';

let editorField = null;
let charCounter = null;
let boldBtn = null;
let italicBtn = null;
let listBtn = null;
let onContentChangeCallback = null;

function updateCharCounter() {
  const text = getEditorText();
  const count = text.length;
  if (charCounter) {
    charCounter.textContent = `${count} / ${LIMITS.maxChars}`;
  }
  if (onContentChangeCallback) {
    onContentChangeCallback();
  }
}

export function syncToolbarState() {
  if (!boldBtn || !italicBtn || !listBtn) return;

  try {
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isList = document.queryCommandState('insertUnorderedList');

    boldBtn.classList.toggle('toolbar__button--active', isBold);
    boldBtn.setAttribute('aria-pressed', isBold ? 'true' : 'false');

    italicBtn.classList.toggle('toolbar__button--active', isItalic);
    italicBtn.setAttribute('aria-pressed', isItalic ? 'true' : 'false');

    listBtn.classList.toggle('toolbar__button--active', isList);
    listBtn.setAttribute('aria-pressed', isList ? 'true' : 'false');
  } catch (_) {}
}

export function executeCommand(cmd) {
  if (!editorField) return;
  editorField.focus();
  try {
    document.execCommand(cmd, false, null);
    syncToolbarState();
    updateCharCounter();
  } catch (_) {}
}

export function getEditorText() {
  if (!editorField) return '';
  const inner = editorField.innerText ? editorField.innerText.trim() : '';
  const text = editorField.textContent ? editorField.textContent.trim() : '';
  return inner || text;
}

export function getEditorHtml() {
  if (!editorField) return '';
  return editorField.innerHTML;
}

export function setEditorHtml(html) {
  if (editorField) {
    editorField.innerHTML = html || '';
    updateCharCounter();
    syncToolbarState();
  }
}

export function clearEditor() {
  if (editorField) {
    editorField.innerHTML = '';
    updateCharCounter();
    syncToolbarState();
  }
}

export function isEditorEmpty() {
  return getEditorText().length === 0;
}

export function initEditor(onChange) {
  editorField = document.querySelector('[data-js="editor-field"]');
  charCounter = document.querySelector('[data-js="char-counter"]');
  boldBtn = document.querySelector('[data-js="toolbar-bold"]');
  italicBtn = document.querySelector('[data-js="toolbar-italic"]');
  listBtn = document.querySelector('[data-js="toolbar-list"]');
  onContentChangeCallback = onChange;

  if (!editorField) return;

  const bindToolbarBtn = (btn, cmd) => {
    if (!btn) return;
    btn.addEventListener('mousedown', (e) => {
      // Cegah hilangnya fokus/seleksi teks dari contenteditable saat klik tombol
      e.preventDefault();
    });
    btn.addEventListener('click', () => executeCommand(cmd));
  };

  bindToolbarBtn(boldBtn, 'bold');
  bindToolbarBtn(italicBtn, 'italic');
  bindToolbarBtn(listBtn, 'insertUnorderedList');

  editorField.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      executeCommand('bold');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      executeCommand('italic');
      return;
    }

    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'
    ];
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }

    const currentLen = getEditorText().length;
    if (currentLen >= LIMITS.maxChars) {
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) {
        e.preventDefault();
      }
    }
  });

  ['input', 'keyup', 'change', 'blur'].forEach((evt) => {
    editorField.addEventListener(evt, () => {
      updateCharCounter();
    });
  });

  editorField.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!text) return;

    const currentLen = getEditorText().length;
    const available = Math.max(0, LIMITS.maxChars - currentLen);
    const textToInsert = text.slice(0, available);

    try {
      document.execCommand('insertText', false, textToInsert);
    } catch (_) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(textToInsert));
      }
    }
    updateCharCounter();
  });

  ['keyup', 'mouseup', 'pointerup'].forEach((evt) => {
    editorField.addEventListener(evt, syncToolbarState);
  });

  document.addEventListener('selectionchange', () => {
    if (document.activeElement === editorField) {
      syncToolbarState();
    }
  });

  updateCharCounter();
}
