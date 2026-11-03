// FILE: js/modules/notes.js
import { loadNotes, saveNotes } from './storage.js';
import { generateId, randomBetween } from './utils.js';
import { sanitizeHtml } from './sanitizer.js';

let activeNotes = [];
let tickerElement = null;
const changeListeners = [];

function notifyChange() {
  updateTicker();
  changeListeners.forEach((fn) => {
    try {
      fn(activeNotes);
    } catch (_) {}
  });
}

function updateTicker() {
  if (!tickerElement) {
    tickerElement = document.querySelector('[data-js="ticker-count"]');
  }
  if (tickerElement) {
    tickerElement.textContent = `${activeNotes.length} cerita sudah ditempel di papan ini.`;
  }
}

export function onNotesChange(fn) {
  if (typeof fn === 'function') {
    changeListeners.push(fn);
  }
}

export function getAllNotes() {
  return activeNotes;
}

export function getNotesCount() {
  return activeNotes.length;
}

export function getNoteById(id) {
  return activeNotes.find((n) => n.id === id) || null;
}

export function getUserNotes(authorId) {
  if (!authorId || authorId === 'anonymous') return [];
  return activeNotes.filter((n) => n.authorId === authorId);
}

export function updateNote(id, { html, image, color }) {
  const note = activeNotes.find((n) => n.id === id);
  if (!note) return null;

  if (typeof html === 'string') {
    note.html = sanitizeHtml(html);
  }
  if (image !== undefined) {
    note.image = image;
  }
  if (color) {
    note.color = color;
  }
  note.updatedAt = Date.now();

  saveNotes(activeNotes);
  notifyChange();

  window.dispatchEvent(
    new CustomEvent('kertaskeluh:noteupdated', {
      detail: { note }
    })
  );

  return note;
}

export function deleteNote(id) {
  const idx = activeNotes.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  const deleted = activeNotes.splice(idx, 1)[0];
  saveNotes(activeNotes);
  notifyChange();
  window.dispatchEvent(
    new CustomEvent('kertaskeluh:notedeleted', {
      detail: { note: deleted, index: idx }
    })
  );
  return true;
}

export function addAndPublishNote({ html, image, color, authorId, authorName }) {
  const seed = Math.floor(Math.random() * 1000000);
  const rotation = Math.round(randomBetween(-3, 3) * 10) / 10;

  const newNote = {
    id: generateId(),
    html: sanitizeHtml(html || ''),
    image: image || null,
    color: color || 'butter',
    rotation,
    seed,
    createdAt: Date.now(),
    paid: true,
    authorId: authorId || 'anonymous',
    authorName: authorName || 'Anonim'
  };

  // Cerita terbaru diletakkan di indeks awal (paling dekat pintu masuk terowongan)
  activeNotes.unshift(newNote);
  saveNotes(activeNotes);

  notifyChange();

  window.dispatchEvent(
    new CustomEvent('kertaskeluh:notepublished', {
      detail: { note: newNote, index: 0 }
    })
  );

  return newNote;
}

export function initNotes() {
  tickerElement = document.querySelector('[data-js="ticker-count"]');
  activeNotes = loadNotes();
  updateTicker();
}
