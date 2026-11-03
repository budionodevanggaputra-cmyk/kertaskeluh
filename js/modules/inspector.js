// FILE: js/modules/inspector.js
import { getCurrentUser } from './auth.js';
import { deleteNote } from './notes.js';
import { resetInspection } from './tunnel/scene.js';
import { openDeleteConfirmModal } from './auth.js';
import { showToast } from './toast.js';
import { openComposerForEdit } from './composer.js';

let inspectorEl = null;
let authorEl = null;
let dateEl = null;
let editBtn = null;
let deleteBtn = null;
let closeBtn = null;
let currentInspectedNote = null;

function formatDisplayDate(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function updateInspectorState(note) {
  currentInspectedNote = note;

  if (!inspectorEl) return;

  if (!note) {
    inspectorEl.hidden = true;
    return;
  }

  const currentUser = getCurrentUser();
  const isOwner = Boolean(
    currentUser &&
    currentUser.id &&
    note.authorId &&
    note.authorId === currentUser.id
  );

  if (authorEl) {
    authorEl.textContent = note.authorName || (note.authorId === 'starter' ? 'Kertas Keluh' : 'Anonim');
  }

  if (dateEl) {
    dateEl.textContent = formatDisplayDate(note.createdAt);
  }

  if (editBtn) {
    editBtn.hidden = !isOwner;
  }

  if (deleteBtn) {
    deleteBtn.hidden = !isOwner;
  }

  inspectorEl.hidden = false;
}

export function initInspector() {
  inspectorEl = document.querySelector('[data-js="note-inspector"]');
  authorEl = document.querySelector('[data-js="inspector-author"]');
  dateEl = document.querySelector('[data-js="inspector-date"]');
  editBtn = document.querySelector('[data-js="inspector-edit-btn"]');
  deleteBtn = document.querySelector('[data-js="inspector-delete-btn"]');
  closeBtn = document.querySelector('[data-js="inspector-close-btn"]');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      resetInspection();
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (!currentInspectedNote) return;
      openComposerForEdit(currentInspectedNote, editBtn);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (!currentInspectedNote) return;
      const noteToDelete = currentInspectedNote;
      openDeleteConfirmModal(noteToDelete, () => {
        deleteNote(noteToDelete.id);
        resetInspection();
        showToast('Ceritamu berhasil dihapus dari papan.');
      });
    });
  }

  window.addEventListener('kertaskeluh:inspect', (e) => {
    const note = (e.detail && e.detail.note) || null;
    updateInspectorState(note);
  });

  window.addEventListener('kertaskeluh:authchange', () => {
    if (currentInspectedNote) {
      updateInspectorState(currentInspectedNote);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentInspectedNote) {
      const modal = document.querySelector('[data-js="modal-root"]');
      if (modal && !modal.hidden) return;
      resetInspection();
    }
  });
}
