// FILE: js/modules/tunnel/fallback-list.js
import { sanitizeHtml } from '../sanitizer.js';

export function updateA11yList(notes) {
  const container = document.querySelector('[data-js="tunnel-a11y-list"]');
  if (!container) return;

  container.innerHTML = '';
  notes.forEach((note) => {
    const item = document.createElement('article');
    const cleanBody = sanitizeHtml(note.html || '');
    item.innerHTML = `<p>${cleanBody}</p>`;
    container.appendChild(item);
  });
}

export function showFallbackList(notes) {
  const fallbackEl = document.querySelector('[data-js="tunnel-fallback"]');
  const canvasEl = document.querySelector('[data-js="tunnel-canvas"]');

  if (canvasEl) {
    canvasEl.classList.add('tunnel__canvas--hidden');
  }
  if (!fallbackEl) return;

  fallbackEl.hidden = false;
  fallbackEl.innerHTML = '';

  if (!notes || notes.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'tunnel__empty';
    emptyDiv.textContent = 'Belum ada cerita di sini. Tidak apa-apa. Kamu boleh mulai kapan saja.';
    fallbackEl.appendChild(emptyDiv);
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement('article');
    card.className = `note-card note-card--${note.color} tunnel__fallback-card`;

    let inner = '';
    if (note.image) {
      inner += `<img class="note-card__image" src="${note.image}" alt="Gambar cerita" loading="lazy">`;
    }
    inner += `<div class="note-card__body">${sanitizeHtml(note.html || '')}</div>`;
    card.innerHTML = inner;

    fallbackEl.appendChild(card);
  });
}
