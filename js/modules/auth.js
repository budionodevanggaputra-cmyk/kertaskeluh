// FILE: js/modules/auth.js
import { loadAuth, saveAuth, clearAuth, loadUsers, saveUsers } from './storage.js';
import { AUTH } from './config.js';
import { trapFocus } from './utils.js';
import { showToast } from './toast.js';
import { getUserNotes, deleteNote } from './notes.js';
import { inspectNoteById, resetInspection } from './tunnel/scene.js';
import { openComposerForEdit } from './composer.js';

let currentUser = null;
let modalRoot = null;
let modalDialog = null;
let previousActiveElement = null;
let cleanupFocusTrap = null;

export function getCurrentUser() {
  return currentUser;
}

export function isLoggedIn() {
  return Boolean(currentUser && currentUser.id);
}

export function login(name, pin = '') {
  const cleanName = (name || '').trim();
  const minLen = (AUTH && AUTH.minNameChars) || 2;
  const maxLen = (AUTH && AUTH.maxNameChars) || 24;

  if (cleanName.length < minLen || cleanName.length > maxLen) {
    return {
      success: false,
      error: `Nama harus antara ${minLen} sampai ${maxLen} karakter.`
    };
  }

  const users = loadUsers();
  let user = users.find((u) => u.name.toLowerCase() === cleanName.toLowerCase());

  if (user) {
    if (user.pin && pin && user.pin !== pin.trim()) {
      return {
        success: false,
        error: 'PIN tidak sesuai untuk nama ini. Masukkan PIN yang benar.'
      };
    }
  } else {
    user = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      name: cleanName,
      pin: pin ? pin.trim() : '',
      createdAt: Date.now()
    };
    users.push(user);
    saveUsers(users);
  }

  currentUser = { id: user.id, name: user.name };
  saveAuth(currentUser);
  updateAuthUI();

  window.dispatchEvent(
    new CustomEvent('kertaskeluh:authchange', { detail: { user: currentUser } })
  );

  return { success: true, user: currentUser };
}

export function logout() {
  const prevName = currentUser ? currentUser.name : '';
  currentUser = null;
  clearAuth();
  updateAuthUI();

  window.dispatchEvent(
    new CustomEvent('kertaskeluh:authchange', { detail: { user: null } })
  );

  if (prevName) {
    showToast(`Sampai jumpa, ${prevName}. Kamu sudah keluar.`);
  }
}

export function openAuthModal() {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');
  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;

  modalDialog.innerHTML = `
    <div class="auth-dialog">
      <div class="auth-dialog__header">
        <h2 class="auth-dialog__title" id="modal-title">Masuk ke Kertas Keluh</h2>
        <button type="button" class="button button--icon auth-dialog__close" data-js="auth-modal-close" aria-label="Tutup dialog">&times;</button>
      </div>

      <p class="auth-dialog__desc">
        Masuk atau buat nama akun agar kamu bisa <strong>menghapus ceritamu sendiri</strong> di papan kapan saja.
      </p>

      <form class="auth-form" data-js="auth-form">
        <div class="auth-form__field">
          <label class="auth-form__label" for="auth-input-name">Nama atau Nama Samaran</label>
          <input type="text" id="auth-input-name" class="auth-form__input" data-js="auth-input-name" placeholder="Misal: Budi, Rara, KucingHitam" maxlength="24" autocomplete="username" required>
        </div>

        <div class="auth-form__field">
          <label class="auth-form__label" for="auth-input-pin">PIN Rahasia (opsional)</label>
          <input type="password" id="auth-input-pin" class="auth-form__input" data-js="auth-input-pin" placeholder="4 angka atau kata sandi" maxlength="20" autocomplete="current-password">
          <span class="auth-form__hint">Gunakan PIN jika ingin mengunci akunmu dari perangkat ini.</span>
        </div>

        <div class="auth-form__error" data-js="auth-error-msg" hidden></div>

        <div class="auth-form__actions">
          <button type="submit" class="button button--pill button--accent auth-form__submit-btn" data-js="auth-submit-btn">
            Masuk / Buat Akun
          </button>
          <button type="button" class="button button--pill button--outline auth-form__cancel-btn" data-js="auth-cancel-btn">
            Batal
          </button>
        </div>
      </form>
    </div>
  `;

  modalRoot.hidden = false;
  cleanupFocusTrap = trapFocus(modalDialog, closeAuthModal);

  const closeBtn = modalDialog.querySelector('[data-js="auth-modal-close"]');
  const cancelBtn = modalDialog.querySelector('[data-js="auth-cancel-btn"]');
  const form = modalDialog.querySelector('[data-js="auth-form"]');
  const nameInput = modalDialog.querySelector('[data-js="auth-input-name"]');
  const pinInput = modalDialog.querySelector('[data-js="auth-input-pin"]');
  const errorMsg = modalDialog.querySelector('[data-js="auth-error-msg"]');

  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeAuthModal);

  if (nameInput) {
    setTimeout(() => nameInput.focus(), 60);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value;
      const pin = pinInput.value;
      const result = login(name, pin);

      if (result.success) {
        closeAuthModal();
        showToast(`Selamat datang, ${result.user.name}!`);
      } else if (errorMsg) {
        errorMsg.textContent = result.error || 'Gagal masuk. Coba lagi.';
        errorMsg.hidden = false;
      }
    });
  }
}

export function closeAuthModal() {
  if (modalRoot) modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}

export function openUserStoriesModal() {
  if (!isLoggedIn()) {
    openAuthModal();
    return;
  }

  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');
  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;
  const user = getCurrentUser();
  const myStories = getUserNotes(user.id);

  let storiesHtml = '';
  if (myStories.length === 0) {
    storiesHtml = `
      <div class="user-stories__empty">
        <p>Kamu belum memiliki cerita yang ditempel di papan.</p>
        <p class="user-stories__empty-hint">Klik <strong>Tulis ceritamu</strong> untuk mulai menaruh keluh.</p>
      </div>
    `;
  } else {
    storiesHtml = `
      <div class="user-stories__list">
        ${myStories.map((note) => {
          const dateStr = new Date(note.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const textExcerpt = (note.html || '').replace(/<[^>]*>/g, '').slice(0, 100);
          return `
            <div class="user-stories__item note-card--${note.color}" data-note-id="${note.id}">
              <div class="user-stories__item-header">
                <span class="user-stories__item-date">${dateStr}</span>
                <span class="user-stories__badge user-stories__badge--${note.color}">${note.color}</span>
              </div>
              <p class="user-stories__item-text">${textExcerpt || 'Catatan bergambar'}...</p>
              <div class="user-stories__item-actions">
                <button type="button" class="button button--pill button--outline user-stories__view-btn" data-action="view" data-id="${note.id}">
                  Lihat di Papan &rarr;
                </button>
                <button type="button" class="button button--pill button--outline user-stories__edit-btn" data-action="edit" data-id="${note.id}">
                  Edit
                </button>
                <button type="button" class="button button--pill button--danger user-stories__del-btn" data-action="delete" data-id="${note.id}">
                  Hapus
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  modalDialog.innerHTML = `
    <div class="user-stories">
      <div class="user-stories__header">
        <div>
          <h2 class="user-stories__title" id="modal-title">Cerita Saya</h2>
          <p class="user-stories__sub">Masuk sebagai: <strong>${user.name}</strong> (${myStories.length} cerita)</p>
        </div>
        <button type="button" class="button button--icon user-stories__close" data-js="user-stories-close" aria-label="Tutup dialog">&times;</button>
      </div>

      ${storiesHtml}

      <div class="user-stories__footer">
        <button type="button" class="button button--pill button--outline" data-js="user-stories-close-btn">
          Tutup
        </button>
      </div>
    </div>
  `;

  modalRoot.hidden = false;
  cleanupFocusTrap = trapFocus(modalDialog, closeUserStoriesModal);

  const closeBtn = modalDialog.querySelector('[data-js="user-stories-close"]');
  const closeBtn2 = modalDialog.querySelector('[data-js="user-stories-close-btn"]');
  if (closeBtn) closeBtn.addEventListener('click', closeUserStoriesModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeUserStoriesModal);

  modalDialog.querySelectorAll('[data-action="view"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      closeUserStoriesModal();
      inspectNoteById(id);
    });
  });

  modalDialog.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const noteToEdit = myStories.find((n) => n.id === id);
      if (noteToEdit) {
        closeUserStoriesModal();
        openComposerForEdit(noteToEdit);
      }
    });
  });

  modalDialog.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const noteToDelete = myStories.find((n) => n.id === id);
      if (noteToDelete) {
        openDeleteConfirmModal(noteToDelete, () => {
          deleteNote(id);
          showToast('Ceritamu berhasil dihapus dari papan.');
          openUserStoriesModal();
        });
      }
    });
  });
}

export function closeUserStoriesModal() {
  if (modalRoot) modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}

export function openDeleteConfirmModal(note, onConfirm) {
  modalRoot = document.querySelector('[data-js="modal-root"]');
  modalDialog = document.querySelector('[data-js="modal-dialog"]');
  if (!modalRoot || !modalDialog) return;

  previousActiveElement = document.activeElement;

  const textExcerpt = (note.html || '').replace(/<[^>]*>/g, '').slice(0, 80);

  modalDialog.innerHTML = `
    <div class="confirm-dialog">
      <div class="confirm-dialog__header">
        <h2 class="confirm-dialog__title" id="modal-title">Hapus Cerita Ini?</h2>
        <button type="button" class="button button--icon confirm-dialog__close" data-js="confirm-close" aria-label="Tutup dialog">&times;</button>
      </div>

      <p class="confirm-dialog__desc">
        Apakah kamu yakin ingin menghapus cerita ini dari papan? Cerita yang sudah dihapus tidak dapat dipulihkan kembali.
      </p>

      <blockquote class="confirm-dialog__preview note-card--${note.color || 'butter'}">
        <p>"${textExcerpt || 'Catatan tanpa teks'}..."</p>
      </blockquote>

      <div class="confirm-dialog__actions">
        <button type="button" class="button button--pill button--danger confirm-dialog__confirm-btn" data-js="confirm-delete-btn">
          Ya, Hapus Cerita
        </button>
        <button type="button" class="button button--pill button--outline confirm-dialog__cancel-btn" data-js="confirm-cancel-btn">
          Batal
        </button>
      </div>
    </div>
  `;

  modalRoot.hidden = false;
  cleanupFocusTrap = trapFocus(modalDialog, closeDeleteConfirmModal);

  const closeBtn = modalDialog.querySelector('[data-js="confirm-close"]');
  const cancelBtn = modalDialog.querySelector('[data-js="confirm-cancel-btn"]');
  const confirmBtn = modalDialog.querySelector('[data-js="confirm-delete-btn"]');

  if (closeBtn) closeBtn.addEventListener('click', closeDeleteConfirmModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteConfirmModal);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeDeleteConfirmModal();
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    });
  }
}

export function closeDeleteConfirmModal() {
  if (modalRoot) modalRoot.hidden = true;
  if (modalDialog) modalDialog.innerHTML = '';
  if (cleanupFocusTrap) {
    cleanupFocusTrap();
    cleanupFocusTrap = null;
  }
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}

export function updateAuthUI() {
  const loginBtn = document.querySelector('[data-js="auth-login-btn"]');
  const userMenu = document.querySelector('[data-js="auth-user-menu"]');
  const userNameEl = document.querySelector('[data-js="auth-user-name"]');
  const userAvatar = document.querySelector('[data-js="auth-avatar"]');

  if (!loginBtn || !userMenu) return;

  if (isLoggedIn()) {
    loginBtn.hidden = true;
    userMenu.hidden = false;
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  } else {
    loginBtn.hidden = false;
    userMenu.hidden = true;
  }
}

export function initAuth() {
  currentUser = loadAuth();

  const loginBtn = document.querySelector('[data-js="auth-login-btn"]');
  const logoutBtn = document.querySelector('[data-js="auth-logout-btn"]');
  const userBadge = document.querySelector('[data-js="auth-user-badge"]');

  if (loginBtn) {
    loginBtn.addEventListener('click', openAuthModal);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  if (userBadge) {
    userBadge.addEventListener('click', openUserStoriesModal);
  }

  updateAuthUI();
}
